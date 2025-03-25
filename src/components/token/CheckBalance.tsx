"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails"
import { getBalance } from "@/utils/contractFetcher"
import { useEffect, useState } from "react"
import { useAccount, useWatchContractEvent } from "wagmi"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Image from "next/image"
import { Label } from "../ui/label"

type TransferEvent = {
  from: `0x${string}`,
  to: `0x${string}`,
  value: bigint,
}

export default function CheckBalance() {
  const { address, isConnected } = useAccount()
  const [userAddress, setUserAddress] = useState<`0x${string}` | "">(address || "")
  const [balance, setBalance] = useState<string>("0")

  const fetchBalance = async () => {
    if (!userAddress) return
    const fetchedBalance = await getBalance(userAddress as `0x${string}`)
    setBalance(fetchedBalance)
  }

  useEffect(() => {
    if (address) {
      setUserAddress(address)
    }
  }, [address])

  // Fetch balance when userAddress changes
  useEffect(() => {
    if (userAddress) {
      fetchBalance()
    }
  }, [userAddress])

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
    isConnected && <Card className="w-full max-w-md mx-auto h-fit my-8 backdrop-blur-md bg-white/90 shadow-xl border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300">
      <CardHeader className="text-center pb-2 bg-gradient-to-b from-white to-gray-50/50">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
          <Image
            className="w-24 h-24 relative z-10 rounded-full"
            alt="melody-coin-logo"
            src="/assets/melody-coin-logo.png"
            width={24}
            height={24}
          />
        </div>
        <CardTitle className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
          Check MLD Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            Wallet Address
          </Label>
          <Input
            id="address"
            type="text"
            className="border-gray-300/50 bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:border-cyan-500/50"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value as `0x${string}`)}
            placeholder="Enter wallet address"
          />
        </div>
        <Button 
          onClick={fetchBalance} 
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-cyan-500/20"
        >
          Get Balance
        </Button>
        <div className="text-center backdrop-blur-sm bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl shadow-inner border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Current Balance</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">{balance} MLD</p>
        </div>
      </CardContent>
    </Card>
  )
}

