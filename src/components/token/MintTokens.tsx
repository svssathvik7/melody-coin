import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BaseError, parseEther } from "viem";
import toaster from "@/utils/toaster";
import { mintTokensRevertMapping } from "@/utils/revertMapper";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { client } from "@/config/viemConfig";
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";

export default function MintTokens() {
  const [mintAmount, setMintAmount] = useState(0);
  const [receiverAddress, setReceiverAddress] = useState("");
  const { address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction();
  const { data: hash, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const mintTokens = async () => {
    if (mintAmount == 0) {
      return toaster("error", "Mint value must be non zero");
    }
    try {
      const { request } = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "mint",
        account: address,
        args: [receiverAddress, parseEther(mintAmount.toString())],
      });
      writeContract(request);
    } catch (error) {
      console.log(error);
      if (error instanceof BaseError) {
        const errorText = mintTokensRevertMapping(error);
        toaster("error", errorText);
      } else {
        toaster("error", "Failed get assets from faucet");
      }
    }
  };
  if (hash) {
    addRecentTransaction({
      hash,
      description: `Mint ${mintAmount}MLD tokens`,
    });
  }
  return (
    <Card className="h-[40dvh] text-black bg-white w-[30dvw] flex flex-col items-center justify-center my-8 overflow-y-scroll">
      <CardHeader>Mint Tokens</CardHeader>
      <CardContent>
        <div>
          <Input
            value={receiverAddress}
            onChange={(e) => {
              setReceiverAddress(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              setReceiverAddress(CONTRACT_ADDRESS);
            }}
          >
            To Contract
          </Button>
        </div>
        <Input
          value={mintAmount}
          type="text"
          onChange={(e) => {
            setMintAmount(Number(e.target.value));
          }}
          type="number"
          min={0.000000000000000001}
          step={0.000000000000000001}
        />
        <Button onClick={mintTokens}>Mint</Button>
      </CardContent>
    </Card>
  );
}
