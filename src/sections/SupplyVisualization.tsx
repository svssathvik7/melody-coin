"use client";
import React, { useEffect, useState } from "react";
import contract from "@/config/viemConfig";
import { formatUnits } from "viem";

const formatLargeNumber = (num_str: string): string => {
  const num = Number(num_str);
  if (num > 10_000_000) {
    const exp = Math.floor(Math.log10(num));
    return "10" + "^" + exp;
  }
  return num.toLocaleString();
};

export default function SupplyVisualization() {
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const [maxCap, setMaxCap] = useState<string>("0");
  const [percentage, setPercentage] = useState<number>(0);
  const [burnPercentage, setBurnPercentage] = useState<number>(0);
  const [faucetPercentage] = useState<number>(20);
  const [minterPercentage] = useState<number>(80);

  useEffect(() => {
    const fetchSupplyData = async () => {
      try {
        const [
          totalSupplyBigInt,
          maxCapBigInt,
          burnPercentageBigInt,
          percentageFactorBigInt,
        ] = await Promise.all([
          contract.read.totalSupply(),
          contract.read.maxCap_(),
          contract.read.BURN_PERCENTAGE(),
          contract.read.PERCENTAGE_FACTOR(),
        ]);

        const formattedTotalSupply = formatUnits(
          totalSupplyBigInt as bigint,
          18
        );
        const formattedMaxCap = formatUnits(maxCapBigInt as bigint, 18);
        const calculatedBurnPercentage =
          (Number(burnPercentageBigInt) / Number(percentageFactorBigInt)) * 100;

        setTotalSupply(formattedTotalSupply);
        setMaxCap(formattedMaxCap);
        setBurnPercentage(calculatedBurnPercentage);
        setPercentage(
          (Number(formattedTotalSupply) / Number(formattedMaxCap)) * 100
        );
      } catch (error) {
        console.error("Error fetching supply data:", error);
      }
    };

    fetchSupplyData();
  }, []);

  return (
    <section className="glass-effect w-[95%] md:w-5/6 mx-auto my-[10dvh] md:my-[20dvh] flex flex-col md:flex-row items-center justify-center h-fit p-8 md:p-10 gap-6 md:gap-10 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a72] to-[#009ffd] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>

      <div className="w-full md:w-1/2 relative z-10">
        <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300 mb-6">
          Melody Coin Tokenomics
        </h3>
        {/* Supply Progress */}
        <div className="w-full glass-effect bg-opacity-50 p-6 rounded-xl">
          <div className="relative">
            <div className="flex mb-4 items-center justify-between">
              <span className="text-sm font-semibold py-2 px-4 uppercase rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300">
                Supply Progress
              </span>
              <span className="text-sm font-semibold text-cyan-300">
                {percentage.toFixed(2)}%
              </span>
            </div>
            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
              <div
                style={{ width: `${percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Components */}
      <div className="w-full md:w-1/2 flex flex-col gap-6 relative z-10">
        {/* Supply Info */}
        <div className="flex flex-col sm:flex-row justify-between w-full gap-6 text-center">
          <div className="flex-1 p-6 rounded-xl glass-effect bg-opacity-50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-500 group/card">
            <p className="text-sm text-gray-300 mb-2">Current Supply</p>
            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300 group-hover/card:scale-105 transition-transform duration-300">
              {formatLargeNumber(totalSupply)} MLD
            </p>
          </div>
          <div className="flex-1 p-6 rounded-xl glass-effect bg-opacity-50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-500 group/card">
            <p className="text-sm text-gray-300 mb-2">Maximum Cap</p>
            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300 group-hover/card:scale-105 transition-transform duration-300">
              {formatLargeNumber(maxCap)} MLD
            </p>
          </div>
        </div>

        {/* Burn Rate */}
        <div className="p-6 rounded-xl glass-effect bg-opacity-50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-500 group/card text-center">
          <p className="text-sm text-gray-300 mb-2">Burn Rate</p>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300 group-hover/card:scale-105 transition-transform duration-300">
            {burnPercentage.toFixed(2)}%
          </p>
          <div className="mt-4 h-2 w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${burnPercentage}%` }}
            />
          </div>
        </div>

        {/* Minting Distribution */}
        <div className="p-6 rounded-xl glass-effect bg-opacity-50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-500 group/card text-center">
          <p className="text-sm text-gray-300 mb-4">Minting Distribution</p>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-300">Minting Address</p>
                <p className="text-sm font-semibold text-cyan-300 group-hover/card:text-cyan-200 transition-colors duration-300">
                  {minterPercentage}%
                </p>
              </div>
              <div className="h-2 w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${minterPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-300">Faucet</p>
                <p className="text-sm font-semibold text-cyan-300 group-hover/card:text-cyan-200 transition-colors duration-300">
                  {faucetPercentage}%
                </p>
              </div>
              <div className="h-2 w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${faucetPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
