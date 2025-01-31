import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { anvil, sepolia } from "wagmi/chains";
import { http } from "viem";
import { cookieStorage, createStorage } from "wagmi";
export const wagmiConfig = getDefaultConfig({
  appName: "Melody Coin App",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || "MY APP ID",
  chains: [sepolia, anvil],
  ssr: true,
  transports: {
    [sepolia.id]: http(),
    [anvil.id]: http(),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
});
