import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);

  if (topic !== "SHOP_REDACT") {
    return new Response("Unhandled webhook topic", { status: 400 });
  }

  console.log(`Received SHOP_REDACT for shop ${shop}`);

  // Purge all store data and configuration to comply with GDPR

  return new Response("Webhook processed", { status: 200 });
};
