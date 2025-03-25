"use client";
import { trafficUpdater } from "@/utils/trafficUpdater";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";

export default function Navbar() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        trafficUpdater();
      }
    } catch (error) {
      console.error("Error updating traffic:", error);
    }
  }, []);
  return (
    <div className="w-[98dvw] md:w-[90dvw] mx-auto rounded-full flex items-center justify-between md:justify-center my-1 md:my-2 fixed top-0 backdrop-blur-md bg-black/80 p-1.5 md:p-2 z-50 border border-white/10 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
      <div className="w-auto md:w-1/2 flex items-center justify-start px-2">
        <p className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent text-lg md:text-2xl font-bold mx-1 md:mx-2 hover:scale-105 transition-transform duration-300">
          Melody Coin
        </p>
      </div>
      <div className="w-auto md:w-1/2 flex items-center justify-end px-1 md:px-2">
        <div className="transform hover:scale-105 transition-all duration-300">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
