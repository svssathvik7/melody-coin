"use client";
import Navbar from "@/components/Navbar";
import CheckBalance from "@/sections/CheckBalance";
import GetFaucetAssets from "@/sections/GetFaucetAssets";
import HeroSection from "@/sections/HeroSection";

export default function Home() {
  return (
    <div className="w-screen">
      <Navbar />
      <HeroSection />
      <div className="flex w-3/4 items-center justify-around gap-2">
        <CheckBalance />
        <GetFaucetAssets />
      </div>
    </div>
  );
}
