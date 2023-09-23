"use client";
import { useEffect, useState } from "react";
import {
  LensConfig,
  production,
  RequiredSigner,
  appId,
} from "@lens-protocol/react-web";
import { useWallets } from "@privy-io/react-auth";
import { JsonRpcProvider } from "@ethersproject/providers";

export const useLensConfig = (): LensConfig | null => {
  const [lensConfig, setLensConfig] = useState<LensConfig | null>(null);
  const { wallets } = useWallets();

  useEffect(() => {
    const wallet = wallets[0];
    if (!wallet) return;

    const getProvider = async (): Promise<JsonRpcProvider> => {
      const provider = await wallet.getEthersProvider();
      return provider;
    };

    const getSigner = async (): Promise<RequiredSigner> => {
      const provider = await wallet.getEthersProvider();
      await wallet.switchChain(137);
      if (!provider) return null as unknown as RequiredSigner;
      const signer = provider.getSigner();
      return signer;
    };

    setLensConfig({
      appId: appId("zerofi-nyc23"),
      sources: [appId("zerofi-nyc23")],
      bindings: {
        getProvider,
        getSigner,
      },
      environment: production,
    });
  }, [wallets]);

  return lensConfig;
};
