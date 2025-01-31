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
import {
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import toaster from "@/utils/toaster";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { client } from "@/config/viemConfig";
import { faucetRevertMapping } from "@/utils/revertMapper";
import { BaseError } from "viem";
import { Loader2 } from "lucide-react";

export default function GetFaucetAssets() {
  const { address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction();
  const { data: hash, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const fetchAssetsFromFaucet = async () => {
    try {
      const { result } = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "getFaucetAssets",
        args: [],
        account: address,
      });
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "getFaucetAssets",
        args: [],
      });
      console.log("result : ", result);
    } catch (error) {
      console.log("Error at faucet ", error);
      if (error instanceof BaseError) {
        const errorText = faucetRevertMapping(error);
        toaster("error", errorText);
      } else {
        toaster("error", "Failed to get MLD drip");
      }
    }
  };

  if (hash) {
    addRecentTransaction({
      hash,
      description: `Get 0.1 MLD`,
    });
  }

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
        {hash && (
          <div className="bg-gray-100 p-3 rounded-md">
            <h4 className="text-sm font-semibold mb-1">Transaction Hash:</h4>
            <p className="text-xs text-gray-600 break-all">{hash}</p>
          </div>
        )}
        {isConfirmed && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm">
            Transaction confirmed successfully!
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={fetchAssetsFromFaucet}
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
          disabled={isConfirming}
        >
          {isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting faucet...
            </>
          ) : (
            "Get 0.1 MLD"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
