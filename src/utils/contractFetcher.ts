import contract from "@/config/viemConfig";
import { formatUnits } from "viem";
import toaster from "./toaster";

export const getOwner = async () => {
  try {
    const owner = await contract.read.owner_();
    return owner as `0x${string}`;
  } catch (error) {
    console.log(error);
    toaster("error", "Failed to get owner");
  }
};

export const getBalance = async (address: string) => {
  try {
    const balance: bigint = (await contract.read.balanceOf([
      address,
    ])) as bigint;
    return formatUnits(balance, 18);
  } catch (error) {
    console.log(error);
    toaster("error", "Failed to get balance");
    return formatUnits(BigInt(0), 18);
  }
};

export const getAllowance = async (owner: string, spender: string) => {
  try {
    const allowance: bigint = (await contract.read.allowance([
      owner,
      spender,
    ])) as bigint;
    return formatUnits(allowance, 18);
  } catch (error) {
    console.log(error);
    toaster("error", "Failed to fetch allowance");
  }
};
