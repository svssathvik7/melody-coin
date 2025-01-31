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
import { Loader2 } from "lucide-react";
import toaster from "@/utils/toaster";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";

export default function GetFaucetAssets() {
  const addRecentTransaction = useAddRecentTransaction();
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
  useEffect(() => {
    console.log("isConfirmed", isConfirmed);
    console.log("isConfirming", isConfirming);
    console.log("isError", isError);
    console.log("error", error);
    console.log("isPending", isPending);
    console.log("hash", hash);
    if (isConfirmed) {
      toaster("success", "0.1 MLD tokens requested");
    }
  }, [isConfirmed, isConfirming, isError, error, isPending, hash]);

  const fetchAssetsFromFaucet = async () => {
    console.log("Fetching assets from faucet");
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "getFaucetAssets",
        args: [],
      });
    } catch (error) {
      console.log(error);
      toaster("error", "Error fetching assets from faucet");
    }
  };

  // Add recent transaction once hash is available
  if (hash) {
    addRecentTransaction({
      hash,
      description: "Requesting 0.1 MLD",
    });
  }

  // Show error toaster if isError is true
  if (isError) {
    toaster("error", error?.message || "Something went wrong");
  }

  return (
    <Card className="h-[30dvh] w-full max-w-md bg-white text-black border border-gray-200 shadow-md overflow-y-scroll">
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
      </CardContent>
      <CardFooter>
        <Button
          onClick={fetchAssetsFromFaucet}
          disabled={isPending || isConfirming}
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
        >
          {isPending || isConfirming ? (
            <>
              Requesting 0.1 MLD...
              <Loader2 className="mx-1 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Get 0.1 MLD"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
