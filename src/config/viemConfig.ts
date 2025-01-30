import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import { createClient, getContract, http } from "viem";
import { sepolia } from "viem/chains";

const userAddress = "0x3e6456985c2D1641ca11CDBEc5934B4DDb82f505";
const client = createClient({
  account: userAddress,
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi: MELODY_COIN_ABI,
  client,
});

export default contract;
