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
  const { isConnected } = useAccount();
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
      console.log(owner, address);
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
    isConnected && (
      <Card className="w-full max-w-md mx-auto backdrop-blur-md bg-white/90 shadow-xl border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300">
        <CardHeader className="text-center relative pb-0 bg-gradient-to-b from-white to-gray-50/50">
          <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
            <Lottie
              loop={true}
              animationData={ToggleAnimation}
              className="w-full h-full relative z-10"
            />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            Contract Pause State
          </CardTitle>
        </CardHeader>
        <CardDescription className="text-center px-6 mt-4 space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <AlertTriangleIcon className="inline w-5 h-5 text-cyan-500 flex-shrink-0 animate-pulse" />
            <p className="text-sm md:text-base inline font-medium text-gray-700">
              Owner-only action to halt all contract operations
            </p>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            When paused, all token transfers and transactions will be suspended.
            This is a security feature to protect users in case of emergencies.
          </p>
        </CardDescription>
        <CardContent className="space-y-6 mt-6 px-6">
          <div className="flex items-center justify-between backdrop-blur-sm bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl shadow-inner border border-gray-100">
            <span className="font-medium text-gray-700">Current state:</span>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
                isPaused
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/50"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/50"
              } shadow-lg hover:scale-105`}
            >
              {isPaused ? "PAUSED" : "ACTIVE"}
            </span>
          </div>
          {hash && (
            <div className="text-sm backdrop-blur-sm bg-black/5 p-4 rounded-xl break-all border border-gray-200/50">
              <span className="font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                Transaction hash:
              </span>
              <span className="ml-2 text-gray-600">{hash}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-6 bg-gradient-to-b from-transparent to-gray-50/30">
          {isOwner ? (
            <Button
              onClick={togglePauseState}
              disabled={isConfirming}
              className={`w-full transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl py-3 ${
                isPaused
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:shadow-cyan-500/50"
                  : "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg hover:shadow-purple-500/50"
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {isConfirming ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                <span className="flex items-center justify-center font-medium">
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
