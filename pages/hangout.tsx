import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  pin,
  plus,
  Hangout1,
  Hangout2,
  Hangout3,
  Hangout4,
  Hangout5,
} from "../public/assets/images";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "@/components/layout";

import { CovalentClient } from "@covalenthq/client-sdk";
import { MediaRenderer } from "@thirdweb-dev/react";

const Hangout = () => {
  const router = useRouter();
  const [nftContractAddress, setNftContractAddress] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftImageUrl, setNftImageUrl] = useState("");

  useEffect(() => {
    // const ApiServices = async () => {
    //   const client = new CovalentClient("cqt_rQwXmFK4c4YMm8xwr8XrBmwmdh7H");
    //   const resp = await client.NftService.checkOwnershipInNft(
    //     "eth-sepolia",
    //     "0x7C81461eE3EfEc10CC6BB3A3DbBA3CCA9B0EF127", // wallet address
    //     "0x5d417CeEa6C8982d64965df86EA11Bcc82f46db3", // nft contract address
    //     { traitsFilter: "group", valuesFilter: "core" }
    //   );
    //   console.log("covalent:", resp.data);
    // };
    const ApiServices = async () => {
      const client = new CovalentClient("cqt_rQwXmFK4c4YMm8xwr8XrBmwmdh7H");
      const resp =
        await client.BalanceService.getHistoricalTokenBalancesForWalletAddress(
          "eth-sepolia",
          "0x7C81461eE3EfEc10CC6BB3A3DbBA3CCA9B0EF127",
          { nft: true }
        );

      const nftData = resp.data.items[2].nft_data[0];
      if (nftData) {
        setNftContractAddress(resp.data.items[2].contract_address);
        setNftName(nftData.external_data.name);
        setNftImageUrl(nftData.external_data.image);
      }
    };

    ApiServices();
  }, []);

  return (
    <Layout>
      <div className="bg-white  min-h-screen flex flex-col pb-20 ">
        <div className="pt-9  flex justify-between items-center">
          <div className="pt-9 px-4 flex flex-col space-y-4">
            <div className="flex flex-row justify-between items-center">
              <p className="text-[#121418] font-bold font-latoBold">Gm, Joy</p>
              <button
                className="flex flex-row"
                onClick={() => router.push("Setting")}
              >
                <div className="flex flex-row items-center">
                  <Image src={pin} alt="Pin" className="w-6 h-6 mr-2" />
                  <p className="text-[#121418] font-latoBold text-base">
                    Current Location : Barcelona
                  </p>
                </div>
              </button>
            </div>
            {/* Popular Hangout*/}
            {/* <div className="flex flex-col space-y-2">
              <div className="flex flex-row justify-between">
                <p className="text-[#121418] font-robotoBold  text-lg">
                  Popular Hangout
                </p>
                <button
                  onClick={() => router.push("hangoutCreate")}
                  className="flex flex-row items-center"
                >
                  <Image src={plus} alt="Plus" className="w-6 h-6 mr-2" />
                  <p className="font-lato text-blue-500">Create Hangout</p>
                </button>
              </div> */}

            {/* Your NFT Infomation */}
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row justify-between">
                <p className="text-[#121418] font-robotoBold  text-lg">
                  Your NFT/POAP Info
                </p>
                {/* <button
                  onClick={() => router.push("hangoutCreate")}
                  className="flex flex-row items-center"
                >
                  <Image src={plus} alt="Plus" className="w-6 h-6 mr-2" />
                  <p className="font-lato text-blue-500">Create Hangout</p>
                </button> */}
                <p>NFT Contract Address : {nftContractAddress}</p>
                <p>NFT Name : {nftName}</p>
              </div>

              <button onClick={() => router.push("hangoutDetail")}>
                {/* <Image
                  src={nftImageUrl}
                  alt="Hangout"
                  className="w-full h-40  mb-2 rounded-lg"
                  width={500} // Set a fixed width
                  height={200} // Set a fixed height
                /> */}
                <MediaRenderer
                  src="ipfs://QmV4HC9fNrPJQeYpbW55NLLuSBMyzE11zS1L4HmL6Lbk7X"
                  alt="A red circle"
                />
              </button>
            </div>
            {/* Gated Hangout*/}
            <div style={{ marginBottom: 20 }}>
              <p className="text-[#121418] font-robotoBold  text-lg mb-4">
                Your NFT/POAP can attend these
              </p>
              <div className="flex-row flex-wrap space-x-1">
                <button
                  style={{ width: "49%", marginBottom: 4 }}
                  onClick={() => router.push("hangoutDetail")}
                >
                  <Image
                    src={Hangout1}
                    alt="Hangout"
                    style={{ width: "100%", height: 200, borderRadius: 10 }}
                  />
                </button>
                <button
                  style={{ width: "49%", marginBottom: 4 }}
                  onClick={() => router.push("hangoutDetail")}
                >
                  <Image
                    src={Hangout5}
                    alt="Hangout"
                    style={{ width: "100%", height: 200, borderRadius: 10 }}
                  />
                </button>
                <button
                  style={{ width: "48%", marginBottom: 4 }}
                  onClick={() => router.push("hangoutDetail")}
                >
                  <Image
                    src={Hangout3}
                    alt="Hangout"
                    style={{ width: "100%", height: 200, borderRadius: 10 }}
                  />
                </button>
                <button
                  style={{ width: "48%", marginBottom: 4 }}
                  onClick={() => router.push("hangoutDetail")}
                >
                  <Image
                    src={Hangout4}
                    alt="Hangout"
                    style={{ width: "100%", height: 200, borderRadius: 10 }}
                  />
                </button>
              </div>
            </div>
            {/* <SwipeButton /> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Hangout;
