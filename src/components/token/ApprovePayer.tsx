"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toaster from "@/utils/toaster";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { BaseError, parseEther } from "viem";
import { client } from "@/config/viemConfig";
import { approveRevertMapping } from "@/utils/revertMapper";

export default function ApprovePayer() {
  const [spenderAddress, setSpenderAddress] = useState("");
  const [allowanceInEth, setAllowanceInEth] = useState<number | string>("");
  const addRecentTransaction = useAddRecentTransaction();
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const approveSpender = async () => {
    if (!spenderAddress || !allowanceInEth) {
      toaster("error", "Please fill in all fields");
      return;
    }

    try {
      const allowanceInWei = parseEther(allowanceInEth.toString());
      const { request } = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "approve",
        account: address,
        args: [spenderAddress, allowanceInWei],
      });
      writeContract(request);
    } catch (error) {
      console.log(error);
      if (error instanceof BaseError) {
        const errorText = approveRevertMapping(error);
        toaster("error", errorText);
      } else {
        toaster("error", "Failed to approve spender");
      }
    }
  };

  if (hash) {
    addRecentTransaction({
      hash,
      description: `Approve ${parseEther(
        allowanceInEth.toString()
      )} to ${spenderAddress}`,
    });
  }

  return (
    <Card className="h-[40dvh] text-black bg-white w-[30dvw] flex flex-col items-center justify-center my-8 overflow-y-scroll">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Approve a Spender</CardTitle>
        <CardDescription className="text-gray-600">
          Set allowance for a spender address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="spender-address">Spender Address</Label>
          <Input
            id="spender-address"
            value={spenderAddress}
            onChange={(e) => setSpenderAddress(e.target.value)}
            type="text"
            placeholder="0x..."
            className="border-gray-300 focus:border-black focus:ring-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="allowance">Allowance (ETH)</Label>
          <Input
            id="allowance"
            value={allowanceInEth}
            onChange={(e) => setAllowanceInEth(e.target.value)}
            type="number"
            step={0.00001}
            min={0.0000000000000000001}
            placeholder="0.00"
            className="border-gray-300 focus:border-black focus:ring-black"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={approveSpender}
          disabled={isConfirming || isConfirmed}
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
        >
          {isConfirming ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2" /> Confirming...
            </>
          ) : isConfirmed ? (
            "Approved ✅"
          ) : (
            "Approve"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
