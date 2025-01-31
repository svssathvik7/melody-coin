"use client";

import { useState } from "react";
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
import { Loader2 } from "lucide-react";

export default function CheckAllowance() {
  const [spender, setSpender] = useState("");
  const [owner, setOwner] = useState("");
  const [allowance, setAllowance] = useState<string | undefined>("0");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    setIsLoading(true);
    try {
      const data = await getAllowance(owner, spender);
      setAllowance(data?.toString());
    } catch (error) {
      console.error("Error fetching allowance:", error);
      setAllowance("Error");
    }
    setIsLoading(false);
  };

  return (
    <Card className="h-[30dvh] w-full max-w-md bg-white text-black border border-gray-200 shadow-md overflow-y-scroll">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Check Allowance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="owner-address">Owner Address</Label>
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
          <Label htmlFor="spender-address">Spender Address</Label>
          <Input
            id="spender-address"
            value={spender}
            onChange={(e) => setSpender(e.target.value)}
            type="text"
            placeholder="0x..."
            className="transition-all duration-300 focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="pt-2">
          <p className="text-sm font-medium text-muted-foreground">
            Allowance granted:
          </p>
          <p className="text-2xl font-bold text-primary">{allowance}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCheck}
          disabled={isLoading || !owner || !spender}
          className="w-full transition-all duration-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Allowance"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
