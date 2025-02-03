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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AlertCircle, Info, CheckCircle2, Loader2 } from "lucide-react";
import FaucetAnimation from "../../assets/lotties/FaucetLottie.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function GetFaucetAssets() {
  const { address, isConnected } = useAccount();
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
    isConnected && (
      <Card className="w-full max-w-md h-[55dvh] mx-auto my-8 text-black bg-white shadow-lg flex flex-col">
        <CardHeader className="pb-2 text-center">
          <div className="flex justify-center mb-2">
            <Lottie
              className="w-24"
              animationData={FaucetAnimation}
              loop={true}
            />
          </div>
          <CardTitle className="text-3xl font-bold mb-2">
            Melody Coin Faucet
          </CardTitle>
          <CardDescription className="text-gray-600 flex items-center justify-center gap-2">
            Get test MLD tokens
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white w-[30dvw] rounded-2xl p-3">
                  <p>
                    You can claim MLD tokens once every 24 hours. If your
                    balance is 1.5 MLD or more, you are not eligible for the
                    faucet.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-center px-6">
          <p className="text-center text-gray-700 mb-4">
            Faucet reserves are limited and are meant for testing purposes.
            Please avoid abuse!
          </p>
          {hash && (
            <div className="text-sm bg-gray-100 p-3 rounded-md mb-4 break-all">
              <span className="font-semibold">Transaction hash:</span> {hash}
            </div>
          )}
          {isConfirming && (
            <div className="text-sm text-blue-600 flex items-center justify-center gap-2 mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Waiting for confirmation...
            </div>
          )}
          {isConfirmed && (
            <div className="text-sm text-green-600 flex items-center justify-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4" />
              Transaction confirmed.
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={fetchAssetsFromFaucet}
            className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Getting 0.1 MLD...
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                Get 0.1 MLD
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    )
  );
}
