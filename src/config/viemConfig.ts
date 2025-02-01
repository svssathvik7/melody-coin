import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import { createPublicClient, getContract, http } from "viem";
import { anvil, sepolia } from "viem/chains";
import { cookieStorage, createConfig, createStorage } from "wagmi";
import { metaMask, walletConnect } from "wagmi/connectors";

// Create the public client
export const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});
// Get the contract instance
const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi: MELODY_COIN_ABI,
  client,
});

export const walletClient = createConfig({
  chains: [sepolia],
  connectors: [
    walletConnect({
      projectId: "MelodyCoin",
    }),
    metaMask(),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [sepolia.id]: http(),
  },
});

export default contract;
