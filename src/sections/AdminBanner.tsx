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
    <section className="text-gray-800 w-[95%] md:w-5/6 mx-auto my-[5dvh] md:my-[10dvh] flex flex-col items-center justify-center h-fit p-4 md:p-6 gap-4 md:gap-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900">
        Admin Actions
      </h2>

      <p className="w-full md:w-4/5 text-center text-gray-600 text-sm md:text-base px-2 md:px-0">
        Admin actions in MelodyCoin require owner-level access rights. The
        <span className="text-gray-900 font-semibold"> onlyAdmin </span>
        functions include{" "}
        <span className="text-gray-900 font-semibold">mint</span>, which allows
        the owner to mint a specified amount of MLD tokens to a designated
        address, and{" "}
        <span className="text-gray-900 font-semibold">togglePause</span>, which
        lets the owner pause or unpause the contract in critical situations.
      </p>

      <div className="flex items-center gap-2">
        <a
          href="https://github.com/svssathvik7/melody-coin-smart-contract/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm md:text-base"
        >
          View Detailed Tokenomics
          <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
        </a>
      </div>

      <p className="w-full md:w-4/5 text-center text-gray-600 text-sm md:text-base break-words px-2 md:px-0">
        <span className="text-gray-900 font-semibold">Contract Owner:</span>{" "}
        {owner}
      </p>

      <p className="w-full md:w-4/5 text-center text-gray-600 text-sm md:text-base px-2 md:px-0">
        Token parameters, including transaction fees, burn rates, and reserve
        allocations, are transparently documented in our governance materials.
        These parameters are carefully structured to ensure long-term stability,
        community growth, and enhanced token utility.
      </p>
    </section>
  );
}
