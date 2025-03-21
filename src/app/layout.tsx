import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "600", "800"]
})

export const metadata: Metadata = {
  title: "ScamShield - AI-Powered Scam Detection",
  description:
    "ScamShield helps you detect and prevent online scams using AI-powered analysis. Identify fraudulent messages, emails, and links in real-time.",
  keywords: [
    "ScamShield",
    "scam detection",
    "fraud prevention",
    "AI scam filter",
    "phishing protection",
    "online safety",
    "spam detection",
    "fraudulent messages",
    "cybersecurity",
    "scam prevention",
  ],
  openGraph: {
    title: "ScamShield - AI-Powered Scam Detection",
    description:
      "Stay safe online with ScamShield. Our AI scans messages, emails, and links to detect scams in real-time.",
    url: "https://scamshield.app", // Change to your actual domain
    siteName: "ScamShield",
    images: [
      {
        url: "/scamshield-og.png", // Replace with your actual image
        width: 1200,
        height: 630,
        alt: "ScamShield - AI Scam Detection",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScamShield - AI-Powered Scam Detection",
    description:
      "Detect and prevent scams with ScamShield’s AI-powered analysis. Stay protected from fraud, phishing, and online scams.",
    images: ["/scamshield-og.png"], // Replace with your actual image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
