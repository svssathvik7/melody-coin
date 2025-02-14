import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/walletProvider";
import { Toaster } from "react-hot-toast";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Melody Coin Frontend",
  description: "Melody Coin is a ERC-20 token",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-black`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MK6LR5G3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <GoogleAnalytics />
        <Providers>{children}</Providers>
        <Toaster
          toastOptions={{
            style: {
              wordBreak: "break-all",
              maxWidth: "350px",
              wordWrap: "normal",
            },
          }}
        />
      </body>
    </html>
  );
}
