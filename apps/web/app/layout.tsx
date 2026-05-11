import type { Metadata } from "next";
import "./globals.css";
import Nav from "../components/Nav";

export const metadata: Metadata = {
  title: {
    default: "SentinelOps AI",
    template: "%s | SentinelOps AI",
  },
  description:
    "SentinelOps AI — Enterprise trust layer for AI agents with prompt-risk detection, policy enforcement, role-based controls, and compliance-grade audit trails.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "SentinelOps AI",
    description: "Enterprise AI Agent Governance Platform",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen">
        <Nav />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
