"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <div className="w-full flex items-center justify-center my-2">
      <div className="w-1/2 flex items-center justify-start px-2">
        <p className="text-white text-2xl font-bold mx-2">Melody Coin</p>
      </div>
      <div className="w-1/2 flex items-center justify-end px-2">
        <ConnectButton />
      </div>
    </div>
  );
}
