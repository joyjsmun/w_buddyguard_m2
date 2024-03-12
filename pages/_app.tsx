import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  embeddedWallet,
  ThirdwebProvider,
} from "@thirdweb-dev/react";
import { ArbitrumSepolia, Sepolia } from "@thirdweb-dev/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const StatusContext = React.createContext({
  statusText: "",
  setStatusText: (newStatus: string) => {},
});

export const SecretContext = React.createContext({
  statusSecret: "",
  setStatusSecret: (newStatus: string) => {},
  shares: [] as Buffer[],
  setShares: (newShares: Buffer[]) => {},
});

export default function App({ Component, pageProps }: AppProps) {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });

  const { locale } = useRouter() as { locale: string };

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
        authConfig={{
          domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
        }}
        activeChain={Sepolia}
        clientId="833996b2d080980da3975eb07563f830"
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet({ recommended: true }),
          walletConnect(),
          localWallet(),
          embeddedWallet({
            auth: {
              options: ["google", "apple"],
            },
          }),
        ]}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
