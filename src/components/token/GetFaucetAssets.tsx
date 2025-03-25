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
      <Card className="w-full max-w-md h-[55dvh] mx-auto my-8 backdrop-blur-md bg-white/90 shadow-xl border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300">
        <CardHeader className="pb-2 text-center bg-gradient-to-b from-white to-gray-50/50">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
            <Lottie
              className="w-24"
              animationData={FaucetAnimation}
              loop={true}
            />
          </div>
          <CardTitle className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            Melody Coin Faucet
          </CardTitle>
          <CardDescription className="text-gray-600 flex items-center justify-center gap-2">
            Get test MLD tokens
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-cyan-500 animate-pulse" />
                </TooltipTrigger>
                <TooltipContent className="backdrop-blur-md bg-black/90 text-white w-[30dvw] rounded-xl p-4 border border-white/10 shadow-lg">
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
            <div className="text-sm backdrop-blur-sm bg-black/5 p-4 rounded-xl break-all border border-gray-200/50">
              <span className="font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                Transaction hash:
              </span>
              <span className="ml-2 text-gray-600">{hash}</span>
            </div>
          )}
          {isConfirming && (
            <div className="text-sm text-cyan-600 flex items-center justify-center gap-2 mb-4">
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
        <CardFooter className="p-6 bg-gradient-to-b from-transparent to-gray-50/30">
          <Button
            onClick={fetchAssetsFromFaucet}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-cyan-500/20"
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Getting 0.1 MLD...
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Get 0.1 MLD
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    )
  );
}
