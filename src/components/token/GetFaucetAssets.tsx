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

export default function GetFaucetAssets() {
  const { address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction();
  const {
    data: hash,
    error: initError,
    isPending: initPending,
    writeContract,
  } = useWriteContract();

  const fetchAssetsFromFaucet = async () => {
    if (!address) {
      toaster("error", "Connect your wallet to claim MLD.");
      return;
    }
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "getFaucetAssets",
        args: [],
      });
      if (hash) {
        addRecentTransaction({
          hash,
          description: "Get 0.1MLD",
        });
      }
    } catch (error) {
      console.error("Error at faucet ", error); // Use console.error for errors
      toaster("error", "Failed to get drip from faucet!");
    }
  };
  const {
    isLoading: txLoading,
    error: txError,
    isError: txIsError,
    data: txData,
    isSuccess: txIsSuccess,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    console.log("txIsLoading,", txLoading);
    console.log("txIsError,", txIsError);
    if (txIsError) {
      const error = txError;
      let errorMessage = "An unknown error occurred. Please try again later.";
      if (error instanceof BaseError) {
        errorMessage = faucetRevertMapping(error) || errorMessage; // Provide fallback
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toaster("error", errorMessage);
      return;
    }
    if (initError) {
      toaster("error", "Failed to get drip from faucet!");
      return;
    }
    if (txIsSuccess) {
      toaster("success", "Faucet assets claimed successfully!");
      return;
    }
    console.log("txError,", txError);
    console.log("txData,", txData);
    console.log("initError,", initError);
    console.log("initPending,", initPending);
  }, [
    txLoading,
    txIsError,
    txError,
    txData,
    initError,
    initPending,
    txIsSuccess,
  ]);

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
        <Button
          onClick={fetchAssetsFromFaucet}
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Get 0.1 MLD
        </Button>
      </CardFooter>
    </Card>
  );
}
