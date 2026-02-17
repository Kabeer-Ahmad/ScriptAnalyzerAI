import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ScriptAnalyzerAI - AI-Powered Script Analysis & Transcription",
    template: "%s | ScriptAnalyzerAI"
  },
  description: "Transcribe, Analyze, and Chat with your media files using advanced AI. Get insights, summaries, and interactive chat for your audio and video content.",
  keywords: ["AI", "transcription", "script analysis", "audio analysis", "video analysis", "chat with pdf", "chat with video", "AssemblyAI", "Claude"],
  authors: [{ name: "ScriptAnalyzerAI Team" }],
  creator: "ScriptAnalyzerAI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scriptanalyzer.vercel.app",
    title: "ScriptAnalyzerAI - AI-Powered Script Analysis & Transcription",
    description: "Transcribe, Analyze, and Chat with your media files using advanced AI.",
    siteName: "ScriptAnalyzerAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScriptAnalyzerAI - AI-Powered Script Analysis & Transcription",
    description: "Transcribe, Analyze, and Chat with your media files using advanced AI.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
        {/* Favicon should be automatically handled by app/icon.tsx and app/apple-icon.tsx */}
      </body>
    </html>
  );
}
