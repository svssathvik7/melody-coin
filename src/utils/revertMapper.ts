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

export const approveRevertMapping = (error: BaseError) => {
  const revertError = error.walk(
    (err) => err instanceof ContractFunctionExecutionError
  );
  if (!revertError) {
    return "Failed to approve payer!";
  }
  if (revertError.message.includes("InvalidAddress")) {
    return "Can't include zero address!";
  } else if (revertError.message.includes("ContractPaused")) {
    return "Contract paused! Can't approve payers";
  } else if (revertError.message.includes("FrontRunApprovalCheck")) {
    return "Approve allowance to zero first, to update the allowance!";
  }
  return "Error approving payer!";
};

export const transferRevertMapping = (error: BaseError) => {
  const revertError = error.walk(
    (err) => err instanceof ContractFunctionExecutionError
  );
  if (!revertError) {
    return "Failed to transfer funds!";
  }
  if (revertError.message.includes("InvalidAddress")) {
    return "Can't include zero address!";
  } else if (revertError.message.includes("ContractPaused")) {
    return "Contract paused! Can't approve payers";
  } else if (revertError.message.includes("InsufficientFunds")) {
    return "Insufficient funds!";
  } else {
    return "Error transferring funds!";
  }
};

export const transferFromRevertMapping = (error: BaseError) => {
  const revertError = error.walk(
    (err) => err instanceof ContractFunctionExecutionError
  );
  if (!revertError) {
    return "Failed to transfer funds!";
  }
  if (revertError.message.includes("InsufficientFunds")) {
    return "Insufficient funds at sender!";
  } else if (revertError.message.includes("ContractPaused")) {
    return "Contract paused! Can't approve payers";
  } else if (revertError.message.includes("InsufficientAllowance")) {
    return "Insufficient allowance!";
  } else {
    return "Error transferring funds!";
  }
};
