import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
export const wagmiConfig = getDefaultConfig({
  appName: "Melody Coin App",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || "MY APP ID",
  chains: [sepolia],
  ssr: true,
});
