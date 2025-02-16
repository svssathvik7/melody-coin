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
import { ArrowRightIcon, Info } from "lucide-react";
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
      <Card className="w-full max-w-md mx-auto bg-white text-black shadow-lg h-[55dvh]">
        <CardHeader className="text-center">
          <Lottie
            loop={true}
            animationData={MintAnimation}
            className="w-24 mx-auto"
          />
          <CardTitle className="flex items-center justify-center gap-2">
            <p className="text-2xl font-bold">Mint Tokens</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white w-[30dvw] rounded-2xl p-3">
                  <p>
                    Not all the minted value is sent to the receipent! A share
                    of the minted value goes to faucet reserves.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receiverAddress" className="text-sm font-medium">
              Receiver Address
            </Label>
            <div className="flex space-x-2">
              <Input
                id="receiverAddress"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                className="flex-grow border-gray-300 focus:ring-2 focus:ring-black"
                placeholder="Enter receiver's address"
              />
              <Button
                onClick={() => setReceiverAddress(CONTRACT_ADDRESS)}
                variant="outline"
                className="whitespace-nowrap border-black hover:bg-black hover:text-white transition-colors"
              >
                To Contract
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mintAmount" className="text-sm font-medium">
              Mint Amount
            </Label>
            <Input
              id="mintAmount"
              value={mintAmount}
              onChange={(e) => setMintAmount(Number(e.target.value))}
              type="number"
              min={0.000000000000000001}
              step={0.000000000000000001}
              className="border-gray-300 focus:ring-2 focus:ring-black"
              placeholder="Enter amount to mint"
            />
          </div>
        </CardContent>
        <CardFooter>
          {isOwner ? (
            <Button
              onClick={mintTokens}
              disabled={isConfirming}
              className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              {isConfirming ? "Minting..." : "Mint Tokens"}
              {!isConfirming && <ArrowRightIcon className="ml-2 h-4 w-4" />}
            </Button>
          ) : (
            <p className="text-red-500 text-xs">Require owner access</p>
          )}
        </CardFooter>
      </Card>
    )
  );
}
