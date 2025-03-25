"use client";
import React, { useEffect, useState } from "react";
import contract from "@/config/viemConfig";
import { formatUnits } from "viem";

const formatLargeNumber = (num_str: string): string => {
  let num = Number(num_str);

  if (num >= 10_000_000) {
    // Convert to scientific notation if the number is too large
    const exponent = Math.floor(Math.log10(num));
    return `10^${exponent}`;
  } else if (num >= 1_000_000) {
    return (
      (num / 1_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }) + "M"
    );
  }
  return num.toLocaleString();
};

export default function SupplyVisualization() {
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const [maxCap, setMaxCap] = useState<string>("0");
  const [percentage, setPercentage] = useState<number>(0);

  useEffect(() => {
    const fetchSupplyData = async () => {
      try {
        const [totalSupplyBigInt, maxCapBigInt] = await Promise.all([
          contract.read.totalSupply(),
          contract.read.maxCap_(),
        ]);

        const formattedTotalSupply = formatUnits(
          totalSupplyBigInt as bigint,
          18
        );
        const formattedMaxCap = formatUnits(maxCapBigInt as bigint, 18);

        setTotalSupply(formattedTotalSupply);
        setMaxCap(formattedMaxCap);
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
    <div className="text-gray-800 w-[95%] md:w-5/6 mx-auto my-[10dvh] md:my-[20dvh] flex items-center justify-center flex-col h-fit p-4 md:p-6 gap-4 md:gap-8 border border-gray-200 rounded-2xl bg-white shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800">
        Token Supply Status
      </h3>

      <div className="w-full max-w-md">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Supply Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {percentage.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${percentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full max-w-md gap-4 text-center">
        <div className="flex-1 p-4 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600 mb-1">Current Supply</p>
          <p className="text-lg font-semibold text-gray-800">
            {formatLargeNumber(totalSupply).toLocaleString()} MLD
          </p>
        </div>
        <div className="flex-1 p-4 rounded-lg bg-gray-50 w-fit">
          <p className="text-sm text-gray-600 mb-1">Maximum Cap</p>
          <p className="text-lg font-semibold text-gray-800">
            {formatLargeNumber(maxCap).toLocaleString()} MLD
          </p>
        </div>
      </div>
    </div>
  );
}
