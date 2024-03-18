import React, { useState } from "react";
import { useRouter } from "next/router";
import Modal from "../components/modal";
import Map from "../pages/map";

import Image from "next/image";

import Layout from "@/components/layout";
import {
  Hangout1,
  Hangout4,
  Hangout5,
  bell,
  pin,
  pin2,
} from "@/public/assets/images";
import { ConnectWallet, useSigner } from "@thirdweb-dev/react";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { PushAPI } from "@pushprotocol/restapi";

const Home = () => {
  const router = useRouter();
  const isMapPage = router.pathname === "/map";
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  const handleSosRequestModal = () => {
    setIsSosModalOpen(!isSosModalOpen);
  };

  const signer = useSigner();

  const handleSendMessage = async (signer: any) => {
    // Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
    const userAlice = await PushAPI.initialize(signer, {
      env: "staging" as ENV,
    });

    const messageContent = `Emergency Situation\nSOS User: Vitalik J\nSOS Location Link: 1212st, Barcelona, Spain\nPersonal Contact Number: 987-232-1829`;

    // Send a message to Bob
    await userAlice.chat.send("0x97d7a75Bec591698e7FAd02c2e89f6b1E79D343C", {
      content: messageContent,
    });
  };

  const handleSendSOSMessage = async (signer: any) => {
    try {
      await handleSendMessage(signer); // Call handleSendMessage function
      console.log("SOS message sent successfully");
      window.alert("SOS message sent successfully");
    } catch (error) {
      console.error("Error sending SOS message:", error);
    }
  };

  return (
    <Layout>
      <div className="bg-[#0A0A0A] min-h-screen flex flex-col ">
        <div className="pt-5 px-3 flex justify-between items-center mt-8">
          <ConnectWallet theme={"light"} modalSize={"compact"} />
          <div className="flex flex-row space-x-1 ">
            <button
              // onClick={() => router.push("/acceptRequest")}
              className="bg-[#ECEC04] w-10 h-10 rounded-full flex justify-center items-center"
            >
              <Image src={bell} className="w-5 h-5" alt="bell" />
            </button>
            <button onClick={handleSosRequestModal}>
              <div className="w-10 h-10 ml-1 bg-[#ECEC04] rounded-full flex justify-center items-center">
                <span className="text-[#0A0A0A] font-latoBlack">SOS</span>
              </div>
            </button>
          </div>
        </div>
        <div
          className="overflow-y-auto pt-4 px-4 flex flex-col space-y-2"
          style={{ paddingBottom: "80px" }}
        >
          <div className="flex flex-col space-y-1 mt-2">
            <h2 className="text-[#d1d1d1] font-lato text-sm mb-2">
              Explore Your Neighborhood
            </h2>
            <div
              className={`w-full ${isMapPage ? "h-screen" : "h-[32vh]"}`}
              onClick={() => router.push("/map")}
            >
              <Map preview={!isMapPage} showOthers={false} />
            </div>
          </div>
          <div className="flex flex-col space-y-2 px-1">
            <h2 className="text-[#d1d1d1] font-lato text-sm mb-1">
              Upcoming Events
            </h2>
            {/* hangout events */}
            <div className="flex flex-row items-center">
              <div className="grid grid-cols-2 justify-center items-center w-full space-x-1">
                <div className="bg-[#ECEC04] flex flex-col justify-around w-[98%] h-44 relative pl-1">
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
                      Coworking Space, Argentina
                    </p>
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg- transform rotate-45 origin-bottom-right translate-y-6 bg-[#0A0A0A]"></div>{" "}
                  <div className="absolute  w-5 h-5 top-0 left-3  rounded-full origin-bottom-right translate-y-3 bg-[#0A0A0A]"></div>{" "}
                </div>
                <div className="bg-[#ECEC04] flex flex-col justify-around w-[98%] h-44 relative pl-1">
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
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center pt-8">
            <button className="bg-[#ECEC04] font-lato text-md text-[#0A0A0A] py-2 w-full flex items-center justify-center ">
              SWIPE HANGOUT
            </button>
          </div>
        </div>

        {isSosModalOpen && (
          <Modal onClickToggleModal={handleSosRequestModal}>
            <h3 className="font-lato text-md pb-2">SOS Message</h3>
            <p className="mb-3 font-lato">
              We Will Send This Msg to the Buddy Guard :
            </p>
            <div className="bg-[#ECEC04] w-30 h-34 mb-3 flex flex-col justify-center space-y-2 p-3  ">
              <p className="font-lato text-[#0A0A0A] text-center">
                **Emergency Situation**
              </p>

              <p className="font-lato text-[#0A0A0A]">SOS User : Vitalik J</p>
              <p className="font-lato text-[#0A0A0A]">
                SOS Location Link : 1212st, Barcelona, Spain
              </p>
              <p className="font-lato text-[#0A0A0A]">
                Personal Contact Number : 987-232-1829
              </p>
            </div>
            <p className="text-[#0A0A0A] font-latoLight leading-5">
              Help will be on the way soon. If possible, provide any additional
              information or updates to the Buddy Guard Group once they arrive
            </p>
            <button
              onClick={() => handleSendSOSMessage(signer)}
              className="bg-[#ECEC04] text-[#0A0A0A] font-lato py-3 px-6   mt-4 w-full"
            >
              Send SOS Message Now
            </button>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Home;
