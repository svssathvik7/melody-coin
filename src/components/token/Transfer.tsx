"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SelfTransfer from "./SelfTransfer";
import TransferFrom from "./TransferFrom";
import { Card } from "../ui/card";

export default function Transfer() {
  return (
    <div className="rounded-lg p-2 w-1/3">
      <Card className="h-[40dvh] w-full max-w-md bg-white text-black border border-gray-300 shadow-lg p-2 overflow-y-scroll">
        <Tabs defaultValue="transfer" className="w-full rounded-lg">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg">
            <TabsTrigger
              value="transfer"
              className="text-gray-700 data-[state=active]:bg-black data-[state=active]:text-white transition-all rounded-lg"
            >
              Transfer
            </TabsTrigger>
            <TabsTrigger
              value="transferFrom"
              className="text-gray-700 data-[state=active]:bg-black data-[state=active]:text-white transition-all rounded-lg"
            >
              Transfer From
            </TabsTrigger>
          </TabsList>
          <TabsContent value="transfer" className="p-4">
            <SelfTransfer />
          </TabsContent>
          <TabsContent value="transferFrom" className="p-4">
            <TransferFrom />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
