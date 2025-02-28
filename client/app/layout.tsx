// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { WalletProvider } from "@/providers/WalletContext";

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
    <html lang="en">
      <body className={`${inter.className} flex flex-col h-screen overflow-hidden`}>
        <WalletProvider>
          <Header />
          <main className="flex-1 overflow-hidden relative">
            {children}
          </main>
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
