import Navbar from "@/components/Navbar";
import ApprovePayer from "@/components/token/ApprovePayer";
import CheckAllowance from "@/components/token/CheckAllowance";
import CheckBalance from "@/components/token/CheckBalance";
import GetFaucetAssets from "@/components/token/GetFaucetAssets";
import MintTokens from "@/components/token/MintTokens";
import TogglePause from "@/components/token/TogglePause";
import Transfer from "@/components/token/Transfer";
import AdminBanner from "@/sections/AdminBanner";
import HeroSection from "@/sections/HeroSection";
import SupplyVisualization from "@/sections/SupplyVisualization";
import TokenDetails from "@/sections/TokenDetailsSection";

export default function Home() {
  return (
    <div className="w-screen flex flex-col items-center justify-center flex-wrap gap-2">
      <Navbar />
      <HeroSection />
      <div className="flex w-screen items-center justify-around gap-2 flex-wrap">
        <CheckBalance />
        <GetFaucetAssets />
        <CheckAllowance />
      </div>
      <>
        <TokenDetails />
        <div className="flex w-screen items-center justify-around gap-2 flex-wrap">
          <ApprovePayer />
          <Transfer />
        </div>
      </>
      <>
        <AdminBanner />
        <div className="flex w-screen items-center justify-around gap-2 flex-wrap">
          <MintTokens />
          <TogglePause />
        </div>
      </>
      <SupplyVisualization />
    </div>
  );
}
