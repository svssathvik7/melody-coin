"use client";
import Navbar from "@/components/Navbar";
import ApprovePayer from "@/components/token/ApprovePayer";
import CheckAllowance from "@/components/token/CheckAllowance";
import CheckBalance from "@/components/token/CheckBalance";
import GetFaucetAssets from "@/components/token/GetFaucetAssets";
import Transfer from "@/components/token/Transfer";
import HeroSection from "@/sections/HeroSection";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div className="w-screen">
      <Navbar />
      <HeroSection />
      {isConnected ? (
        <div className="flex w-screen items-center justify-around gap-2">
          <CheckBalance />
          <GetFaucetAssets />
          <CheckAllowance />
        </div>
      ) : (
        <p className="text-white">Please connect to your wallet!</p>
      )}
      {isConnected && (
        <div className="flex w-screen items-center justify-around gap-2">
          <ApprovePayer />
          <Transfer />
        </div>
      )}
    </div>
  );
}
