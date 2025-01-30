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
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { AlertCircle, Loader2 } from "lucide-react";

export default function GetFaucetAssets() {
  const {
    data: hash,
    isPending,
    writeContract,
    isError,
    error,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const fetchAssetsFromFaucet = async () => {
    console.log("Fetching assets from faucet");
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "getFaucetAssets",
        args: [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="h-[30dvh] w-full max-w-md bg-white text-black border border-gray-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Melody Coin Faucet</CardTitle>
        <CardDescription className="text-gray-600">
          Get test MLD tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">
          Faucet reserves are limited and are meant for testing purposes. Please
          avoid abuse!
        </p>
        {isError && (
          <div className="flex items-center space-x-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">
              Error: {error?.message || "Failed to fetch assets"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={fetchAssetsFromFaucet}
          disabled={isPending || isConfirming}
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting 0.1 MLD...
            </>
          ) : (
            "Get 0.1 MLD"
          )}
        </Button>
      </CardFooter>
      {isConfirmed && (
        <div className="px-6 py-2 bg-gray-100 text-center text-sm text-gray-700">
          Transaction confirmed! Check your wallet for MLD tokens.
        </div>
      )}
    </Card>
  );
}
