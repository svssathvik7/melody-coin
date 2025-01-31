"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";
import { getBalance } from "@/utils/contractFetcher";
import { useEffect, useState } from "react";
import { useAccount, useWatchContractEvent } from "wagmi";

export default function CheckBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<string>("0");
  const fetchBalance = async () => {
    const balance = await getBalance(address as `0x${string}`);
    setBalance(balance);
  };
  useEffect(() => {
    fetchBalance();
  }, [address]);


  useWatchContractEvent(
    {
      address: CONTRACT_ADDRESS,
      abi: MELODY_COIN_ABI,
      eventName: "Transfer",
      onLogs(logs){
        if(!address){
          return;
        }
        // ignore the errors, saying args does not exists
        const from = logs[0].args.from;
        const to = logs[0].args.to;
        const relevantTransfer =  address == from || address == to;
        if(relevantTransfer){
          fetchBalance();
        }
      }
    }
  )
  return (
    <Card className="h-[35dvh] text-black bg-white w-[30dvw] flex flex-col items-center justify-center my-8">
      <CardHeader>
        <img className="w-20 rounded-full" alt="melody-coin-logo" src="./assets/melody-coin-logo.png"/>
      </CardHeader>
      <CardContent>
        <p>Your balance : {balance?.toString()} <strong>MLD</strong></p>
      </CardContent>
    </Card>
  );
}
