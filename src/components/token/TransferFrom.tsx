"use client";

import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import toaster from "@/utils/toaster";
import { transferFromRevertMapping } from "@/utils/revertMapper";
import { BaseError, parseEther } from "viem";
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { client } from "@/config/viemConfig";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

export default function TransferFrom() {
  const addRecentTransaction = useAddRecentTransaction();
  const [spenderAddress, setSpenderAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [transferFromAmount, setTransferFromAmount] = useState(0);
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleTransferFrom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transferFromAmount == 0) {
      return toaster("error", "Amount cannot be 0");
    }
    console.log("Transfer From:", {
      spenderAddress,
      receiverAddress,
      amount: transferFromAmount,
    });
    try {
      const { request } = await client.simulateContract({
        account: address,
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "transferFrom",
        args: [
          spenderAddress,
          receiverAddress,
          parseEther(transferFromAmount.toString()),
        ],
      });
      writeContract(request);
    } catch (error) {
      console.log(error);
      if (error instanceof BaseError) {
        const errorText = transferFromRevertMapping(error);
        toaster("error", errorText);
      } else {
        toaster("error", "Failed to transfer funds");
      }
    }
  };

  if (hash) {
    addRecentTransaction({
      hash,
      description: `Transferring ${transferFromAmount}MLD, from ${spenderAddress} to ${receiverAddress}`,
    });
  }

  return (
    <div className="rounded-lg p-2 w-full">
      <Card className="w-full max-w-md bg-white text-black border border-gray-300 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center text-gray-900">
            Transfer From
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleTransferFrom}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="spenderAddress"
                className="text-sm font-medium text-gray-800"
              >
                Spender Address
              </Label>
              <Input
                id="spenderAddress"
                value={spenderAddress}
                onChange={(e) => setSpenderAddress(e.target.value)}
                required
                placeholder="Enter spender's address"
                className="border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="receiverAddress"
                className="text-sm font-medium text-gray-800"
              >
                Receiver Address
              </Label>
              <Input
                id="receiverAddress"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                required
                placeholder="Enter receiver's address"
                className="border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="transferFromAmount"
                className="text-sm font-medium text-gray-800"
              >
                Amount
              </Label>
              <Input
                id="transferFromAmount"
                type="number"
                value={transferFromAmount}
                onChange={(e) => setTransferFromAmount(Number(e.target.value))}
                required
                placeholder="Enter amount to transfer"
                className="border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-black"
                min={0.000000000000000001}
                step={0.000000000000000001}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:scale-105 bg-black text-white hover:bg-gray-900 rounded-lg"
            >
              {isConfirming ? "Transferring..." : "Transfer"}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
