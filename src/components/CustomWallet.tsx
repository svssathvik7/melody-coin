import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import { Button } from "@/components/ui/button";
import { CONTRACT_ADDRESS } from "@/constants/contractDetails";

const CustomWallet = () => {
  const { address } = useAccount();

  const { data: tokenBalance } = useBalance({
    address,
    token: CONTRACT_ADDRESS,
    watch: true,
  });

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div className="flex items-center gap-2">
            {!connected ? (
              <Button onClick={openConnectModal}>Connect Wallet</Button>
            ) : chain.unsupported ? (
              <Button onClick={openChainModal} variant="destructive">
                Wrong network
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={openChainModal}
                  variant="outline"
                  className="flex items-center"
                >
                  {chain.name}
                </Button>
                <Button
                  onClick={openAccountModal}
                  className="flex items-center gap-2"
                >
                  <span>{account.displayName}</span>
                  <div className="flex flex-col text-xs text-right">
                    <span>{account.displayBalance}</span>
                    {tokenBalance && (
                      <span className="text-green-200">
                        {Number(tokenBalance.formatted).toFixed(2)} MLD
                      </span>
                    )}
                  </div>
                </Button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
