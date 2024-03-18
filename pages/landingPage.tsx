import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { LogoImage } from "../public/assets/images";
// import BottomTab from "@/components/BottomTab";

const LandingPage = () => {
  const router = useRouter();

  // Check if the current route is the landing page
  const isLandingPage = router.pathname === "/";

  const handleButtonClick = () => {
    router.push("/onBoarding");
  };

  return (
    <div className="bg-[#0A0A0A] flex  justify-center h-screen relative p-3">
      <Head>
        <title>Landing Page</title>
        <meta name="landing" />
      </Head>
      {/* loading page start */}
      <div className="flex flex-col items-center mt-[13rem] space-y-2 ">
        <Image className="w-16 h-18 mb-2" src={LogoImage} alt="Logo" />
        <h1 className="font-kodeSemi text-center text-4xl  text-[#ECEC04]">
          Buddy Guard
        </h1>
        <p className="text-center text-gray-100 font-latoLight text-lg">
          Safety Social dApp
        </p>
      </div>
      <button
        onClick={handleButtonClick}
        className=" fixed bottom-20 w-28 h-14 border-2 border-[#ECEC04]  items-center justify-center"
      >
        <div className="w-24 h-10 flex flex-col ml-[0.4rem] items-center justify-center  bg-[#ECEC04] animate-pulse">
          <p className="text-[#0A0A0A] font-lato text-lg">GO</p>
        </div>
      </button>
    </div>
  );
};

export default LandingPage;
