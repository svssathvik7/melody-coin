"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails"
import { getBalance } from "@/utils/contractFetcher"
import { useEffect, useState } from "react"
import { useAccount, useWatchContractEvent } from "wagmi"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Image from "next/image"

type TransferEvent = {
  from: `0x${string}`,
  to: `0x${string}`,
  value: bigint,
}

export default function CheckBalance() {
  const { address } = useAccount()
  const [userAddress, setUserAddress] = useState<`0x${string}` | "">(address || "")
  const [balance, setBalance] = useState<string>("0")

  const fetchBalance = async () => {
    if (!userAddress) return
    const fetchedBalance = await getBalance(userAddress as `0x${string}`)
    setBalance(fetchedBalance)
  }

  useEffect(
    ()=>{
      fetchBalance();
    });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: MELODY_COIN_ABI,
    eventName: "Transfer",
    onLogs(logs) {
      if (!address) return
      const event = logs[0] as unknown as {
        args: TransferEvent
      };
      const from = event.args.from;
      const to = event.args.to;
      if (address === from || address === to) {
        fetchBalance()
      }
    },
  })

  return (
    <Card className="w-full max-w-md mx-auto h-[55dvh] my-8 text-black bg-white shadow-lg">
      <CardHeader className="text-center">
        <Image
          className="w-24 h-24 mx-auto mb-4 rounded-full shadow-md"
          alt="melody-coin-logo"
          src="/assets/melody-coin-logo.png"
          width={24}
          height={24}
        />
        <CardTitle className="text-2xl font-bold">Check MLD Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium">
            Wallet Address
          </label>
          <Input
            id="address"
            type="text"
            className="w-full border-gray-300 focus:border-black focus:ring-black"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value as `0x${string}`)}
            placeholder="Enter wallet address"
          />
        </div>
        <Button onClick={fetchBalance} className="w-full bg-black text-white hover:bg-gray-800 transition-colors">
          Get Balance
        </Button>
        <div className="text-center">
          <p className="text-sm text-gray-600">Current Balance</p>
          <p className="text-3xl font-bold">{balance} MLD</p>
        </div>
      </CardContent>
    </Card>
  )
}

