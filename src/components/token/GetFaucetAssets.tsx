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
import { BaseError } from "viem";
import { faucetRevertMapping } from "@/utils/revertMapper";
import { client } from "@/config/viemConfig";
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

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
      const { request } = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "getFaucetAssets",
        account: address,
        args: [],
      });
      writeContract(request);
    } catch (error) {
      console.log(error);
      if (error instanceof BaseError) {
        const errorText = faucetRevertMapping(error);
        toaster("error", errorText);
      } else {
        toaster("error", "Failed get assets from faucet");
      }
    }
  };

  if (hash) {
    addRecentTransaction({
      hash,
      description: `Get 0.1MLD from faucet`,
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
      </CardContent>
      <CardFooter>
        {hash && <div>Transaction hash : {hash}</div>}
        {isConfirming && (
          <div className="text-sm">Waiting for confirmation...</div>
        )}
        {isConfirmed && (
          <div className="text-sm text-green-600">Transaction confirmed.</div>
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
