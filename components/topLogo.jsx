import React from "react";
import Image from "next/image";
import LogoImage from "../public/assets/images/logo.png";

const TopLogo = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0b0b0b] px-4 py-2 flex items-center justify-center">
      <div className="flex flex-row items-center justify-center ">
        <Image src={LogoImage} alt="Logo" className="w-6 h-7 mr-1" />
        <span className="text-[#d1d1d1] text-md font-kodeSemi ml-1 mt-2">
          Buddy Guard
        </span>
      </div>
    </div>
  );
};

export default TopLogo;
