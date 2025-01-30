import contract from "@/config/viemConfig";
import { formatUnits } from "viem";

export const getBalance = async (address: string) => {
  try {
    console.log("address : ", address);
    const balance: bigint = (await contract.read.balanceOf([
      address,
    ])) as bigint;
    return formatUnits(balance, 18);
  } catch (error) {
    console.log(error);
    return BigInt(0);
  }
};
