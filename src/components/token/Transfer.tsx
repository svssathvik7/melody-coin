"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SelfTransfer from "./SelfTransfer";
import TransferFrom from "./TransferFrom";
import { Card, CardHeader, CardTitle } from "../ui/card";

export default function Transfer() {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg bg-white p-2">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-900">
          Transfer Tokens
        </CardTitle>
      </CardHeader>
      <Tabs defaultValue="transfer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-t-lg">
          <TabsTrigger
            value="transfer"
            className="text-sm font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-black transition-all rounded-md"
          >
            Transfer
          </TabsTrigger>
          <TabsTrigger
            value="transferFrom"
            className="text-sm font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-black transition-all rounded-md"
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
  );
}
