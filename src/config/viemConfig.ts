import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import { get } from "http";
import {
  createClient,
  createPublicClient,
  createWalletClient,
  custom,
  getContract,
  http,
} from "viem";
import { sepolia } from "viem/chains";

export const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi: MELODY_COIN_ABI,
  client,
});

export default contract;
