"use client";

import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { configureChains, mainnet, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // useEffect(() => {
  //   if (ready && !authenticated) {
  //     router.push("/");
  //   }
  // }, [ready, authenticated, router, user]);

  return (
    <html lang="en">
      <WagmiConfig config={config}>
      <body className={inter.className}>
          <Header />
          {children}
          <img
            src="/bg.svg"
            alt="bg"
            className="w-full h-full absolute top-0 opacity-25 z-[-1] object-cover"
          />
        <Toaster />
      </body>
      </WagmiConfig>
    </html>
  );
}
