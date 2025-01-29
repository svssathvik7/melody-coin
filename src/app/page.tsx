"use client";
import Navbar from "@/components/Navbar";
import CheckBalance from "@/sections/CheckBalance";
import HeroSection from "@/sections/HeroSection";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div className="">
      <Navbar />
      <HeroSection />
      <CheckBalance />
    </div>
  );
}
