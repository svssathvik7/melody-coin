import React from "react";
import { ExternalLink } from "lucide-react";

export default function TokenDetails() {
  return (
    <section className="glass-effect w-[95%] md:w-5/6 mx-auto my-[10dvh] md:my-[20dvh] flex items-center justify-center flex-col h-fit p-8 md:p-10 gap-6 md:gap-10 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a72] to-[#009ffd] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl w-full md:w-3/4 text-center font-bold px-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300">
        MelodyCoin{" "}
        <span className="text-2xl md:text-3xl lg:text-4xl text-cyan-400">
          (MLD)
        </span>
      </h1>

      <p className="w-full md:w-4/5 text-center text-gray-300 text-base md:text-lg px-2 md:px-0 leading-relaxed">
        MelodyCoin implements an advanced token governance structure that
        ensures transparency and sustainable tokenomics. The token operates
        under a dynamic fee structure managed through our TokenGovernance
        system, which oversees transaction fees, burn rates, and reserve
        allocations.
      </p>

      <div className="flex items-center gap-2">
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

      <div className="w-full md:w-4/5 flex flex-col gap-4 p-6 glass-effect bg-opacity-50 rounded-xl">
        <p className="text-center text-gray-300 text-sm md:text-base break-words px-2 md:px-0">
          <span className="text-cyan-400 font-semibold">Contract Owner:</span>{" "}
          0xDda173bd23b07007394611D789EF789a9Aae5CF5
        </p>

        <p className="text-center text-gray-300 text-sm md:text-base px-2 md:px-0">
          Token parameters including transaction fees, burn rates, and reserve
          allocations are transparently documented in our governance
          documentation. These parameters are carefully designed to maintain
          long-term stability while promoting community growth and token
          utility.
        </p>
      </div>

      <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
    </section>
  );
}
