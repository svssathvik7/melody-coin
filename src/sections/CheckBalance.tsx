"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBalance } from "@/utils/contractFetcher";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function CheckBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<bigint | null>(BigInt(0));
  useEffect(() => {
    const fetchBalance = async () => {
      const balance: bigint = await getBalance(address as `0x${string}`) as bigint;
      setBalance(balance);
    };
    fetchBalance();
  }, [address]);
  return (
    <Card className="h-[30dvh] text-black bg-white w-[30dvw] flex flex-col items-center justify-center my-8">
      <CardHeader>
        <img className="w-20 rounded-full" alt="melody-coin-logo" src="./assets/melody-coin-logo.png"/>
      </CardHeader>
      <CardContent>
        <p>Your balance : {balance?.toString()} <strong>MLD</strong></p>
      </CardContent>
    </Card>
  );
}
