"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { configureChains, mainnet, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { arbitrum, baseGoerli, goerli, scrollSepolia } from "viem/chains";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli, scrollSepolia, baseGoerli, arbitrum],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Zero Fi",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

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
      <body className={inter.className}>
        <WagmiConfig config={config}>
          <RainbowKitProvider chains={chains}>
            <Header />
            {children}
            <img
              src="/bg.svg"
              alt="bg"
              className="w-full h-full absolute top-0 opacity-25 z-[-1] object-cover"
            />
            <Toaster />
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
