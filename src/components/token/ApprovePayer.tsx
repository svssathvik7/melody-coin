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
      <Card className="w-full max-w-md mx-auto h-[65dvh] my-8 backdrop-blur-md bg-white/90 shadow-xl border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300">
        <CardHeader className="text-center pb-2 bg-gradient-to-b from-white to-gray-50/50">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
            <Lottie
              className="w-24"
              loop={true}
              animationData={ApproveAnimation}
            />
          </div>
          <CardTitle className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            Approve a Spender
          </CardTitle>
          <CardDescription className="text-gray-600">
            Set allowance for a spender address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow overflow-y-auto px-6">
          <div className="space-y-2">
            <Label
              htmlFor="spender-address"
              className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
            >
              Spender Address
            </Label>
            <Input
              id="spender-address"
              value={spenderAddress}
              onChange={(e) => setSpenderAddress(e.target.value)}
              type="text"
              placeholder="0x..."
              className="border-gray-300/50 bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:border-cyan-500/50 text-black"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="allowance"
              className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
            >
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
              className="border-gray-300/50 bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:border-cyan-500/50 text-black"
            />
          </div>
          {hash && (
            <div className="text-sm backdrop-blur-sm bg-black/5 p-4 rounded-xl break-all border border-gray-200/50">
              <span className="font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                Transaction hash:
              </span>
              <span className="ml-2 text-gray-600">{hash}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 bg-gradient-to-b from-transparent to-gray-50/30">
          <Button
            onClick={approveSpender}
            disabled={
              isLoading || !spenderAddress || !allowanceInEth || isConfirmed
            }
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-cyan-500/20"
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
