import { AvatarComponent } from "@rainbow-me/rainbowkit";
import Image from "next/image";
const CustomAvatar: AvatarComponent = ({ ensImage, size }) => {
  return (
    <Image
      alt="Melody Coin Logo"
      src={ensImage || "./assets/melody-coin-logo.png"}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  );
};

export default CustomAvatar;
