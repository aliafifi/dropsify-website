import { useState, useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  TextField,
  FormLayout,
  CalloutCard,
  Select,
  InlineStack,
  Badge,
  Link,
  Modal,
  List
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  let settings = await prisma.merchantSettings.findUnique({
    where: { shop },
  });

  if (!settings) {
    settings = await prisma.merchantSettings.create({
      data: { shop },
    });
  }

  return json({ settings });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();

  const billingPlan = formData.get("billingPlan") as string;
  const twilioSid = formData.get("twilioSid") as string;
  const twilioAuthToken = formData.get("twilioAuthToken") as string;
  const twilioPhone = formData.get("twilioPhone") as string;
  const twilioChannel = formData.get("twilioChannel") as string;
  const aiProvider = formData.get("aiProvider") as string;
  const aiApiKey = formData.get("aiApiKey") as string;
  const aiModel = formData.get("aiModel") as string;
  const systemPrompt = formData.get("systemPrompt") as string;
  const actionType = formData.get("actionType") as string;

  let isActive = formData.get("isActive") === "true";

  if (actionType === "toggleActive") {
    isActive = !isActive;
  }

  const settings = await prisma.merchantSettings.update({
    where: { shop },
    data: {
      billingPlan,
      twilioSid,
      twilioAuthToken,
      twilioPhone,
      twilioChannel,
      aiProvider,
      aiApiKey,
      aiModel,
      systemPrompt,
      isActive,
    },
  });

  return json({ settings });
};

export default function Index() {
  const { settings } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const currentSettings = fetcher.data?.settings || settings;

  const [formState, setFormState] = useState({
    billingPlan: currentSettings.billingPlan || "basic",
    twilioSid: currentSettings.twilioSid || "",
    twilioAuthToken: currentSettings.twilioAuthToken || "",
    twilioPhone: currentSettings.twilioPhone || "",
    twilioChannel: currentSettings.twilioChannel || "sms",
    aiProvider: currentSettings.aiProvider || "openrouter",
    aiApiKey: currentSettings.aiApiKey || "",
    aiModel: currentSettings.aiModel || "mistralai/mistral-7b-instruct:free",
    systemPrompt: currentSettings.systemPrompt || "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSaving = fetcher.state === "submitting" && fetcher.formData?.get("actionType") === "save";
  const isToggling = fetcher.state === "submitting" && fetcher.formData?.get("actionType") === "toggleActive";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      shopify.toast.show("Settings saved successfully");
    }
  }, [fetcher.state, fetcher.data, shopify]);

  const handleSave = () => {
    fetcher.submit(
      {
        ...formState,
        isActive: currentSettings.isActive.toString(),
        actionType: "save",
      },
      { method: "POST" }
    );
  };

  const handleToggle = () => {
    fetcher.submit(
      {
        ...formState,
        isActive: currentSettings.isActive.toString(),
        actionType: "toggleActive",
      },
      { method: "POST" }
    );
  };

  const planOptions = [
    { label: "Basic Plan - $2.99/mo (Bring Your Own Keys)", value: "basic" },
    { label: "Pro Plan - $19.99/mo (Use Dropsify AI Engine)", value: "pro" },
    { label: "Elite Plan - $49.99/mo (Unlimited Recoveries)", value: "elite" },
  ];

  const aiProviderOptions = [
    { label: "OpenRouter", value: "openrouter" },
    { label: "OpenAI", value: "openai" },
    { label: "Anthropic", value: "anthropic" },
  ];

  const handleAiProviderChange = (value: string) => {
    let defaultModel = "";
    if (value === "openai") defaultModel = "gpt-4o-mini";
    else if (value === "anthropic") defaultModel = "claude-3-haiku-20240307";
    else defaultModel = "mistralai/mistral-7b-instruct:free";

    setFormState({ ...formState, aiProvider: value, aiModel: defaultModel });
  };

  const aiModelOptions = (() => {
    switch (formState.aiProvider) {
      case "openai":
        return [
          { label: "GPT-5.4 Pro", value: "gpt-5.4-pro" },
          { label: "GPT-5.4", value: "gpt-5.4" },
          { label: "GPT-5.4 Thinking", value: "gpt-5.4-thinking" },
          { label: "GPT-5.3 Instant", value: "gpt-5.3-instant" },
          { label: "GPT-5 mini", value: "gpt-5-mini" },
          { label: "o1 Preview", value: "o1-preview" },
          { label: "GPT-4o", value: "gpt-4o" },
        ];
      case "anthropic":
        return [
          { label: "Claude Opus 4.6", value: "claude-4-6-opus-20260205" },
          { label: "Claude Sonnet 4.6", value: "claude-4-6-sonnet-20260217" },
          { label: "Claude Haiku 4.5", value: "claude-4-5-haiku-20251015" },
          { label: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20240620" }
        ];
      case "openrouter":
      default:
        return [
          { label: "DeepSeek V3.2 (Value King)", value: "deepseek/deepseek-v3.2" },
          { label: "Anthropic: Claude Opus 4.6", value: "anthropic/claude-4.6-opus" },
          { label: "Anthropic: Claude Sonnet 4.6", value: "anthropic/claude-4.6-sonnet" },
          { label: "OpenAI: GPT-5.4 Pro", value: "openai/gpt-5.4-pro" },
          { label: "Google: Gemini 3.1 Pro", value: "google/gemini-3.1-pro" },
          { label: "Meta: Llama 4 Maverick (Free)", value: "meta-llama/llama-4-maverick:free" },
          { label: "Mistral: Devstral 3.1 Small", value: "mistralai/devstral-3.1-small" },
          { label: "Mistral: Mistral 7B (Free)", value: "mistralai/mistral-7b-instruct:free" },
        ];
    }
  })();

  const personaOptions = [
    { label: "Select a Predefined Persona (Optional)", value: "custom" },
    { label: "Friendly Assistant (5% Discount)", value: "You are a helpful and polite customer service assistant. A user has left items in their cart. Check if they had any issues with checkout and offer to help. If they hesitate, offer a 5% discount code 'WELCOME5'." },
    { label: "Direct & Simple (10% Discount)", value: "You are a direct SMS assistant. Remind the customer about their cart. Offer a 10% discount to complete the purchase using code 'CART10' immediately." },
    { label: "Aggressive Closer (15% Urgent Discount)", value: "You are a highly persuasive sales assistant. A customer left items in their cart. Your goal is to close the sale immediately by offering a one-time 15% discount code 'COMEBACK15' that expires in 1 hour. Create a sense of urgency." },
    { label: "VIP Concierge (No Discount)", value: "You are a premium concierge for an exclusive brand. A VIP customer left items in their cart. Subtly remind them of the high quality and limited availability of the items. Do not offer discounts immediately, focus on value and service." },
  ];

  const handlePersonaChange = (value: string) => {
    if (value !== "custom") {
      setFormState({ ...formState, systemPrompt: value });
    }
  };

  const showCustomKeys = formState.billingPlan === "basic";

  return (
    <Page>
      <TitleBar title="CartRecovery AI Dashboard" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <CalloutCard
              title={currentSettings.isActive ? "CartRecovery AI is Active" : "CartRecovery AI is Paused"}
              illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd106eb7abdf7e937dcf0b15745.svg"
              primaryAction={{
                content: currentSettings.isActive ? "Pause AI Agent" : "Activate AI Agent",
                onAction: handleToggle,
              }}
            >
              <p>
                {currentSettings.isActive 
                  ? "The AI agent is currently monitoring and responding to abandoned checkouts automatically." 
                  : "The AI agent is paused. No abandoned checkouts will trigger SMS recovery."}
              </p>
            </CalloutCard>
            
            <Card>
              <BlockStack gap="500">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingMd">
                    Billing & Subscription
                  </Text>
                  <InlineStack gap="300" blockAlign="center">
                    <Button onClick={() => setIsModalOpen(true)}>Compare Pricing Plans</Button>
                    <Badge tone={formState.billingPlan === 'elite' ? 'magic' : formState.billingPlan === 'pro' ? 'success' : 'info'}>
                      {formState.billingPlan.toUpperCase()}
                    </Badge>
                  </InlineStack>
                </InlineStack>

                <FormLayout>
                  <Select
                    label="Choose Your Plan"
                    options={planOptions}
                    value={formState.billingPlan}
                    onChange={(value) => setFormState({ ...formState, billingPlan: value })}
                    helpText={showCustomKeys ? "Basic plan requires you to provide your own API keys." : "Pro and Elite plans use our managed API keys. You do not need to enter your own."}
                  />

                  <Select
                    label="Communication Channel"
                    options={[
                      { label: "SMS", value: "sms" },
                      { label: "WhatsApp", value: "whatsapp" },
                    ]}
                    value={formState.twilioChannel}
                    onChange={(value) => setFormState({ ...formState, twilioChannel: value })}
                    helpText={showCustomKeys ? "Ensure your custom Twilio number is approved for WhatsApp if selecting that option." : "Select whether to message the customer via standard SMS or WhatsApp."}
                  />

                  {showCustomKeys && (
                    <BlockStack gap="400">
                      <BlockStack gap="200">
                        <Text as="h3" variant="headingSm">Twilio Settings</Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Don't have a Twilio account? <Link url="https://www.twilio.com/try-twilio" target="_blank">Sign up here</Link> to get your API keys.
                        </Text>
                      </BlockStack>
                      <FormLayout.Group>
                        <TextField
                          label="Twilio Account SID"
                          value={formState.twilioSid}
                          onChange={(value) => setFormState({ ...formState, twilioSid: value })}
                          autoComplete="off"
                        />
                        <TextField
                          label="Twilio Auth Token"
                          value={formState.twilioAuthToken}
                          onChange={(value) => setFormState({ ...formState, twilioAuthToken: value })}
                          autoComplete="off"
                          type="password"
                        />
                      </FormLayout.Group>
                      <TextField
                        label="Twilio Phone Number"
                        value={formState.twilioPhone}
                        onChange={(value) => setFormState({ ...formState, twilioPhone: value })}
                        autoComplete="off"
                        placeholder="+1234567890"
                      />

                      <Text as="h3" variant="headingSm">AI Provider Settings</Text>
                      <FormLayout.Group>
                        <Select
                          label="AI Network"
                          options={aiProviderOptions}
                          value={formState.aiProvider}
                          onChange={handleAiProviderChange}
                        />
                        <TextField
                          label={`${formState.aiProvider.toUpperCase()} API Key`}
                          value={formState.aiApiKey}
                          onChange={(value) => setFormState({ ...formState, aiApiKey: value })}
                          autoComplete="off"
                          type="password"
                        />
                      </FormLayout.Group>
                      <Select
                        label="Target AI Model"
                        options={aiModelOptions}
                        value={formState.aiModel}
                        onChange={(value) => setFormState({ ...formState, aiModel: value })}
                        helpText="Select the AI model you want to use for generating SMS responses."
                      />
                    </BlockStack>
                  )}

                  <Text as="h3" variant="headingSm">AI Agent Persona</Text>
                  
                  <Select
                    label="Quick Start: Choose a Predefined Personality (or write your own below)"
                    options={personaOptions}
                    onChange={handlePersonaChange}
                    value={personaOptions.some(p => p.value === formState.systemPrompt) ? formState.systemPrompt : "custom"}
                  />
                  
                  <TextField
                    label="System Prompt"
                    value={formState.systemPrompt}
                    onChange={(value) => setFormState({ ...formState, systemPrompt: value })}
                    autoComplete="off"
                    multiline={4}
                    helpText="The core instructions for your AI agent. Tell it how to negotiate and what discounts it can offer."
                  />

                  <Button variant="primary" onClick={handleSave} loading={isSaving}>
                    Save Settings
                  </Button>
                </FormLayout>
              </BlockStack>
            </Card>
            <Modal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="CartRecovery AI Pricing Plans"
              primaryAction={{
                content: 'Close',
                onAction: () => setIsModalOpen(false),
              }}
            >
              <Modal.Section>
                <BlockStack gap="400">
                  <Text as="p">Choose the billing plan that best fits your technical expertise and store volume.</Text>
                  
                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">Basic Plan ($2.99 / month)</Text>
                      <Text tone="subdued" as="p">The "Bring Your Own Keys" (BYOK) plan for technically savvy merchants.</Text>
                      <List type="bullet">
                        <List.Item>Lowest monthly app cost.</List.Item>
                        <List.Item>You provide your own Twilio and AI Provider API keys.</List.Item>
                        <List.Item>You pay Twilio and the AI provider directly for exactly what you use (typically $0.01 - $0.03 per abandoned cart).</List.Item>
                        <List.Item>Full control over which specific AI model you use (e.g., GPT-5, Claude, DeepSeek).</List.Item>
                      </List>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">Pro Plan ($19.99 / month)</Text>
                      <Text tone="subdued" as="p">The automated "Done For You" plan for most active stores.</Text>
                      <List type="bullet">
                        <List.Item>No API keys required. We handle all the technical integrations invisibly in the background.</List.Item>
                        <List.Item>Includes up to 500 AI-powered SMS cart recoveries per month.</List.Item>
                        <List.Item>Uses our optimized internal AI models to secure the highest conversion rates.</List.Item>
                        <List.Item>Instant 1-click installation.</List.Item>
                      </List>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">Elite Plan ($49.99 / month)</Text>
                      <Text tone="subdued" as="p">The unlimited enterprise plan for high-volume stores.</Text>
                      <List type="bullet">
                        <List.Item>Unlimited AI-powered SMS cart recoveries every month.</List.Item>
                        <List.Item>No API keys required.</List.Item>
                        <List.Item>Priority AI processing.</List.Item>
                        <List.Item>Dedicated support line.</List.Item>
                      </List>
                    </BlockStack>
                  </Card>

                </BlockStack>
              </Modal.Section>
            </Modal>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
