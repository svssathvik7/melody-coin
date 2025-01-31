"use client";

import React, { useEffect } from 'react';
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
  useWaitForTransactionReceipt,
  type BaseError,
  useAccount, 
} from "wagmi";
import { Loader2 } from "lucide-react";
import toaster from "@/utils/toaster";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { client } from '@/config/viemConfig';

export default function GetFaucetAssets() {
  const {address} = useAccount();
  const addRecentTransaction = useAddRecentTransaction();
  const fetchAssetsFromFaucet = async()=>{
    try {
      const result = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: 'getFaucetAssets',
        args: [],
        account: address
      });
      console.log("result : ",result);
    } catch (error) {
      console.log("Error at faucet " ,error);
    }
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
        
        {/* Show transaction hash when available */}
        {/* {hash && (
          <div className="text-xs text-gray-600 break-all">
            Transaction Hash: {hash}
          </div>
        )} */}
        
        {/* Show confirmation status */}
        {/* {isConfirming && (
          <div className="text-sm text-gray-600 mt-2">
            Waiting for confirmation...
          </div>
        )} */}
        
        {/* Show success message */}
        {/* {isConfirmed && (
          <div className="text-sm text-green-600 mt-2">
            Transaction confirmed.
          </div>
        )} */}
        
        {/* Show error message if present
        (
          <div className="text-sm text-red-600 mt-2">
              Error: {(error as BaseError)?.shortMessage || error?.name || "Unknown error"} 
          </div>
        ) */}
      </CardContent>
      <CardFooter>
        <Button
          onClick={fetchAssetsFromFaucet}
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
        >
          "Get 0.1 MLD"
        </Button>
      </CardFooter>
    </Card>
  );
}