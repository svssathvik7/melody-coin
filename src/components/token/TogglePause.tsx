"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { getContractOwner, getPauseState } from "@/utils/contractFetcher";
import { Button } from "@/components/ui/button";
import toaster from "@/utils/toaster";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { client } from "@/config/viemConfig";
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import ToggleAnimation from "@/assets/lotties/ToggleLottie.json";
import { PauseIcon, PlayIcon, AlertTriangleIcon } from "lucide-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function TogglePause() {
  const { address } = useAccount();
  const [isPaused, setIsPaused] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const addRecentTransaction = useAddRecentTransaction();
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    const fetchContractOwner = async () => {
      const owner = await getContractOwner();
      setIsOwner(owner == address);
    };
    fetchContractOwner();
  }, [address]);

  const fetchPauseState = async () => {
    const state = await getPauseState();
    setIsPaused(state);
  };

  useEffect(() => {
    fetchPauseState();
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: MELODY_COIN_ABI,
    eventName: "Paused",
    onLogs() {
      setIsPaused(true);
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: MELODY_COIN_ABI,
    eventName: "UnPaused",
    onLogs() {
      setIsPaused(false);
    },
  });

  const togglePauseState = async () => {
    try {
      const { request } = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "togglePause",
        account: address,
        args: [],
      });
      writeContract(request);
    } catch (error) {
      console.log(error);
      toaster("error", "Failed to toggle contract pause state!");
    }
  };

  if (hash) {
    addRecentTransaction({
      hash,
      description: `Toggle contract pause state to ${
        isPaused ? "resumed" : "paused"
      }`,
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white text-black shadow-lg h-[55dvh] border border-gray-200 overflow-hidden">
      <CardHeader className="text-center relative pb-0">
        <div className="relative w-24 h-24 mx-auto mb-2">
          <Lottie
            loop={true}
            animationData={ToggleAnimation}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gray-200 rounded-full opacity-30 animate-pulse"></div>
        </div>
        <CardTitle className="text-3xl font-bold text-black">
          Contract Pause State
        </CardTitle>
      </CardHeader>
      <CardDescription className="text-center text-gray-600 px-4 mt-2">
        <AlertTriangleIcon className="inline-block w-4 h-4 mr-1 text-black" />
        Owner-only action to halt all contract operations
      </CardDescription>
      <CardContent className="space-y-6 mt-4">
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-inner">
          <span className="font-medium text-gray-700">Current state:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 ${
              isPaused
                ? "bg-red-500 text-white shadow-red-500/50"
                : "bg-green-500 text-white shadow-green-500/50"
            } shadow-lg`}
          >
            {isPaused ? "PAUSED" : "ACTIVE"}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        {isOwner ? (
          <Button
            onClick={togglePauseState}
            disabled={isConfirming}
            className={`w-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isPaused
                ? "bg-white text-black border-2 border-black hover:bg-black hover:text-white focus:ring-black"
                : "bg-black text-white hover:bg-gray-800 focus:ring-black"
            } shadow-lg`}
          >
            {isConfirming ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
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
                Processing...
              </span>
            ) : (
              <>
                {isPaused ? (
                  <>
                    <PlayIcon className="mr-2 h-5 w-5 animate-pulse" />
                    Resume Contract
                  </>
                ) : (
                  <>
                    <PauseIcon className="mr-2 h-5 w-5 animate-pulse" />
                    Pause Contract
                  </>
                )}
              </>
            )}
          </Button>
        ) : (
          <p className="text-red-500 text-xs">Require owner access</p>
        )}
      </CardFooter>
    </Card>
  );
}
