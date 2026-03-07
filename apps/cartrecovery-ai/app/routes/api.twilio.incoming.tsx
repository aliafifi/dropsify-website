import type { ActionFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";
import { OpenAI } from "openai";
import twilio from "twilio";

const MessagingResponse = twilio.twiml.MessagingResponse;

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Parse Twilio webhook payload
  const formData = await request.formData();
  const fromPhone = formData.get("From") as string;
  const toPhone = formData.get("To") as string;
  const incomingMessage = formData.get("Body") as string;

  console.log(`[Twilio Inbound] Received SMS from ${fromPhone}: ${incomingMessage}`);

  // Find the CartRecovery event waiting for this phone number
  const activeEvent = await prisma.cartRecoveryEvent.findFirst({
    where: { 
      customerPhone: fromPhone,
      recoveryStatus: "PENDING"
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!activeEvent) {
    console.log(`[Twilio Inbound] No pending CartRecovery event found for ${fromPhone}. Ignored.`);
    const twiml = new MessagingResponse();
    return new Response(twiml.toString(), {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  // We found a match. Get the merchant settings to talk to AI.
  const settings = await prisma.merchantSettings.findUnique({
    where: { shop: activeEvent.shop }
  });

  if (!settings || !settings.isActive) {
    console.log(`[Twilio Inbound] Merchant API keys missing or app paused.`);
    const twiml = new MessagingResponse();
    return new Response(twiml.toString(), { status: 200, headers: { "Content-Type": "text/xml" } });
  }

  const activeAiKey = settings.billingPlan === "basic" ? settings.aiApiKey : process.env.MASTER_AI_KEY;

  if (!activeAiKey) {
     console.log(`[Twilio Inbound] Missing active AI keys.`);
     const twiml = new MessagingResponse();
     return new Response(twiml.toString(), { status: 200, headers: { "Content-Type": "text/xml" } });
  }

  // Parse conversation history
  const history = JSON.parse(activeEvent.messages);
  
  // Add the customer's reply to history
  const newHistory = [...history, { role: "user", content: incomingMessage }];

  let baseURL = undefined;
  if (settings.aiProvider === "openrouter") baseURL = "https://openrouter.ai/api/v1";

  // Call AI to generate response
  const openai = new OpenAI({
    baseURL,
    apiKey: activeAiKey,
  });

  let aiResponseText = "";
  try {
    const completion = await openai.chat.completions.create({
      model: settings.aiModel || "mistralai/mistral-7b-instruct:free",
      messages: [
        { role: "system", content: settings.systemPrompt || "You are a helpful assistant trying to save an abandoned cart." },
        ...newHistory
      ]
    });

    aiResponseText = completion.choices[0].message?.content || "I'm sorry, I didn't quite catch that.";

    // Add AI reply to history
    newHistory.push({ role: "assistant", content: aiResponseText });

    // Save back to database
    await prisma.cartRecoveryEvent.update({
      where: { id: activeEvent.id },
      data: { messages: JSON.stringify(newHistory) }
    });

  } catch (error) {
    console.error("[Twilio Inbound] AI Generation Error:", error);
    aiResponseText = "We are currently experiencing technical difficulties. An agent will be with you shortly.";
  }

  // Reply back to Twilio with TwiML
  const twiml = new MessagingResponse();
  twiml.message(aiResponseText);

  return new Response(twiml.toString(), {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
};
