import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { client } from "@/config/viemConfig";
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { BaseError, parseEther } from "viem";
import { transferRevertMapping } from "@/utils/revertMapper";
import toaster from "@/utils/toaster";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

export default function SelfTransfer() {
  const { address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const { data: hash, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const handleTransfer = async () => {
    if (amount == 0) {
      return toaster("error", "Amount cannot be 0");
    }
    try {
      const amountInWei = parseEther(amount.toString());
      const { request } = await client.simulateContract({
        account: address,
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "transfer",
        args: [toAddress, amountInWei],
      });
      console.log("Amount  - ", amountInWei);
      console.log("toAddress - ", toAddress);
      writeContract(request);
    } catch (error) {
      console.log(error);
      if (error instanceof BaseError) {
        const errorText = transferRevertMapping(error);
        toaster("error", errorText);
      } else {
        toaster("error", "Failed to transfer funds");
      }
    }
  };
  if (hash) {
    console.log(hash);
    addRecentTransaction({
      hash,
      description: `Transferring ${amount} to ${toAddress}`,
    });
  }
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="toAddress">To Address</Label>
          <Input
            id="toAddress"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            min={0.000000000000000001}
            step={0.000000000000000001}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={isConfirming} onClick={handleTransfer}>
          {isConfirming ? "Transferring..." : "Transfer"}
        </Button>
      </CardFooter>
    </Card>
  );
}
