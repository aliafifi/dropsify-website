import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  InlineStack,
  EmptyState,
  Select,
  Divider,
  Icon,
  List,
} from "@shopify/polaris";
import {
  CheckIcon,
  MagicIcon,
  SettingsIcon
} from "@shopify/polaris-icons";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import OpenAI from "openai";

// Load products for the dropdown
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    #graphql
    query getProducts {
      products(first: 20, sortKey: UPDATED_AT, reverse: true) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `);

  const responseJson = await response.json();
  const products = responseJson.data.products.edges.map((edge: any) => ({
    label: edge.node.title,
    value: edge.node.id,
  }));

  return { products };
};

// Handle form submission (OpenRouter Generation + Product Update)
export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const productId = formData.get("productId") as string;
  const tone = formData.get("tone") as string;

  if (!productId) {
    return json({ error: "Product ID is required" });
  }

  try {
    // 1. Fetch the product details (Title & existing description)
    const productResponse = await admin.graphql(`
      #graphql
      query getProductInfo($id: ID!) {
        product(id: $id) {
          title
          descriptionHtml
        }
      }
    `, { variables: { id: productId } });

    const productData = await productResponse.json();
    const productTitle = productData.data.product.title;
    const currentDescription = productData.data.product.descriptionHtml || "";

    // 2. Fallback if no OpenRouter Key is found
    if (!process.env.OPENROUTER_API_KEY) {
      console.warn("⚠️ OPENROUTER_API_KEY is missing! Using a mock description for preview purposes.");

      const mockDescription = `<h2>🌟 Unleash the Power of ${productTitle}!</h2>
      <p>Discover perfection with our latest addition. Whether you're upgrading your lifestyle or searching for the perfect gift, this ${tone} product promises unparalleled quality and design.</p>
      <ul>
        <li>Premium materials</li>
        <li>Sleek and versatile</li>
        <li>Guaranteed satisfaction</li>
      </ul>
      <p><em>(Note: This is a placeholder because the OpenRouter API key isn't set.)</em></p>`;

      // 3. Update the product on Shopify
      await admin.graphql(`
        #graphql
        mutation updateProduct($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
            }
          }
        }
      `, {
        variables: {
          input: {
            id: productId,
            descriptionHtml: mockDescription,
          }
        }
      });

      return json({ success: true, updatedProductId: productId });
    }

    // 4. Generate AI Description with OpenRouter (if key exists)
    // The openai npm package is fully compatible with OpenRouter when you change the baseURL
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    let tonePrompt = "professional and engaging";
    if (tone === "exciting") tonePrompt = "highly energetic, persuasive, and exciting";
    if (tone === "luxury") tonePrompt = "elegant, luxurious, exclusive, and refined";
    if (tone === "funny") tonePrompt = "funny, quirky, lighthearted, and relatable";

    const completion = await openai.chat.completions.create({
      // We can use any model from OpenRouter here!
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are a top-tier eCommerce copywriter. Your goal is to rewrite product descriptions to boost sales and SEO. Always return HTML formatted text (e.g., using <h2>, <p>, <ul>, <li>). Do NOT wrap the HTML in markdown code blocks like \`\`\`html. Keep the description under 150 words. The tone must be: ${tonePrompt}.`
        },
        {
          role: "user",
          content: `Write an SEO-optimized product description for a product named "${productTitle}". The existing description (if any) is: ${currentDescription}`
        }
      ],
    });

    const aiGeneratedHtml = completion.choices[0].message.content || "";

    // 5. Update the product on Shopify with the AI description
    await admin.graphql(`
      #graphql
      mutation updateProduct($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
          }
        }
      }
    `, {
      variables: {
        input: {
          id: productId,
          descriptionHtml: aiGeneratedHtml,
        }
      }
    });

    return json({ success: true, updatedProductId: productId });

  } catch (error: any) {
    console.error("Action Error:", error);
    return json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
};

export default function Index() {
  const { products } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const actionData = fetcher.data as any;
  const shopify = useAppBridge();

  const [selectedProduct, setSelectedProduct] = useState(
    products.length > 0 ? products[0].value : ""
  );
  const [tone, setTone] = useState("professional");

  // Track recent generations in memory
  const [recentGenerations, setRecentGenerations] = useState<{productName: string, time: string, numericId: string}[]>([]);
  const [hasProcessedCurrentSuccess, setHasProcessedCurrentSuccess] = useState(false);

  const isGenerating = fetcher.state === "submitting" || fetcher.state === "loading";

  // Reset process flag when a new submission starts
  useEffect(() => {
    if (fetcher.state === "submitting") {
      setHasProcessedCurrentSuccess(false);
    }
  }, [fetcher.state]);

  // Show Toast when Generation Completes & Update History
  useEffect(() => {
    if (actionData?.success && !hasProcessedCurrentSuccess) {
      shopify.toast.show("Product description updated successfully!");
      setHasProcessedCurrentSuccess(true);

      const p = products.find((pr: any) => pr.value === actionData.updatedProductId);
      if (p) {
        // Extract numeric ID from "gid://shopify/Product/123456"
        const numericId = actionData.updatedProductId.split("/").pop() || "";

        setRecentGenerations(prev => [{
          productName: p.label,
          time: new Date().toLocaleTimeString(),
          numericId
        }, ...prev]);
      }
    } else if (actionData?.error) {
      shopify.toast.show("Error: " + actionData.error, { isError: true });
    }
  }, [actionData, shopify, hasProcessedCurrentSuccess, products]);

  const handleGenerate = () => {
    fetcher.submit(
      { productId: selectedProduct, tone },
      { method: "POST" }
    );
  };

  // Currently selected product numeric ID for the direct link (if success)
  const successNumericId = actionData?.success ? actionData.updatedProductId.split("/").pop() : null;

  return (
    <Page>
      <TitleBar title="CopyFlow AI" />

      <BlockStack gap="500">
        <Layout>

          {/* Main Action Area */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <InlineStack align="start" blockAlign="center" gap="400">
                  {/* Cropped logo container to hide DALL-E outer background */}
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1a1a1a',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <img src="/logo.png" alt="CopyFlow AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <BlockStack gap="100">
                    <Text as="h2" variant="headingMd">
                      Generate AI Product Descriptions
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Select a product from your store and let AI rewrite its description to boost conversions and SEO.
                    </Text>
                  </BlockStack>
                </InlineStack>

                <Divider />

                {/* Form Controls */}
                <BlockStack gap="300">
                  {products.length === 0 ? (
                    <Text as="p" variant="bodyMd" tone="critical">
                      Oh no! You don't have any products in your store. Please create one to use CopyFlow AI.
                    </Text>
                  ) : (
                    <Select
                      label="Select Product"
                      options={products}
                      value={selectedProduct}
                      onChange={setSelectedProduct}
                    />
                  )}

                  <Select
                    label="Brand Tone"
                    options={[
                      { label: "Professional", value: "professional" },
                      { label: "Exciting & Energetic", value: "exciting" },
                      { label: "Luxurious & Elegant", value: "luxury" },
                      { label: "Funny & Quirky", value: "funny" },
                    ]}
                    value={tone}
                    onChange={setTone}
                  />

                  <InlineStack align="start">
                    <Button
                      variant="primary"
                      onClick={handleGenerate}
                      loading={isGenerating}
                      disabled={products.length === 0}
                    >
                      Generate Description
                    </Button>
                  </InlineStack>

                  {actionData?.success && successNumericId && (
                    <Box paddingBlockStart="200">
                      <InlineStack align="start" gap="400" blockAlign="center">
                        <Text as="p" variant="bodyMd" tone="success">
                          Success! Description generated.
                        </Text>
                        <Button
                          url={`shopify:admin/products/${successNumericId}`}
                          target="_top"
                          variant="plain"
                        >
                          View in Shopify Admin
                        </Button>
                      </InlineStack>
                    </Box>
                  )}
                </BlockStack>

              </BlockStack>
            </Card>

            <Box paddingBlockStart="500">
              <Card background="bg-surface-secondary">
                <BlockStack gap="400">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start', width: 'fit-content' }}>
                    <Icon source={MagicIcon} tone="magic" />
                    <Text as="h3" variant="headingMd" tone="magic">
                      Upgrade to CopyFlow Pro (Coming Soon)
                    </Text>
                  </div>

                  <Text as="p" variant="bodyMd">
                    Bulk-rewrite hundreds of product descriptions in seconds. Brand voice training, SEO optimization, and AliExpress review mining built right in.
                  </Text>

                  <Box paddingBlockStart="100">
                    <List type="bullet">
                      <List.Item>Bulk rewrite 100+ products at once</List.Item>
                      <List.Item>Brand voice training from examples</List.Item>
                      <List.Item>SEO-optimized structure (H1, meta)</List.Item>
                    </List>
                  </Box>
                </BlockStack>
              </Card>
            </Box>
          </Layout.Section>

          {/* Sidebar / Stats / Recent */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Recent Generations
                  </Text>
                  
                  {recentGenerations.length === 0 ? (
                    <Box paddingBlockStart="200">
                      <EmptyState
                        heading="No descriptions generated yet"
                        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                      >
                        <p>Your history of AI generated descriptions will appear here.</p>
                      </EmptyState>
                    </Box>
                  ) : (
                    <BlockStack gap="300">
                      {recentGenerations.map((gen, idx) => (
                        <div key={idx}>
                          <InlineStack align="space-between" blockAlign="center">
                            <BlockStack gap="100">
                              <Text as="p" variant="bodyMd" fontWeight="bold">
                                {gen.productName}
                              </Text>
                              <Text as="p" variant="bodySm" tone="subdued">
                                {gen.time}
                              </Text>
                            </BlockStack>
                            <Button size="micro" url={`shopify:admin/products/${gen.numericId}`} target="_top">
                              View
                            </Button>
                          </InlineStack>
                          {idx < recentGenerations.length - 1 && (
                            <Box paddingBlockStart="200" paddingBlockEnd="100">
                              <Divider />
                            </Box>
                          )}
                        </div>
                      ))}
                    </BlockStack>
                  )}
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

        </Layout>
      </BlockStack>
    </Page>
  );
}
