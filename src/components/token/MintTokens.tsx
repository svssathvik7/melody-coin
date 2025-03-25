"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BaseError, parseEther } from "viem";
import toaster from "@/utils/toaster";
import { mintTokensRevertMapping } from "@/utils/revertMapper";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { client } from "@/config/viemConfig";
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import MintAnimation from "@/assets/lotties/MintLottie.json";
import { AlertTriangleIcon, ArrowRightIcon, Info } from "lucide-react";
import dynamic from "next/dynamic";
import { getContractOwner } from "@/utils/contractFetcher";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function MintTokens() {
  const { isConnected } = useAccount();
  const [mintAmount, setMintAmount] = useState(0);
  const [receiverAddress, setReceiverAddress] = useState("");
  const { address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction();
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    const fetchContractOwner = async () => {
      const owner = await getContractOwner();
      setIsOwner(owner == address);
    };
    fetchContractOwner();
  }, [address]);

  useEffect(() => {
    const fetchContractOwner = async () => {
      const owner = await getContractOwner();
      setIsOwner(owner == address);
    };
    fetchContractOwner();
  }, [address]);
  const mintTokens = async () => {
    if (mintAmount == 0) {
      return toaster("error", "Mint value must be non zero");
    }
    try {
      const { request } = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "mint",
        account: address,
        args: [receiverAddress, parseEther(mintAmount.toString())],
      });
      writeContract(request);
    } catch (error) {
      console.log(error);
      if (error instanceof BaseError) {
        const errorText = mintTokensRevertMapping(error);
        toaster("error", errorText);
      } else {
        toaster("error", "Failed to get assets from faucet");
      }
    }
  };

  if (hash) {
    addRecentTransaction({
      hash,
      description: `Mint ${mintAmount}MLD tokens`,
    });
  }

  return (
    isConnected && (
      <Card className="w-full max-w-md mx-auto backdrop-blur-md bg-white/90 shadow-xl border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300">
        <CardHeader className="text-center bg-gradient-to-b from-white to-gray-50/50 p-6">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
            <Lottie
              loop={true}
              animationData={MintAnimation}
              className="w-full h-full relative z-10"
            />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <p className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Mint Tokens
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-5 h-5 text-cyan-500 animate-pulse" />
                </TooltipTrigger>
                <TooltipContent className="backdrop-blur-md bg-black/90 text-white w-[30dvw] rounded-xl p-4 border border-white/10 shadow-lg">
                  <p className="text-sm">
                    Not all the minted value is sent to the recipient! A share
                    of the minted value goes to faucet reserves.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label
              htmlFor="receiverAddress"
              className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
            >
              Receiver Address
            </Label>
            <div className="flex space-x-2">
              <Input
                id="receiverAddress"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                className="flex-grow border-gray-300/50 bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:border-cyan-500/50"
                placeholder="Enter receiver's address"
              />
              <Button
                onClick={() => setReceiverAddress(CONTRACT_ADDRESS)}
                variant="outline"
                className="whitespace-nowrap border-cyan-500/50 text-cyan-600 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:text-white transition-all duration-300 rounded-lg"
              >
                To Contract
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="mintAmount"
              className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
            >
              Mint Amount
            </Label>
            <Input
              id="mintAmount"
              value={mintAmount}
              onChange={(e) => setMintAmount(Number(e.target.value))}
              type="number"
              min={0.000000000000000001}
              step={0.000000000000000001}
              className="border-gray-300/50 bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:border-cyan-500/50"
              placeholder="Enter amount to mint"
            />
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-gradient-to-b from-transparent to-gray-50/30">
          {isOwner ? (
            <Button
              onClick={mintTokens}
              disabled={isConfirming}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isConfirming ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Minting...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Mint Tokens
                  <ArrowRightIcon className="ml-2 h-5 w-5 animate-pulse" />
                </span>
              )}
            </Button>
          ) : (
            <p className="text-red-500 text-sm font-medium flex items-center justify-center gap-2">
              <AlertTriangleIcon className="w-4 h-4" />
              Require owner access
            </p>
          )}
        </CardFooter>
      </Card>
    )
  );
}
