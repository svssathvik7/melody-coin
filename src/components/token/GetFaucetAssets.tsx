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
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import toaster from "@/utils/toaster";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { faucetRevertMapping } from "@/utils/revertMapper";
import { BaseError } from "viem";
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import { useEffect } from "react";
import { client } from "@/config/viemConfig";

export default function GetFaucetAssets() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const fetchAssetsFromFaucet = async () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "getFaucetAssets",
        args: [],
      });
    } catch (error) {
      console.log(error);
      return toaster("error", (error as BaseError).shortMessage);
    }
  };
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });
  return (
    <Card className="h-[35dvh] w-full max-w-md bg-white text-black border border-gray-200 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">Melody Coin Faucet</CardTitle>
        <CardDescription className="text-gray-600">
          Get test MLD tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700">
          Faucet reserves are limited and are meant for testing purposes. Please
          avoid abuse! You can claim MLD tokens once every 24 hours. If your
          balance is 1.5 MLD or more, you are not eligible for the faucet.
        </p>
      </CardContent>
      <CardFooter>
        {hash && <div>Transaction hash : {hash}</div>}
        {isConfirming && (
          <div className="text-sm">Waiting for confirmation...</div>
        )}
        {isConfirmed && (
          <div className="text-sm text-green-600">Transaction confirmed.</div>
        )}
        {error && (
          <div className="text-sm text-red-600">
            Error: {(error as BaseError).shortMessage || error.message}
          </div>
        )}
        <Button
          onClick={fetchAssetsFromFaucet}
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
        >
          {isConfirming ? "Getting 0.1 MLD..." : "Get 0.1 MLD"}
        </Button>
      </CardFooter>
    </Card>
  );
}
