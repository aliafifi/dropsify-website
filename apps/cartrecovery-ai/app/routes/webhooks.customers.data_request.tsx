import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);

  // The topics handled here should be declared in the shopify.app.toml.
  // Fallback to 400 if the topic is not valid for this endpoint.
  if (topic !== "CUSTOMERS_DATA_REQUEST") {
    return new Response("Unhandled webhook topic", { status: 400 });
  }

  console.log(`Received CUSTOMERS_DATA_REQUEST for shop ${shop}`);

  // Payload contains customer info to process.
  // Acknowledge the webhook immediately to prevent retries.

  return new Response("Webhook processed", { status: 200 });
};
