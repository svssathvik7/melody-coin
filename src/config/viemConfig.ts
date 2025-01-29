import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import { createPublicClient, getContract, http } from "viem";
import { sepolia } from "viem/chains";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi: MELODY_COIN_ABI,
  client: publicClient,
});

export default contract;
