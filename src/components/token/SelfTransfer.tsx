"use client";
import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import type React from "react"; // Added import for React

export default function SelfTransfer() {
  const { address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
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
    addRecentTransaction({
      hash,
      description: `Transferring ${amount}MLD to ${toAddress}`,
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-md bg-white/90 shadow-xl border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300">
      <form onSubmit={handleTransfer}>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label
              htmlFor="toAddress"
              className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
            >
              To Address
            </Label>
            <Input
              id="toAddress"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              required
              placeholder="Enter recipient's address"
              className="border-gray-300/50 bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:border-cyan-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
            >
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              placeholder="Enter amount to transfer"
              className="border-gray-300/50 bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:border-cyan-500/50"
              min={0.000000000000000001}
              step={0.000000000000000001}
            />
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-gradient-to-b from-transparent to-gray-50/30">
          {hash && (
            <div className="text-sm backdrop-blur-sm bg-black/5 p-4 rounded-xl break-all border border-gray-200/50 mb-4 w-full">
              <span className="font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                Transaction hash:
              </span>
              <span className="ml-2 text-gray-600">{hash}</span>
            </div>
          )}
          <Button
            type="submit"
            disabled={isConfirming}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-cyan-500/20"
          >
            {isConfirming ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Transferring...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Transfer
                <ArrowRightIcon className="ml-2 h-4 w-4 animate-pulse" />
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
