"use client";
import Navbar from "@/components/Navbar";
import ApprovePayer from "@/components/token/ApprovePayer";
import CheckAllowance from "@/components/token/CheckAllowance";
import CheckBalance from "@/components/token/CheckBalance";
import GetFaucetAssets from "@/components/token/GetFaucetAssets";
import MintTokens from "@/components/token/MintTokens";
import TogglePause from "@/components/token/TogglePause";
import Transfer from "@/components/token/Transfer";
import AdminBanner from "@/sections/AdminBanner";
import ConnectToWallet from "@/sections/ConnectToWallet";
import HeroSection from "@/sections/HeroSection";
import TokenDetails from "@/sections/TokenDetailsSection";
import { getContractOwner } from "@/utils/contractFetcher";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected, address } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    const checkIsOwner = async () => {
      const contractOwner = await getContractOwner();
      setIsOwner(address?.toLowerCase() === contractOwner?.toLowerCase());
    };
    checkIsOwner();
  });
  return (
    <div className="w-screen flex flex-col items-center justify-center">
      <Navbar />
      <HeroSection />
      {isConnected ? (
        <div className="flex w-screen items-center justify-around gap-2">
          <CheckBalance />
          <GetFaucetAssets />
          <CheckAllowance />
        </div>
      ) : (
        <ConnectToWallet />
      )}
      {isConnected && (
        <>
          <TokenDetails />
          <div className="flex w-screen items-center justify-around gap-2">
            <ApprovePayer />
            <Transfer />
          </div>
        </>
      )}
      {isConnected && isOwner && (
        <>
          <AdminBanner />
          <div className="flex w-screen items-center justify-around gap-2">
            <MintTokens />
            <TogglePause />
          </div>
        </>
      )}
    </div>
  );
}
