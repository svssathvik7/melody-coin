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
    <section className="text-white w-5/6 mx-auto my-[10dvh] flex flex-col items-center justify-center h-fit p-6 gap-6 border border-[#ffffff35] rounded-2xl">
      <h2 className="text-5xl font-bold text-center">Admin Actions</h2>

      <p className="w-4/5 text-center text-[#a3a3a3]">
        Admin actions in MelodyCoin require owner-level access rights. The
        <span className="text-white font-semibold"> onlyAdmin </span>
        functions include <span className="text-white font-semibold">mint</span>
        , which allows the owner to mint a specified amount of MLD tokens to a
        designated address, and{" "}
        <span className="text-white font-semibold">togglePause</span>, which
        lets the owner pause or unpause the contract in critical situations.
      </p>

      <div className="flex items-center gap-2">
        <a
          href="https://docs.melodycoin.com/governance"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Detailed Token Metrics and Governance
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <p className="w-4/5 text-center text-[#a3a3a3]">
        <span className="text-white font-semibold">Contract Owner:</span>{" "}
        {owner}
      </p>

      <p className="w-4/5 text-center text-[#a3a3a3]">
        Token parameters, including transaction fees, burn rates, and reserve
        allocations, are transparently documented in our governance materials.
        These parameters are carefully structured to ensure long-term stability,
        community growth, and enhanced token utility.
      </p>
    </section>
  );
}
