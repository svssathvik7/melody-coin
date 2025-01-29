"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBalance } from "@/utils/contractFetcher";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function CheckBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<BigInt | null>(BigInt(0));
  useEffect(() => {
    const fetchBalance = async () => {
      const balance: BigInt = await getBalance(address as `0x${string}`);
      setBalance(balance);
    };
    fetchBalance();
  }, [address]);
  return (
    <Card className="text-black bg-white w-[30dvw] flex flex-col items-center justify-center my-8">
      <CardHeader>
        <img className="w-20 rounded-full" alt="melody-coin-logo" src="./assets/melody-coin-logo.png"/>
      </CardHeader>
      <CardContent>
        <p>Your balance : {balance?.toString()} <strong>MLD</strong></p>
      </CardContent>
    </Card>
  );
}
