"use client";
import Navbar from "@/components/Navbar";
import CheckBalance from "@/sections/CheckBalance";
import GetFaucetAssets from "@/sections/GetFaucetAssets";
import HeroSection from "@/sections/HeroSection";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div className="w-screen">
      <Navbar />
      <HeroSection />
      {isConnected ? (
        <div className="flex w-3/4 items-center justify-around gap-2">
          <CheckBalance />
          <GetFaucetAssets />
        </div>
      ) : (
        <p className="text-white">Please connect to your wallet!</p>
      )}
    </div>
  );
}
