// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { RainbowKitProvider } from "@/providers/RainbowKitProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WAaaS Chat - Web3 Assistant",
  description: "Blockchain AI Assistant with Web3 capabilities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col h-full bg-zinc-900`}>
        <RainbowKitProvider>
          <div className="flex flex-col h-full">
            <Header />
            <main className="flex-1 h-full overflow-hidden">
              {children}
            </main>
          </div>
          <Toaster />
        </RainbowKitProvider>
      </body>
    </html>
  );
}
