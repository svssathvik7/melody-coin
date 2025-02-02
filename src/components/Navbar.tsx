"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <div className="w-[90dvw] mx-auto rounded-full flex items-center justify-center my-2 fixed top-0 bg-black p-2 z-50">
      <div className="w-1/2 flex items-center justify-start px-2">
        <p className="text-white text-2xl font-bold mx-2">Melody Coin</p>
      </div>
      <div className="w-1/2 flex items-center justify-end px-2">
        <ConnectButton />
      </div>
    </div>
  );
}
