import contract from "@/config/viemConfig";

export const getBalance = async (address: string) => {
  try {
    console.log("address : ", address);
    const balance = await contract.read.balanceOf([address]);
    // Ensure both values are of type BigInt (uppercase)
    const balanceInTokens: bigint = balance as bigint;
    return balanceInTokens / BigInt(10 ** 18);
  } catch (error) {
    console.log(error);
    return BigInt(0);
  }
};
