import { useRouter } from "next/router";
import Image from "next/image";
import React from "react";
import {
  home,
  home1,
  search,
  search1,
  walk,
  walk2,
  hand,
  hand1,
  profile,
  profile1,
} from "../public/assets/images";

const BottomTab = ({ location }) => {
  const router = useRouter();

  return (
    <div className="bottom-tab fixed  w-full">
      <div className=" bg-[#231f20] px-4 py-3 flex flex-around justify-around">
        <div onClick={() => router.push("/home")}>
          {location === "home" ? (
            <Image src={home1} className="w-7 h-7" alt="Home Active" />
          ) : (
            <Image src={home} className="w-7 h-7" alt="Home" />
          )}
        </div>
        <div onClick={() => router.push("/hangout")}>
          {location === "hangout" ? (
            <Image src={search1} className="w-7 h-7" alt="Hangout Active" />
          ) : (
            <Image src={search} className="w-7 h-7" alt="Hangout" />
          )}
        </div>
        <div onClick={() => router.push("/walkRequestInfo")}>
          {location === "walkRequestInfo" ? (
            <Image src={walk2} className="w-7 h-7" alt="Walk Active" />
          ) : (
            <Image src={walk} className="w-7 h-7" alt="Walk" />
          )}
        </div>
        {/* <div onClick={() => router.push("/supportRequestInfo")}>
          {location === "supportRequestInfo" ? (
            <Image src={hand1} className="w-7 h-7" alt="Support Active" />
          ) : (
            <Image src={hand} className="w-7 h-7" alt="Support" />
          )}
        </div> */}
        <div onClick={() => router.push("/profile")}>
          {location === "profile" ? (
            <Image src={profile1} className="w-7 h-7" alt="Profile Active" />
          ) : (
            <Image src={profile} className="w-7 h-7" alt="Profile" />
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomTab;
