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
import Lottie from "lottie-react";
import AllowanceAnimation from "@/assets/lotties/AllowanceLottie.json";

export default function CheckAllowance() {
  const [spender, setSpender] = useState("");
  const [owner, setOwner] = useState("");
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
    <Card className="w-full max-w-md h-[55dvh] mx-auto my-8 text-black bg-white shadow-lg flex flex-col overflow-y-scroll">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <Lottie
            loop={true}
            animationData={AllowanceAnimation}
            className="w-24"
          />
        </div>
        <CardTitle className="text-3xl font-bold">Check Allowance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="space-y-2">
          <Label htmlFor="owner-address" className="text-sm font-medium">
            Owner Address
          </Label>
          <Input
            id="owner-address"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            type="text"
            placeholder="0x..."
            className="transition-all duration-300 focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="spender-address" className="text-sm font-medium">
            Spender Address
          </Label>
          <Input
            id="spender-address"
            value={spender}
            onChange={(e) => setSpender(e.target.value)}
            type="text"
            placeholder="0x..."
            className="transition-all duration-300 focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="pt-4 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Allowance granted:
          </p>
          <p className="text-3xl font-bold text-primary">{allowance}</p>
        </div>
        {error && (
          <div className="text-red-500 text-sm flex items-center justify-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCheck}
          disabled={isLoading || !owner || !spender}
          className="w-full transition-all duration-300 py-6 text-lg font-semibold"
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
      </CardFooter>
    </Card>
  );
}
