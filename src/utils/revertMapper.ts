import { BaseError, ContractFunctionExecutionError } from "viem";

export const faucetRevertMapping = (error: BaseError) => {
  const revertError = error.walk(
    (err) => err instanceof ContractFunctionExecutionError
  );
  if (!revertError) {
    return "Failed to fetch drip";
  }
  if (revertError.message.includes("TooFrequentRequests")) {
    return "Faucet drip limited to once per 24hours";
  } else if (revertError.message.includes("TooHighBalance")) {
    return "Faucet requester must have less than 1.5MLD";
  } else if (revertError.message.includes("DepletedFaucetReserves")) {
    return "Faucet reserves depleted";
  }
  return "Error fetching drip";
};
