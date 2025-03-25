"use client";
import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { getContractOwner } from "@/utils/contractFetcher";

export default function AdminBanner() {
  const [owner, setOwner] = useState("0x00..0000");
  const fetchOwner = async () => {
    const owner = await getContractOwner();
    setOwner(owner || "0x00..0000");
  };
  useEffect(() => {
    fetchOwner();
  }, []);
  return (
    <section className="glass-effect w-[95%] md:w-5/6 mx-auto my-[5dvh] md:my-[10dvh] flex flex-col items-center justify-center h-fit p-8 md:p-10 gap-6 md:gap-10 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a72] to-[#009ffd] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>

      <h2 className="text-4xl md:text-5xl lg:text-6xl w-full md:w-3/4 text-center font-bold px-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300">
        Admin Actions
      </h2>

      <div className="w-full md:w-4/5 flex flex-col gap-4 p-6 glass-effect bg-opacity-50 rounded-xl">
        <p className="text-center text-gray-300 text-sm md:text-lg px-2 md:px-0 leading-relaxed">
          Admin actions in MelodyCoin require owner-level access rights. The
          <span className="text-cyan-400 font-semibold"> onlyAdmin </span>
          functions include{" "}
          <span className="text-cyan-400 font-semibold">mint</span>, which
          allows the owner to mint a specified amount of MLD tokens to a
          designated address, and{" "}
          <span className="text-cyan-400 font-semibold">togglePause</span>,
          which lets the owner pause or unpause the contract in critical
          situations.
        </p>

        <div className="flex items-center justify-center gap-2">
          <a
            href="https://github.com/svssathvik7/melody-coin-smart-contract/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all duration-300 text-sm md:text-base group/link"
          >
            View Detailed Tokenomics
            <ExternalLink className="w-3 h-3 md:w-4 md:h-4 group-hover/link:translate-x-0.5 transition-transform duration-300" />
          </a>
        </div>

        <p className="text-center text-gray-300 text-sm md:text-base break-words px-2 md:px-0">
          <span className="text-cyan-400 font-semibold">Contract Owner:</span>{" "}
          {owner}
        </p>

        <p className="text-center text-gray-300 text-sm md:text-base px-2 md:px-0">
          Token parameters, including transaction fees, burn rates, and reserve
          allocations, are transparently documented in our governance materials.
          These parameters are carefully structured to ensure long-term
          stability, community growth, and enhanced token utility.
        </p>
      </div>
    </section>
  );
}
