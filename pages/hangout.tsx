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
import { ConnectWallet, MediaRenderer, useAddress } from "@thirdweb-dev/react";
import { shortenAddress } from "@/components/shortenAddress";

const Hangout = () => {
  const walletAddress = useAddress() || "";
  const router = useRouter();
  const [nftContractAddress, setNftContractAddress] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftImageUrl, setNftImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNFTData = async () => {
      setIsLoading(true);
      try {
        const client = new CovalentClient("cqt_rQwXmFK4c4YMm8xwr8XrBmwmdh7H");

        const resp =
          await client.BalanceService.getHistoricalTokenBalancesForWalletAddress(
            "eth-sepolia",
            walletAddress,
            { nft: true }
          );

        console.log("API Response:", resp.data);

        if (resp.data && resp.data.items && resp.data.items.length > 2) {
          const nftData = resp.data.items[2].nft_data?.[0];
          if (nftData) {
            setNftContractAddress(resp.data.items[2].contract_address);
            setNftName(nftData.external_data.name);
            setNftImageUrl(nftData.external_data.image);
          } else {
            console.log("No NFT data found in the API response");
          }
        } else {
          console.log("No NFT data found for the wallet address");
        }
      } catch (error) {
        console.error("Error fetching NFT data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTData();
  }, [walletAddress]);

  return (
    <Layout>
      <div className="bg-white  min-h-screen flex flex-col pb-20 ">
        <div className="pt-9  flex justify-between items-center">
          <div className="pt-9 px-4 flex flex-col space-y-4">
            <div className="flex flex-row justify-between items-center">
              <p className="text-[#121418] font-bold font-latoBold">
                {" "}
                <ConnectWallet theme={"light"} modalSize={"compact"} />
              </p>
              <button
                className="flex flex-row"
                onClick={() => router.push("Setting")}
              >
                <div className="flex flex-row items-center">
                  {/* <Image src={pin} alt="Pin" className="w-3 h-3 mr-2" /> */}
                  {/* <p className="text-[#121418] font-latoBold text-sm">
                    Current Location : Barcelona
                  </p> */}
                </div>
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex flex-col justify-between">
                <p className="text-[#121418] font-robotoBold  text-lg">
                  Your NFT/POAP Info
                </p>
                {isLoading ? (
                  <p className="text-gray-500">Loading NFT data...</p>
                ) : nftContractAddress ? (
                  <div className="border-2 border-gray-500 rounded-md p-3">
                    <div className="flex flex-col">
                      <p>
                        <span className="font-robotoBold">
                          NFT Contract Address :
                        </span>{" "}
                        {shortenAddress(nftContractAddress)}
                      </p>
                      <p>
                        <span className="font-robotoBold">NFT Name :</span>{" "}
                        {nftName}
                      </p>
                    </div>
                    <div className="w-1/2 flex flex-row justify-center items-center border-2 border-gray-500 p-1">
                      <MediaRenderer
                        src={nftImageUrl}
                        alt="nft image"
                        width={`${20}`}
                        height={`${20}`}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    You do not have any NFT/POAP yet!
                  </p>
                )}
              </div>

              <button onClick={() => router.push("hangoutDetail")}>
                {/* <Image
                  src={nftImageUrl}
                  alt="Hangout"
                  className="w-full h-40  mb-2 rounded-lg"
                  width={500} // Set a fixed width
                  height={200} // Set a fixed height
                /> */}
              </button>
            </div>
            {/* Gated Hangout*/}
            <div style={{ marginBottom: 20 }}>
              <p className="text-[#121418] font-robotoBold  text-lg mb-4">
                Your NFT/POAP can attend these
              </p>
              {isLoading ? (
                <p className="text-gray-500">Loading NFT data...</p>
              ) : nftContractAddress ? (
                <>
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
                </>
              ) : (
                <div className="text-center text-gray-500 flex flex-col justify-center items-center ">
                  <div> You Do NOT have any related event today!</div>
                  <div>Please change your wallet account</div>
                </div>
              )}
            </div>

            {/* <SwipeButton /> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Hangout;
