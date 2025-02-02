import React from "react";
import { ExternalLink } from "lucide-react";

export default function TokenDetails() {
  return (
    <section className="text-white w-5/6 mx-auto my-[20dvh] flex items-center justify-center flex-col h-fit p-2 gap-8 border-[0.025px] border-[#ffffff35] m-8">
      <p className="text-5xl w-3/4 text-center rounded-2xl font-bold">
        MelodyCoin (MLD)
      </p>
      <p className="w-4/5 text-center text-[#a3a3a3]">
        MelodyCoin implements an advanced token governance structure that
        ensures transparency and sustainable tokenomics. The token operates
        under a dynamic fee structure managed through our TokenGovernance
        system, which oversees transaction fees, burn rates, and reserve
        allocations.
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
        Contract Owner: 0xDda173bd23b07007394611D789EF789a9Aae5CF5
      </p>
      <p className="w-4/5 text-center text-[#a3a3a3]">
        Token parameters including transaction fees, burn rates, and reserve
        allocations are transparently documented in our governance
        documentation. These parameters are carefully designed to maintain
        long-term stability while promoting community growth and token utility.
      </p>
    </section>
  );
}
