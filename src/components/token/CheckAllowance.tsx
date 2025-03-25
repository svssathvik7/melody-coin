"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllowance } from "@/utils/contractFetcher";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import AllowanceAnimation from "@/assets/lotties/AllowanceLottie.json";
import dynamic from "next/dynamic";
import { useAccount } from "wagmi";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function CheckAllowance() {
  const [spender, setSpender] = useState("");
  const [owner, setOwner] = useState("");
  const { isConnected } = useAccount();
  const [allowance, setAllowance] = useState<string | undefined>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAllowance("0");
  }, [spender, owner]);

  const handleCheck = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllowance(owner, spender);
      setAllowance(data?.toString());
    } catch (error) {
      console.error("Error fetching allowance:", error);
      setAllowance("0");
      setError("Error fetching allowance. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    isConnected && (
      <Card className="w-full max-w-md h-fit mx-auto my-8 backdrop-blur-md bg-white/90 shadow-xl border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300">
        <CardHeader className="text-center pb-2 bg-gradient-to-b from-white to-gray-50/50">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
            <Lottie
              loop={true}
              animationData={AllowanceAnimation}
              className="w-24 relative z-10"
            />
          </div>
          <CardTitle className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            Check Allowance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label
              htmlFor="owner-address"
              className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
            >
              Owner Address
            </Label>
            <Input
              id="owner-address"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              type="text"
              placeholder="0x..."
              className="border-gray-300/50 bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:border-cyan-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="spender-address"
              className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
            >
              Spender Address
            </Label>
            <Input
              id="spender-address"
              value={spender}
              onChange={(e) => setSpender(e.target.value)}
              type="text"
              placeholder="0x..."
              className="border-gray-300/50 bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:border-cyan-500/50"
            />
          </div>
          <div className="pt-4">
            <Button
              onClick={handleCheck}
              disabled={isLoading || !owner || !spender}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-cyan-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Checking...
                </>
              ) : allowance !== "0" && !error ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Allowance Checked
                </>
              ) : (
                "Check Allowance"
              )}
            </Button>
          </div>
          {error && (
            <div className="text-red-500 text-sm flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          <div className="text-center">
            <p className="text-sm text-gray-600">Allowance</p>
            <p className="text-3xl font-bold">{allowance} MLD</p>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    )
  );
}
