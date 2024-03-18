import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import TapNFC from "@/components/TapNFC";
import { digitalnomad, safety, trust } from "../public/assets/images";

import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

const OnBoarding = () => {
  const router = useRouter();
  const address = useAddress();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleWalletConnectModal = () => {
    setIsWalletModalOpen(!isWalletModalOpen);
  };

  const slides = [
    {
      id: "1",
      image: safety,
      title: "Safety First",
      subtitle: "We keep you safe wherever you go",
    },
    {
      id: "2",
      image: trust,
      title: "Trustable Network",
      subtitle: "We organize events for you based on your trust group",
    },
    {
      id: "3",
      image: digitalnomad,
      title: "Digital Nomads",
      subtitle:
        "Significant increase of Digital nomads worldwide since the COVID-19 era",
    },
  ];

  const updateCurrentSlideIndex = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < slides.length) {
      setCurrentSlideIndex(nextSlideIndex);
    } else {
      // Only push to home if wallet is connected
      if (address) {
        router.push("/home");
      } else {
        router.push("/loginThirdweb");
      }
    }
  };

  const skip = () => {
    // Only push to home if wallet is connected
    if (address) {
      router.push("/home");
    } else {
      router.push("/loginThirdweb");
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex flex-col justify-center items-center px-5">
      <div className="flex flex-col bg-[#ECEC04] items-center space-y-2 pt-16 pb-12 relative mb-4 ">
        <div className="">
          <Image
            src={slides[currentSlideIndex].image}
            className="w-28 h-28"
            alt={slides[currentSlideIndex].title}
          />
        </div>
        <h1 className="text-3xl font-latoBold text-[#0A0A0A] text-center pt-4 px-2">
          {slides[currentSlideIndex].title}
        </h1>
        <p className="text-xl font-latoLight text-[#0A0A0A] pt-2 px-10 text-center">
          {slides[currentSlideIndex].subtitle}
        </p>
        <div className="absolute   w-6 h-6 top-0 left-3  rounded-full origin-bottom-right translate-y-3 bg-[#0A0A0A]"></div>{" "}
      </div>
      {currentSlideIndex === slides.length - 1 ? <TapNFC /> : ""}

      <div className="flex items-center space-x-4 mt-4">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full bg-white ${
              currentSlideIndex === index ? "w-6" : ""
            }`}
            onClick={() => updateCurrentSlideIndex(index)}
          />
        ))}
      </div>
      <div></div>
      <div className="flex items-center mt-8">
        <button
          className="bg-[#ECEC04]  font-lato text-md text-[#0A0A0A] py-2 px-12 mr-4"
          onClick={skip}
        >
          Skip
        </button>
        <div>
          <button
            className="bg-[#ECEC04]  font-lato text-md text-[#0A0A0A] py-2 px-4  "
            onClick={goToNextSlide}
          >
            {currentSlideIndex === slides.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
