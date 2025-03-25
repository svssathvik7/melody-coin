"use client";
import React, { useEffect, useState } from "react";
import contract from "@/config/viemConfig";
import { formatUnits } from "viem";

const formatLargeNumber = (num_str: string): string => {
  let num = Number(num_str);
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
    <div className="text-gray-800 w-[95%] md:w-5/6 mx-auto my-[10dvh] md:my-[20dvh] flex flex-col md:flex-row items-center justify-center h-fit p-4 md:p-6 gap-8 border border-gray-200 rounded-2xl bg-white shadow-sm">
      <div className="w-full md:w-1/2">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Melody Coin Tokenomics
        </h3>
        {/* Supply Progress */}
        <div className="w-full">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-xs font-semibold py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Supply Progress
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {percentage.toFixed(2)}%
              </span>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Components */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        {/* Supply Info */}
        <div className="flex flex-col sm:flex-row justify-between w-full gap-4 text-center">
          <div className="flex-1 p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-1">Current Supply</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatLargeNumber(totalSupply)} MLD
            </p>
          </div>
          <div className="flex-1 p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-1">Maximum Cap</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatLargeNumber(maxCap)} MLD
            </p>
          </div>
        </div>

        {/* Burn Rate */}
        <div className="p-4 rounded-lg bg-gray-50 text-center">
          <p className="text-sm text-gray-600 mb-1">Burn Rate</p>
          <p className="text-lg font-semibold text-gray-800">
            {burnPercentage.toFixed(2)}%
          </p>
          <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-500"
              style={{ width: `${burnPercentage}%` }}
            />
          </div>
        </div>

        {/* Minting Distribution */}
        <div className="p-4 rounded-lg bg-gray-50 text-center">
          <p className="text-sm text-gray-600 mb-1">Minting Distribution</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm text-gray-600">Minting Address</p>
                <p className="text-sm font-semibold text-gray-800">
                  {minterPercentage}%
                </p>
              </div>
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${minterPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm text-gray-600">Faucet</p>
                <p className="text-sm font-semibold text-gray-800">
                  {faucetPercentage}%
                </p>
              </div>
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${faucetPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
