import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, {  useEffect } from "react";
import { useRouter } from "next/router";
import Locale from 'next';
import {
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  embeddedWallet,
  rainbowWallet,
  lightTheme,
  ThirdwebProvider,
} from "@thirdweb-dev/react";
import { ArbitrumSepolia } from "@thirdweb-dev/chains";

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
  
  return (
    <ThirdwebProvider
      authConfig={{
        domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
      }}
      activeChain={ArbitrumSepolia}
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
  );
}
