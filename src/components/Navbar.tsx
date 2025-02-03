"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <div className="w-[98dvw] md:w-[90dvw] mx-auto rounded-full flex items-center justify-between md:justify-center my-1 md:my-2 fixed top-0 bg-black p-1.5 md:p-2 z-50">
      <div className="w-auto md:w-1/2 flex items-center justify-start px-2">
        <p className="text-white text-lg md:text-2xl font-bold mx-1 md:mx-2">
          Melody Coin
        </p>
      </div>
      <div className="w-auto md:w-1/2 flex items-center justify-end px-1 md:px-2">
        <ConnectButton />
      </div>
    </div>
  );
}
