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
import { Loader2, CheckCircle2 } from "lucide-react";
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
import ApproveAnimation from "@/assets/lotties/ApproveLottie.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function ApprovePayer() {
  const { isConnected } = useAccount();
  const [spenderAddress, setSpenderAddress] = useState("");
  const [allowanceInEth, setAllowanceInEth] = useState<number | string>("");
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const addRecentTransaction = useAddRecentTransaction();
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
    isConnected && (
      <Card className="w-full max-w-md mx-auto h-[55dvh] my-8 text-black bg-white shadow-lg flex flex-col">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <Lottie
              className="w-24"
              loop={true}
              animationData={ApproveAnimation}
            />
          </div>
          <CardTitle className="text-3xl font-bold mb-2">
            Approve a Spender
          </CardTitle>
          <CardDescription className="text-gray-600">
            Set allowance for a spender address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow overflow-y-auto px-6">
          <div className="space-y-2">
            <Label htmlFor="spender-address" className="text-sm font-medium">
              Spender Address
            </Label>
            <Input
              id="spender-address"
              value={spenderAddress}
              onChange={(e) => setSpenderAddress(e.target.value)}
              type="text"
              placeholder="0x..."
              className="border-gray-300 focus:border-black focus:ring-black transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allowance" className="text-sm font-medium">
              Allowance (ETH)
            </Label>
            <Input
              id="allowance"
              value={allowanceInEth}
              onChange={(e) => setAllowanceInEth(e.target.value)}
              type="number"
              step={0.00001}
              min={0.0000000000000000001}
              placeholder="0.00"
              className="border-gray-300 focus:border-black focus:ring-black transition-all duration-300"
            />
          </div>
          {hash && (
            <div className="text-sm bg-gray-100 p-3 rounded-md break-all">
              <span className="font-semibold">Transaction hash:</span> {hash}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4">
          <Button
            onClick={approveSpender}
            disabled={
              isLoading || !spenderAddress || !allowanceInEth || isConfirmed
            }
            className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
          >
            {isLoading || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Granting...
              </>
            ) : isConfirmed ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Allowance granted
              </>
            ) : (
              "Grant Allowance"
            )}
          </Button>
        </CardFooter>
      </Card>
    )
  );
}
