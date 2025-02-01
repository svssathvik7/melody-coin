import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { getPauseState } from "@/utils/contractFetcher";
import { Button } from "../ui/button";
import toaster from "@/utils/toaster";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { client } from "@/config/viemConfig";
import { CONTRACT_ADDRESS, MELODY_COIN_ABI } from "@/constants/contractDetails";

export default function TogglePause() {
  const { address } = useAccount();
  const [isPaused, setIsPaused] = useState(true);
  const addRecentTransaction = useAddRecentTransaction();
  const { data: hash, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });
  useEffect(() => {
    const fetchPauseState = async () => {
      const state = await getPauseState();
      setIsPaused(state);
    };
    fetchPauseState();
  });
  const togglePauseState = async () => {
    try {
      const { request } = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: MELODY_COIN_ABI,
        functionName: "togglePause",
        account: address,
        args: [],
      });
      writeContract(request);
    } catch (error) {
      console.log(error);
      toaster("error", "Failed to toggle contract pause state!");
    }
  };
  return (
    <Card className="h-[40dvh] text-black bg-white w-[30dvw] flex flex-col items-center justify-center my-8 overflow-y-scroll">
      <CardHeader>Toggle Contract Pause state</CardHeader>
      <CardContent>
        <div>
          <p>Current contract state : </p>
          <p
            className={`px-2 rounded-2xl text-xs ${
              isPaused ? " bg-red-500 " : " bg-green-500 "
            } text-white w-fit`}
          >
            {isPaused ? "paused" : "resumed"}
          </p>
        </div>
        <Button onClick={togglePauseState}>
          {isPaused ? "Unpause" : "Pause"}
        </Button>
      </CardContent>
    </Card>
  );
}
