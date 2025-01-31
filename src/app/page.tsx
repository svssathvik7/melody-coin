"use client";
import Navbar from "@/components/Navbar";
import ApprovePayer from "@/components/token/ApprovePayer";
import CheckBalance from "@/components/token/CheckBalance";
import GetFaucetAssets from "@/components/token/GetFaucetAssets";
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
          <ApprovePayer />
        </div>
      ) : (
        <p className="text-white">Please connect to your wallet!</p>
      )}
    </div>
  );
}
