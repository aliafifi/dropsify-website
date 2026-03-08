import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { OpenAI } from "openai";
import twilio from "twilio";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (topic !== "CHECKOUTS_UPDATE") {
    return new Response("Unhandled webhook topic", { status: 200 });
  }

  const checkout = payload as any;

  // We only care if the customer left a phone number to text!
  if (!checkout.phone && !checkout.customer?.phone) {
    console.log(`[${shop}] Checkout updated, but no phone number found.`);
    return new Response("No phone number", { status: 200 });
  }

  const phone = checkout.phone || checkout.customer.phone;

  // Fetch the merchant's settings to get API keys
  const settings = await prisma.merchantSettings.findUnique({
    where: { shop },
  });

  if (!settings || !settings.isActive) {
    console.log(`[${shop}] AI Agent is paused or not configured.`);
    return new Response("App paused", { status: 200 });
  }

  // If they are on Basic, they MUST supply their own keys.
  if (settings.billingPlan === "basic") {
    if (!settings.twilioSid || !settings.twilioAuthToken || !settings.aiApiKey || !settings.twilioPhone) {
      console.log(`[${shop}] Missing custom API keys on Basic Plan.`);
      return new Response("Missing API config", { status: 200 });
    }
  }

  // TODO: If on Pro/Elite, we would pull the MASTER API KEYS from process.env here.
  // For now, we will assume the variables hold the active keys to use.
  const activeTwilioSid = settings.billingPlan === "basic" ? settings.twilioSid : process.env.MASTER_TWILIO_SID;
  const activeTwilioToken = settings.billingPlan === "basic" ? settings.twilioAuthToken : process.env.MASTER_TWILIO_TOKEN;
  const activeTwilioPhone = settings.billingPlan === "basic" ? settings.twilioPhone : process.env.MASTER_TWILIO_PHONE;
  const activeAiKey = settings.billingPlan === "basic" ? settings.aiApiKey : process.env.MASTER_AI_KEY;
  const activeAiProvider = settings.billingPlan === "basic" ? settings.aiProvider : (process.env.MASTER_AI_PROVIDER || "openai");
  const activeAiModel = settings.billingPlan === "basic" ? settings.aiModel : (process.env.MASTER_AI_MODEL || "gpt-4o-mini");

  if (!activeTwilioSid || !activeTwilioToken || !activeAiKey) {
     console.log(`[${shop}] Missing valid active API keys.`);
     return new Response("Missing active API keys", { status: 200 });
  }

  // Check if we already have an active conversation for this checkout
  const existingEvent = await prisma.cartRecoveryEvent.findUnique({
    where: { checkoutToken: checkout.token },
  });

  if (existingEvent) {
    console.log(`[${shop}] Already tracking checkout ${checkout.token}.`);
    return new Response("Already tracking", { status: 200 });
  }

  console.log(`[${shop}] NEW ABANDONED CART DETECTED for ${phone}! Initializing AI...`);

  // Parse what they left behind
  const items = checkout.line_items.map((item: any) => `${item.quantity}x ${item.title}`).join(", ");
  const total = checkout.total_price;

  // Initialize OpenAI Client (OpenAI SDK can connect to OpenAI, OpenRouter, and mostly Anthropic now)
  let baseURL = undefined;
  if (activeAiProvider === "openrouter") baseURL = "https://openrouter.ai/api/v1";
  
  const openai = new OpenAI({
    baseURL,
    apiKey: activeAiKey,
  });

  try {
    // Generate the opening message using the Merchant's System Prompt
    const completion = await openai.chat.completions.create({
      model: activeAiModel || "gpt-4o-mini",
      messages: [
        { role: "system", content: settings.systemPrompt || "You are a helpful assistant." },
        { 
          role: "user", 
          content: `The customer abandoned a cart worth $${total} containing: ${items}. Write a single, short, friendly SMS text message (max 2 sentences) to reach out to them and offer a discount to complete the purchase.`
        }
      ]
    });

    const aiMessage = completion.choices[0].message?.content;

    console.log(`🤖 AI (${settings.aiModel}) GENERATED MESSAGE: ${aiMessage}`);

    // Send the SMS via Twilio
    const twilioClient = twilio(activeTwilioSid, activeTwilioToken);
    
    await twilioClient.messages.create({
      body: aiMessage || "Hi from CartRecovery AI!",
      from: activeTwilioPhone || "",
      to: phone || ""
    });
    
    console.log(`📱 SMS successfully dispatched to ${phone}`);

    // Log it in our database
    await prisma.cartRecoveryEvent.create({
      data: {
        shop,
        checkoutToken: checkout.token,
        customerPhone: phone || "",
        cartContents: items,
        cartTotal: total,
        messages: JSON.stringify([{ role: "assistant", content: aiMessage || "" }]),
      }
    });

  } catch (error) {
    console.error(`[${shop}] AI Generation or SMS sending failed:`, error);
  }

  return new Response("Webhook processed", { status: 200 });
};
