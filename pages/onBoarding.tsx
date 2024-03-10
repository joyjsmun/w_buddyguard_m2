import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import TapNFC from "@/components/TapNFC";
import {
  LogoImage,
  digitalnomad,
  safety,
  trust,
} from "../public/assets/images";

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
      title: "Based on Trustable Group Network",
      subtitle: "We organize events for you based on your trust group",
    },
    {
      id: "3",
      image: digitalnomad,
      title: "Big Increase in Digital Nomads",
      subtitle:
        "There has been a significant increase in the number of digital nomads worldwide since the COVID-19 era",
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
    <div className="bg-[#F6D268] min-h-screen flex flex-col justify-center items-center pb-4">
      <div className="flex flex-col items-center space-y-2 ">
        <Image
          src={slides[currentSlideIndex].image}
          className="w-72 h-72"
          alt={slides[currentSlideIndex].title}
        />
        <h1 className="text-3xl font-robotoBlack text-gray-800 text-center pt-4 px-14">
          {slides[currentSlideIndex].title}
        </h1>
        <p className="text-xl font-latoLight text-gray-800 pt-2 px-7 text-center">
          {slides[currentSlideIndex].subtitle}
        </p>
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
          className="bg-blue-500 font-robotoMedium text-white py-2 px-6 rounded-lg mr-4"
          onClick={skip}
        >
          Skip
        </button>
        <div>
          <button
            className="bg-blue-500 font-robotoMedium text-white py-2 px-6 rounded-lg"
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
