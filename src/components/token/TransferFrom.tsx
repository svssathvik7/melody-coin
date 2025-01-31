"use client";

import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function TransferFrom() {
  const [spenderAddress, setSpenderAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [transferFromAmount, setTransferFromAmount] = useState("");

  const handleTransferFrom = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Transfer From:", {
      spenderAddress,
      receiverAddress,
      amount: transferFromAmount,
    });
    // Add your transferFrom logic here
  };

  return (
    <div className="rounded-lg p-2 w-full">
      <Card className="w-full max-w-md bg-white text-black border border-gray-300 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center text-gray-900">
            Transfer From
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleTransferFrom}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="spenderAddress"
                className="text-sm font-medium text-gray-800"
              >
                Spender Address
              </Label>
              <Input
                id="spenderAddress"
                value={spenderAddress}
                onChange={(e) => setSpenderAddress(e.target.value)}
                required
                placeholder="Enter spender's address"
                className="border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="receiverAddress"
                className="text-sm font-medium text-gray-800"
              >
                Receiver Address
              </Label>
              <Input
                id="receiverAddress"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                required
                placeholder="Enter receiver's address"
                className="border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="transferFromAmount"
                className="text-sm font-medium text-gray-800"
              >
                Amount
              </Label>
              <Input
                id="transferFromAmount"
                type="number"
                value={transferFromAmount}
                onChange={(e) => setTransferFromAmount(e.target.value)}
                required
                placeholder="Enter amount to transfer"
                className="border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-black"
                min="0"
                step="0.01"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:scale-105 bg-black text-white hover:bg-gray-900 rounded-lg"
            >
              Transfer From
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
