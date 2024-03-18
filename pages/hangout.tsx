import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  pin,
  plus,
  Hangout1,
  Hangout2,
  Hangout3,
  Hangout4,
  Hangout5,
  pin2,
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
      <div className="bg-[#0A0A0A]  min-h-screen flex flex-col pb-10 ">
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
                <div className="flex flex-row items-center"></div>
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex flex-col justify-between">
                <p className="text-[#d1d1d1] font-lato text-sm mb-2">
                  Your NFT/POAP Info
                </p>
                {isLoading ? (
                  <p className="text-[#d1d1d1]">Loading NFT data...</p>
                ) : nftContractAddress ? (
                  <div className="border-[#ECEC04] border-2 flex flex-row space-x-3 px-3 py-5 relative ">
                    <div className="w-1/2 flex flex-row justify-center items-center ">
                      <MediaRenderer
                        src={nftImageUrl}
                        alt="nft image"
                        width={`${30}`}
                        height={`${30}`}
                      />
                    </div>
                    <div className="flex flex-col text-sm mt-4">
                      <p className="text-[#d1d1d1]">
                        <span className="font-lato text-[#d1d1d1]  ">
                          NFT Contract Address :
                        </span>{" "}
                        {shortenAddress(nftContractAddress)}
                      </p>
                      <p className="text-[#d1d1d1] text-sm mt-2">
                        <span className="font-lato text-[#d1d1d1]">
                          NFT Name :
                        </span>{" "}
                        {nftName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-[#d1d1d1]">
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
              <p className="text-[#d1d1d1] font-lato text-sm ">
                Your NFT/POAP can attend these
              </p>
              {isLoading ? (
                <p className="text-gray-500">Loading NFT data...</p>
              ) : nftContractAddress ? (
                <>
                  {/* list of events */}
                  <div className="grid-cols-2 grid-rows-2 space-y-4 justify-center">
                    <button
                      style={{ width: "48%" }}
                      onClick={() => router.push("hangoutDetail")}
                      className="mr-1"
                    >
                      <div className="bg-[#ECEC04] flex flex-col justify-around w-full h-44 relative pl-1">
                        {" "}
                        <div className="flex flex-col items-end w-full px-3">
                          <p className="text-[#121418] font-roboto text-xs mb-2">
                            Mar 18
                          </p>
                        </div>
                        <div className="text-[#121418] font-lato text-md px-3">
                          MU Buenos Aires
                        </div>
                        <div className="flex flex-row">
                          <Image src={pin2} alt="Pin" className="w-4 h-4" />
                          <p className="text-[#121418] font-lato text-xs">
                            Coworking Space, BA
                          </p>
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg- transform rotate-45 origin-bottom-right translate-y-6 bg-[#0A0A0A]"></div>{" "}
                        <div className="absolute  w-5 h-5 top-0 left-3  rounded-full origin-bottom-right translate-y-3 bg-[#0A0A0A]"></div>{" "}
                      </div>
                    </button>
                    <button
                      style={{ width: "48%" }}
                      onClick={() => router.push("hangoutDetail")}
                      className="mr-1"
                    >
                      <div className="bg-[#ECEC04] flex flex-col justify-around w-full h-44 relative pl-1">
                        {" "}
                        <div className="flex flex-col items-end w-full px-3">
                          <p className="text-[#121418] font-roboto text-xs mb-2">
                            May 20
                          </p>
                        </div>
                        <div className="text-[#121418] font-lato text-md px-3">
                          Buddy-Guard <br />
                          After Party
                        </div>
                        <div className="flex flex-row">
                          <Image src={pin2} alt="Pin" className="w-4 h-4" />
                          <p className="text-[#121418] font-lato text-xs">
                            Bar ERC 721, Dubai
                          </p>
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg- transform rotate-45 origin-bottom-right translate-y-6 bg-[#0A0A0A]"></div>{" "}
                        <div className="absolute  w-5 h-5 top-0 left-3  rounded-full origin-bottom-right translate-y-3 bg-[#0A0A0A]"></div>{" "}
                      </div>
                    </button>
                    <button
                      style={{ width: "48%" }}
                      onClick={() => router.push("hangoutDetail")}
                      className="mr-1"
                    >
                      <div className="bg-[#ECEC04] flex flex-col justify-around w-full h-44 relative pl-1">
                        {" "}
                        <div className="flex flex-col items-end w-full px-3">
                          <p className="text-[#121418] font-roboto text-xs mb-2">
                            July 7
                          </p>
                        </div>
                        <div className="text-[#121418] font-lato text-md px-3">
                          ETH CC
                        </div>
                        <div className="flex flex-row">
                          <Image src={pin2} alt="Pin" className="w-4 h-4" />
                          <p className="text-[#121418] font-lato text-xs">
                            Belgium
                          </p>
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg- transform rotate-45 origin-bottom-right translate-y-6 bg-[#0A0A0A]"></div>{" "}
                        <div className="absolute  w-5 h-5 top-0 left-3  rounded-full origin-bottom-right translate-y-3 bg-[#0A0A0A]"></div>{" "}
                      </div>
                    </button>
                    <button
                      style={{ width: "48%" }}
                      onClick={() => router.push("hangoutDetail")}
                      className="mr-1"
                    >
                      <div className="bg-[#ECEC04] flex flex-col justify-around w-full h-44 relative pl-1">
                        {" "}
                        <div className="flex flex-col items-end w-full px-3">
                          <p className="text-[#121418] font-roboto text-xs mb-2">
                            Nov 10
                          </p>
                        </div>
                        <div className="text-[#121418] font-lato text-md px-3">
                          DevCon
                        </div>
                        <div className="flex flex-row">
                          <Image src={pin2} alt="Pin" className="w-4 h-4" />
                          <p className="text-[#121418] font-lato text-xs">
                            Bangkok, Thailand
                          </p>
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg- transform rotate-45 origin-bottom-right translate-y-6 bg-[#0A0A0A]"></div>{" "}
                        <div className="absolute  w-5 h-5 top-0 left-3  rounded-full origin-bottom-right translate-y-3 bg-[#0A0A0A]"></div>{" "}
                      </div>
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
