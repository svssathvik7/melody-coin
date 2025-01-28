import { AvatarComponent } from "@rainbow-me/rainbowkit";
const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return (
    <img
      src={ensImage || "./assets/melody-coin-logo.png"}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  );
};

export default CustomAvatar;
