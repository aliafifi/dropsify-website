import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dropsify — Shopify Apps That Actually Work",
  description:
    "We build powerful, affordable Shopify apps that solve real merchant problems. Analytics, bot protection, AI content, and more.",
  keywords:
    "Shopify apps, Shopify developer, ecommerce tools, Shopify analytics, bot protection",
  openGraph: {
    title: "Dropsify — Shopify Apps That Actually Work",
    description:
      "Powerful, affordable Shopify apps solving real merchant problems.",
    url: "https://dropsify.shop",
    siteName: "Dropsify",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
