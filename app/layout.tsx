"use client";

import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
// You can import additional chains from 'wagmi/chains'
// https://wagmi.sh/react/chains
//import {mainnet, goerli} from '@wagmi/chains';
//import {configureChains} from 'wagmi';
// You may replace this with your preferred providers
// https://wagmi.sh/react/providers/configuring-chains#multiple-providers
//import {publicProvider} from 'wagmi/providers/public';

// Replace the chains and providers with the ones used by your app.
// https://wagmi.sh/react/providers/configuring-chains
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygon, goerli, mainnet } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";

const { publicClient, webSocketPublicClient } = configureChains(
  [goerli, mainnet, polygon],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new InjectedConnector({
      options: {
        shimDisconnect: false, // see https://github.com/wagmi-dev/wagmi/issues/2511
      },
    }),
  ],
});

//const configureChainsConfig = configureChains([goerli], [publicProvider()]);

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router, user]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={config}>
          {/* <PrivyProvider
          appId={"clmw6e8nn00agjz0fq7vpdauj"}
          onSuccess={(user) => {
            router.push("/");
          }}
          config={{
            loginMethods: ["wallet"],
            appearance: {
              theme: "light",
              accentColor: "#676FFF",
              logo: "/logo-dark.png",
            },
          }}
        >
          <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig} > */}
          <Header />
          {children}
          <img
            src="/bg.svg"
            alt="bg"
            className="w-full h-full absolute top-0 opacity-25 z-[-1] object-cover"
          />
          {/* </PrivyWagmiConnector>
        </PrivyProvider> */}
        </WagmiConfig>
        <Toaster />
      </body>
    </html>
  );
}
