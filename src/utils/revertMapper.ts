export const getFaucetAssetReverts = (errorName: string) => {
  if (errorName === "ContractFunctionExecutionError") {
    return "Failed to request 0.1MLD!";
  }
};
