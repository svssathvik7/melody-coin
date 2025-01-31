import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import { createPublicClient, getContract, http } from "viem";
import { anvil } from "viem/chains";

// Define the local Anvil chain
// const anvil = {
//   id: 31337,
//   name: "Anvil",
//   network: "anvil",
//   nativeCurrency: {
//     decimals: 18,
//     name: "Ethereum",
//     symbol: "ETH",
//   },
//   rpcUrls: {
//     default: {
//       http: ["http://127.0.0.1:8545"],
//     },
//     public: {
//       http: ["http://127.0.0.1:8545"],
//     },
//   },
// } as const;

// Create the public client
export const client = createPublicClient({
  chain: anvil,
  transport: http(),
});

// Get the contract instance
const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi: MELODY_COIN_ABI,
  client,
});

export default contract;
