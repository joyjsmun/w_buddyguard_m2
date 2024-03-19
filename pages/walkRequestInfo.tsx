import React, { useState } from "react";

import { live, next, timer } from "../public/assets/images";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import Map from "../pages/map";

const WalkRequestInfo = () => {
  const [address, setAddress] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter();
  const isMapPage = router.pathname === "/map";

  return (
    <Layout>
      <div className="bg-[#0A0A0A] min-h-screen flex flex-col items-center ">
        <div className="flex flex-col w-full space-y-2 p-4 mt-12">
          {/* Top Section */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-[#d1d1d1] font-lato text-sm mb-1">
              Walking Every Stop With You
            </h2>
            <div
              className={`w-full ${isMapPage ? "h-screen" : "h-[32vh]"}`}
              onClick={() => router.push("/map")}
            >
              <Map preview={!isMapPage} showOthers={false} />
            </div>
          </div>
          {/* Card Section */}
          <div className="border-[#ECEC04] border-2 px-4 py-3  flex flex-col  space-y-3 ">
            {/* Choose Buddy */}
            <div className="flex flex-row items-center">
              <div className="flex flex-col space-y-1 w-full">
                <label
                  htmlFor="address"
                  className="text-[#d1d1d1] font-lato text-sm mb-1"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  placeholder="Type Your Address"
                  className="w-full pl-2 pt-1  border-[#ECEC04] border-2 tex-lg   flex justify-center "
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Choose Options */}
            <div className="flex flex-row items-center  ">
              <div className="flex flex-col space-y-2  w-full mb-3">
                <h2 className="text-[#d1d1d1] font-lato text-sm mb-2">
                  Choose Your Buddy
                </h2>
                <div className="flex flex-col justify-between ">
                  <button
                    className={` flex items-center justify-start px-4 py-1 border-2 border-[#ECEC04]  mb-3 ${
                      selectedOption === "timer"
                        ? "bg-[#ECEC04] text-[#0A0A0A] font-latoBlack"
                        : "border-[#ECEC04] text-[#d1d1d1]"
                    }`}
                    onClick={() => setSelectedOption("timer")}
                  >
                    <Image src={timer} className="w-10 h-10" alt="Timer" />
                    <span className="text-md font-lato ml-4">
                      Set Safety Timer
                    </span>
                  </button>
                  <button
                    className={`flex items-center justify-start px-4 py-1 border-2 border-[#ECEC04]  ${
                      selectedOption === "live"
                        ? "bg-[#ECEC04] text-[#0A0A0A] font-latoBlack"
                        : " border-[#ECEC04] text-[#d1d1d1]"
                    }`}
                    onClick={() => setSelectedOption("live")}
                  >
                    <Image src={live} className="w-10 h-10" alt="Live" />
                    <span className="text-md font-lato ml-4 ">
                      Request Live Monitoring
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => router.push("walkConfirm")}
              className="bg-[#ECEC04] px-4 py-2  w-full flex items-center justify-center text-[#121418] font-lato text-md animate-pulse"
            >
              NEXT
              <Image src={next} className="w-8 h-8 ml-4" alt="Live" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WalkRequestInfo;
