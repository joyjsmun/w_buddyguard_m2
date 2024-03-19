import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Modal from "../components/modal";
import {
  BarcodeImg,
  ProfileImg,
  verified,
  group2,
  lock,
  coin,
  reputationImg,
  poap1,
  poap2,
  poap3,
  poap4,
  nft1,
  nft2,
  nft3,
  nft4,
  nft5,
  thumb,
  LogoImage,
} from "../public/assets/images";

import Layout from "@/components/layout";
import axios from "axios";

import initializeFirebaseClient from "../lib/initFirebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { shortenAddressWithChecksum } from "@/components/shortenAddress";
import { DocumentData } from "firebase-admin/firestore";

const Profile = () => {
  const router = useRouter();
  const [isOpenBarcodeModal, setOpenBarcodeModal] = useState(false);
  const [isOpenPersonalInfoModal, setOpenPersonalInfoModal] = useState(false);
  const [isRewardsInfoModal, setIsRewardsInfoModal] = useState(false);
  const [isGroupInfoModal, setIsGroupInfoModal] = useState(false);
  const [isVerifiedModal, setIsVerifiedModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isUserAddress, setIsUserAddress] = useState("");
  const [personalInfoSaved, setPersonalInfoSaved] = useState(false);

  // const [isVerificationModal, setIsVerificationModal] = useState(false);

  const [waltIdCert, setWaltIdCert] = useState(null);

  const [rewards, setRewards] = useState(0); // State to store total rewards score
  const [reputation, setReputation] = useState(0); // State to store total reputation score
  const [rewardRecords, setRewardRecords] = useState<DocumentData[]>([]);
  const [groupContractAddress, setGroupContractAddress] = useState(""); // State to store group contract address
  const [groupInfo, setGroupInfo] = useState({
    groupName: "",
    groupContractAddress: "",
  });

  //arb sep
  // const randomPOAPAddress = "0x4f8f3D60f99a90F0e15b50C8E238d7E02c48086A"; // Example POAP contract address
  // const randomNFTAddress = "0x4f8f3D60f99a90F0e15b50C8E238d7E02c48086A"; // Example NFT contract address

  const randomPOAPAddress = "0x5d417CeEa6C8982d64965df86EA11Bcc82f46db3"; // Example POAP contract address
  const randomNFTAddress = "0x5d417CeEa6C8982d64965df86EA11Bcc82f46db3"; // Example NFT contract address

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { auth, db } = initializeFirebaseClient();
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userRef);
          const userData = userSnapshot.data();
          console.log("userData:", userData); // Add this logging statement
          if (userData) {
            setRewards(userData.totalRewards || 0);
            setReputation(userData.totalReputation || 0);
            setGroupInfo({
              groupName: userData.groupName || "",
              groupContractAddress: userData.groupContractAddress || "",
            });
            setGroupContractAddress(userData.groupContractAddress || "");
            setIsVerified(userData.verified || false);
            setIsUserAddress(user.uid); // Set user address here if needed
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchRewardRecords = async () => {
      try {
        const { db, auth } = initializeFirebaseClient();
        const user = auth.currentUser;

        if (user) {
          const recordsRef = collection(db, `users/${user.uid}/rewardRecords`);
          const querySnapshot = await getDocs(
            query(recordsRef, orderBy("rewardReceivedAt", "desc"))
          );
          const recordsData = querySnapshot.docs.map((doc) => doc.data());
          setRewardRecords(recordsData);
        }
      } catch (error) {
        console.error("Error fetching reward records:", error);
      }
    };

    if (isRewardsInfoModal) {
      fetchRewardRecords();
    }
  }, [isRewardsInfoModal]);

  async function issueVerifiableCredential() {
    console.log("clicked");
    try {
      const response = await axios.post(
        "https://issuer.portal.walt.id/raw/jwt/sign",
        {
          issuanceKey: {
            type: "local",
            jwk: {
              kty: "OKP",
              d: "mDhpwaH6JYSrD2Bq7Cs-pzmsjlLj4EOhxyI-9DM1mFI",
              crv: "Ed25519",
              kid: "Vzx7l5fh56F3Pf9aR3DECU5BwfrY6ZJe05aiWYWzan8",
              x: "T3T4-u1Xz3vAV2JwPNxWfs4pik_JLiArz_WTCvrCFUM",
            },
          },
          issuerDid: "did:key:z6MkjoRhq1jSNJdLiruSXrFFxagqrztZaXHqHGUTKJbcNywp",
          vc: {
            "@context": [
              "https://www.w3.org/2018/credentials/v1",
              "https://purl.imsglobal.org/spec/ob/v3p0/context.json",
            ],
            id: "urn:uuid:THIS WILL BE REPLACED WITH DYNAMIC DATA FUNCTION (see below)",
            type: ["VerifiableCredential", "OpenBadgeCredential"],
            name: "JFF x vc-edu PlugFest 3 Interoperability",
            issuer: {
              type: ["Profile"],
              id: "did:key:THIS WILL BE REPLACED WITH DYNAMIC DATA FUNCTION FROM CONTEXT (see below)",
              name: "Jobs for the Future (JFF)",
              url: "https://www.jff.org/",
              image:
                "https://w3c-ccg.github.io/vc-ed/plugfest-1-2022/images/JFF_LogoLockup.png",
            },
            issuanceDate:
              "2023-07-20T07:05:44Z (THIS WILL BE REPLACED BY DYNAMIC DATA FUNCTION (see below))",
            expirationDate:
              "WILL BE MAPPED BY DYNAMIC DATA FUNCTION (see below)",
            credentialSubject: {
              id: "did:key:123 (THIS WILL BE REPLACED BY DYNAMIC DATA FUNCTION (see below))",
              type: ["AchievementSubject"],
              achievement: {
                id: "urn:uuid:ac254bd5-8fad-4bb1-9d29-efd938536926",
                type: ["Achievement"],
                name: "JFF x vc-edu PlugFest 3 Interoperability",
                description:
                  "This wallet supports the use of W3C Verifiable Credentials and has demonstrated interoperability during the presentation request workflow during JFF x VC-EDU PlugFest 3.",
                criteria: {
                  type: "Criteria",
                  narrative:
                    "Wallet solutions providers earned this badge by demonstrating interoperability during the presentation request workflow. This includes successfully receiving a presentation request, allowing the holder to select at least two types of verifiable credentials to create a verifiable presentation, returning the presentation to the requestor, and passing verification of the presentation and the included credentials.",
                },
                image: {
                  id: "https://w3c-ccg.github.io/vc-ed/plugfest-3-2023/images/JFF-VC-EDU-PLUGFEST3-badge-image.png",
                  type: "Image",
                },
              },
            },
          },
          mapping: {
            id: "<uuid>",
            issuer: {
              id: "<issuerDid>",
            },
            credentialSubject: {
              id: "<subjectDid>",
            },
            issuanceDate: "<timestamp>",
            expirationDate: "<timestamp-in:365d>",
          },
        },
        {
          headers: {
            accept: "application/json",
            "walt-key": JSON.stringify({
              type: "local",
              jwk: '{"kty":"OKP","d":"c0Kp30JlWHo7TTrUlIa5VAITSz7kHyjgcf8GhrE62HM","crv":"Ed25519","kid":"fY65A6wctTWJ8dx0nQMZRSOq9jeTqcvkhBf031-m5xw","x":"jztE8zvLq5jK32Bq3u7BoPh0-F5ZgCzY-yY6-4fyb4k"}',
            }),
            "walt-issuerDid":
              "did:key:z6Mkp6NmHZeksMF5T6uKpLvVqgJQjYjnAZggdKQv2PmfD2ja",
            "walt-subjectDid":
              "did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5Iiwia2lkIjoieGk2RnNJRl9uYVlrN2dFcS0ycHRGQlZEaURUanl5MVpMVUdSWkx3eHE3USIsIngiOiJnQ0NpMHdMem9yRW1QTFNLWVg0bVhsUlRoOVdlQzF6YWYwd1pJRXQySG5JIn0",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Verifiable Credential Issued:", response.data);
      alert("Verification successful!");

      const waltIdCertResponse = response.data;
      setWaltIdCert(waltIdCertResponse);

      const { auth, db } = initializeFirebaseClient();
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          verified: true,
          waltIdCertification: response.data,
        });

        window.location.reload();
      }
    } catch (error) {
      console.error("Error issuing Verifiable Credential:");
    }
  }

  const saveGroupInfoToFirebase = useCallback(async () => {
    try {
      const { auth, db } = initializeFirebaseClient();
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        // Update the user document with the new group name
        await updateDoc(userRef, {
          groupName: groupInfo.groupName,
          groupContractAddress: groupContractAddress,
        });
        setIsGroupInfoModal(false); // Close the modal after saving
      }
    } catch (error) {
      console.error("Error saving group info:", error);
    }
  }, [groupInfo, groupContractAddress]);

  const handleInputChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setGroupInfo((prevGroupInfo) => ({
      ...prevGroupInfo,
      [name]: value,
    }));
  }, []);

  const onClickToggleBarcodeModal = useCallback(() => {
    setOpenBarcodeModal(!isOpenBarcodeModal);
  }, [isOpenBarcodeModal]);

  const onClickTogglePersonalInfoModal = useCallback(() => {
    setOpenPersonalInfoModal(!isOpenPersonalInfoModal);
  }, [isOpenPersonalInfoModal]);

  const onClickToggleRewardsInfoModal = useCallback(() => {
    setIsRewardsInfoModal(!isRewardsInfoModal);
  }, [isRewardsInfoModal]);

  const onClickToggleGroupInfoModal = useCallback(() => {
    setIsGroupInfoModal(!isGroupInfoModal);
  }, [isGroupInfoModal]);

  const onClickToggleVerifiedModal = useCallback(() => {
    setIsVerifiedModal(!isVerifiedModal);
  }, [isVerifiedModal]);

  // const onClickToggleVerificationModal = useCallback(() => {
  //   setIsVerificationModal(!isVerificationModal);
  // }, [isVerificationModal]);

  const onSaveAndEncrypt = useCallback(() => {
    setPersonalInfoSaved(true);
    setOpenPersonalInfoModal(false);
  }, []);

  // Group Creation
  const handlePOAPClick = () => {
    setGroupContractAddress(randomPOAPAddress);
  };

  const handleNFTClick = () => {
    setGroupContractAddress(randomNFTAddress);
  };

  return (
    <Layout>
      <div className="bg-[#0A0A0A] min-h-screen relative mt-12">
        <div className="pt-3 px-4 ">
          {/* Top Section */}
          <div className="">
            <div className="flex flex-col justify-center items-center w-100 h-50 px-8 py-8 border-[#ECEC04] border-4 relative">
              <button
                className="absolute top-2 right-3"
                onClick={onClickToggleBarcodeModal}
              >
                <Image src={BarcodeImg} className="w-12 h-12" alt="Barcode" />
              </button>
              {isOpenBarcodeModal && (
                <Modal onClickToggleModal={onClickToggleBarcodeModal}>
                  <Image src={BarcodeImg} className="w-48 h-48" alt="Barcode" />
                </Modal>
              )}
              <div className="flex justify-center items-center border-2 border-[#ECEC04] rounded-full h-24 w-24">
                <Image
                  src={LogoImage}
                  className="w-14 h-17 rounded-full"
                  alt="Profile"
                />
              </div>
              <div className="text-center">
                <div className="flex items-center">
                  <p className="font-robotoBold text-2xl mr-2 my-2 text-[#d1d1d1]">
                    Vitalic J
                  </p>
                  {isVerified ? (
                    <Image src={verified} className="w-8 h-8" alt="Verified" />
                  ) : (
                    <div></div>
                  )}
                </div>
                <p className="font-lato text-base text-[#d1d1d1]">
                  {isUserAddress
                    ? shortenAddressWithChecksum(isUserAddress)
                    : ""}
                </p>
              </div>
            </div>
          </div>
          {/* Info Section */}
          <div className="space-y-1">
            {/* Verified User Info */}
            {isVerified ? (
              <div>
                <p className="font-robotoBold mb-1">You are a Verified User</p>
                {/* <button onClick={onClickToggleVerificationModal}>Link</button> */}
                {/* <Modal onClickToggleModal={onClickToggleVerificationModal}>
                  <div>
                    <span className="font-latoBold">WaltId Certif</span>
                    <div>{waltIdCert}</div>
                  </div>
                </Modal> */}
                <div className="flex space-x-2">
                  <div className="flex flex-row pl-5 justify-start items-center space-x-5 border-[#ECEC04] border-2 w-[80%] h-16">
                    <Image src={verified} className="w-7 h-7" alt="Group" />
                    <p className="font-lato text-[#d1d1d1] text-sm ">
                      Verification is completed with WaltID
                    </p>
                  </div>
                  <button
                    disabled
                    className=" bg-[#ECEC04] w-20 h-16 px-2 flex justify-center items-center"
                  >
                    <p className="font-lato text-[#0A0A0A]">SUCCESS</p>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-roboto mb-1">
                  Please Verify Your Wallet with WaltID
                </p>
                <div className="flex space-x-2">
                  <div className="flex flex-row pl-5 justify-start items-center space-x-5   border-[#ECEC04] border-2 w-[80%] h-16">
                    <Image src={verified} className="w-7 h-7" alt="Group" />
                    <p className="font-lato text-sm text-[#d1d1d1]">
                      Please Click Verify Button
                    </p>
                  </div>
                  <button
                    onClick={onClickToggleVerifiedModal}
                    className=" border-[#ECEC04] border-2 w-16 h-16 flex justify-center items-center"
                  >
                    <p className="font-lato text-[#d1d1d1]">Verify</p>
                  </button>
                  {/* WaltID Verification Modal */}

                  {isVerifiedModal && (
                    <Modal onClickToggleModal={onClickToggleVerifiedModal}>
                      {/* Save button */}

                      <button
                        onClick={issueVerifiableCredential}
                        className="bg-[#ECEC04] text-[#0A0A0A] p-3 mt-2 flex justify-center items-center  w-full"
                      >
                        <p className="text-[#0A0A0A] font-bold text-lg ">
                          Request WaltID Verification
                        </p>
                      </button>
                    </Modal>
                  )}
                </div>
              </div>
            )}

            {/* Group Info */}
            <div>
              <p className="font-robotoBold mb-1">Group Info</p>
              <div className="flex space-x-2">
                <div className="flex flex-row pl-3 justify-start items-center space-x-3 text-[#d1d1d1] border-[#ECEC04] border-2  w-[80%] h-16">
                  <Image src={group2} className="w-11 h-11" alt="Group" />
                  {/* default - Team Buddy Guard*/}
                  <p className="font-lato text-base">
                    {groupInfo.groupName || "Team Buddy Guard"}
                  </p>
                </div>
                <button
                  onClick={onClickToggleGroupInfoModal}
                  className=" bg-[#ECEC04]  w-16 h-16 flex justify-center items-center"
                >
                  <p className="font-lato text-[#0A0A0A]">EDIT</p>
                </button>
                {/* Group Info Modal */}

                {isGroupInfoModal && (
                  <Modal onClickToggleModal={onClickToggleGroupInfoModal}>
                    {/* Save button */}
                    <div className="bg-[#0A0A0A] h-auto w-full px-2 border-2 border-[#ECEC04] py-2 ">
                      <div className="flex flex-col">
                        <span className="font-roboto mb-2 text-[#d1d1d1]">
                          Type Your Group Name
                        </span>
                        <input
                          name="groupName"
                          placeholder="Your Group Name"
                          value={groupInfo.groupName}
                          onChange={handleInputChange}
                          className="font-lato px-4 py-3  border-2 border-[#ECEC04]  mb-2"
                        />
                        <span className="font-roboto text-[#d1d1d1] mb-2">
                          Group Contract Address
                        </span>
                        <input
                          name="groupContractAddress"
                          value={groupInfo.groupContractAddress}
                          onChange={handleInputChange}
                          placeholder={groupContractAddress || "0x..."}
                          className="px-4 py-3 font-lato border-2 border-[#ECEC04]  "
                        />
                        {/* POAP list */}

                        <span className="font-roboto my-4 text-[#d1d1d1]">
                          Choose POAP Group
                        </span>
                        <div className="flex flex-row justify-between">
                          {/* Example POAP buttons */}
                          <button
                            onClick={handlePOAPClick}
                            className="rounded-full w-14 h-14 border-2 border-[#ECEC04] flex justify-center items-center"
                          >
                            <Image
                              src={poap1}
                              className="w-12 h-12"
                              alt="poap1"
                            />
                          </button>
                          <button
                            onClick={handlePOAPClick}
                            className="rounded-full w-14 h-14 border-2 border-[#ECEC04] flex justify-center items-center"
                          >
                            <Image
                              src={poap2}
                              className="w-12 h-12"
                              alt="poap1"
                            />
                          </button>
                          <button
                            onClick={handlePOAPClick}
                            className="rounded-full w-14 h-14 border-2 border-[#ECEC04] flex justify-center items-center"
                          >
                            <Image
                              src={poap3}
                              className="w-12 h-12"
                              alt="poap1"
                            />
                          </button>
                          <button
                            onClick={handlePOAPClick}
                            className="rounded-full w-14 h-14 border-2 border-[#ECEC04] flex justify-center items-center"
                          >
                            <Image
                              src={poap4}
                              className="w-12 h-12"
                              alt="poap1"
                            />
                          </button>
                          {/* Add more POAP buttons as needed */}
                        </div>
                        {/* NFT list */}
                        <div>
                          <p className="font-roboto text-[#d1d1d1] my-4">
                            Choose NFT Collection Group
                          </p>
                          <div className="flex flex-row justify-between">
                            {/* Example NFT buttons */}
                            <button
                              onClick={handleNFTClick}
                              className="rounded-md w-14 h-14 border-2 border-[#ECEC04] flex justify-center items-center"
                            >
                              <Image
                                src={nft1}
                                className="w-12 h-12"
                                alt="nft1"
                              />
                            </button>
                            <button
                              onClick={handleNFTClick}
                              className="rounded-md w-14 h-14 border-2 border-[#ECEC04] flex justify-center items-center"
                            >
                              <Image
                                src={nft5}
                                className="w-12 h-12"
                                alt="nft1"
                              />
                            </button>
                            <button
                              onClick={handleNFTClick}
                              className="rounded-md w-14 h-14 border-2 border-[#ECEC04] flex justify-center items-center"
                            >
                              <Image
                                src={nft3}
                                className="w-12 h-12"
                                alt="nft1"
                              />
                            </button>
                            <button
                              onClick={handleNFTClick}
                              className="rounded-md w-14 h-14 border-2 border-[#ECEC04] flex justify-center items-center"
                            >
                              <Image
                                src={nft4}
                                className="w-12 h-12"
                                alt="nft1"
                              />
                            </button>
                            {/* Add more NFT buttons as needed */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={saveGroupInfoToFirebase}
                      className="bg-[#ECEC04]   p-3 flex justify-center items-center  w-full mt-6"
                    >
                      <p className="text-[##0A0A0A] font-lato ">SAVE GROUP</p>
                    </button>
                  </Modal>
                )}
              </div>
            </div>

            {/* Personal Info */}
            <div className="">
              <p className="font-robotoBold mb-1">S0S Private Info</p>
              <div className="flex space-x-2">
                <div className="flex flex-row pl-5 justify-start items-center space-x-3 text-[#d1d1d1] border-[#ECEC04] border-2  w-[80%] h-16">
                  <Image src={lock} className="w-7 h-7" alt="Lock" />
                  <p className="font-lato text-sm">Encrypted Personal Info</p>
                </div>
                <button
                  onClick={onClickTogglePersonalInfoModal}
                  className="  w-16 h-16 flex justify-center items-center bg-[#ECEC04]"
                >
                  <p className="font-lato text-[#0A0A0A]">ADD</p>
                </button>
                {/* Personal Information Modal */}
                {isOpenPersonalInfoModal && (
                  <Modal onClickToggleModal={onClickTogglePersonalInfoModal}>
                    <p className="font-latoBold text-md pb-2 mb-1 text-[#d1d1d1]">
                      Personal Information for SOS
                    </p>
                    <p className="font-roboto text-[#d1d1d1]">
                      Your Personal Name
                    </p>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="p-2 my-2 border-2 border-[#ECEC04] w-full"
                    />
                    <p className="font-roboto text-[#d1d1d1]">
                      SOS Contact Name
                    </p>
                    <input
                      type="text"
                      placeholder="SOS Contact Name"
                      className="p-2 my-2 border-2 border-[#ECEC04]    w-full"
                    />
                    <p className="font-roboto text-[#d1d1d1]">
                      SOS Contact Number
                    </p>
                    <input
                      type="text"
                      placeholder="SOS Contact Number"
                      className="p-2 my-2 border-2 border-[#ECEC04]    w-full"
                    />
                    {/* Save button */}
                    <button
                      onClick={onSaveAndEncrypt}
                      className="bg-[#ECEC04] p-2  flex justify-center items-center mt-6  w-full"
                    >
                      <p className="text-[#0A0A0A] font-roboto text-md py-1 ">
                        SAVE & ENCRYPT
                      </p>
                    </button>
                  </Modal>
                )}
              </div>
            </div>
            {/* Reward Info */}
            <div>
              <div
                className="flex flex-row justify-between items-center pt-4  mb-4 space-x-6
              "
              >
                <p className="font-roboto mb-1 text-[#d1d1d1]">
                  Rewards & Reputation
                </p>
                <button
                  onClick={onClickToggleRewardsInfoModal}
                  className="  bg-[#ECEC04] w-full h-11 flex justify-center items-center"
                >
                  <p className="font-lato text-[#0A0A0A]">CHECK RECORDS</p>
                </button>
              </div>
              <div className="flex flex-row justify-between space-x-2 ">
                <div className="flex space-x-2">
                  <div className="flex flex-row pl-2  justify-between items-center space-x-2   border-[#ECEC04] border-2 text-[#d1d1d1] w-[100%] h-16 px-2">
                    <Image src={coin} className="w-9 h-9 ml-3" alt="Coin" />
                    <p className="font-bold text-base text-center pr-2">
                      <span className="font-latoBlack text-[#d1d1d1]">
                        {rewards}
                      </span>
                      <span className="font-lato text-[#d1d1d1]">
                        {" "}
                        BG Token
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="flex flex-row pl-2  justify-between items-center space-x-2   border-[#ECEC04] border-2 text-[#d1d1d1] w-[100%] h-16 px-2">
                    <Image src={thumb} className="w-7 h-8" alt="Coin" />
                    <p className="font-bold text-base pr-4 text-center ">
                      <span className="font-latoBlack ">{reputation}</span>{" "}
                      <span className="font-latoBlak text-[#d1d1d1]">High</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Rewards Information Modal */}
            {isRewardsInfoModal && (
              <Modal onClickToggleModal={onClickToggleRewardsInfoModal}>
                <p className="font-robotoBold text-lg pb-2 w-full">
                  Your Buddy Guard Records
                </p>
                <div>
                  {/* list of records */}
                  {rewardRecords.map((record, index) => (
                    <div key={index} className="border-b-2 pb-2 mb-2">
                      <p className="font-latoBold"># {record.orderNumber}</p>
                      <p>
                        <span className="font-latoBold">Type: </span>
                        <span className="font-lato">{record.type}</span>
                      </p>
                      <p>
                        <span className="font-latoBold">Date: </span>
                        <span className="font-lato">
                          {record.rewardReceivedAt.toDate().toLocaleString()}
                        </span>
                      </p>

                      <p>
                        <span className="font-latoBold">Reward Amount:</span>{" "}
                        <span className="font-lato">{record.rewardAmount}</span>
                      </p>
                      <p>
                        <span className="font-latoBold">Total Repuation:</span>{" "}
                        <span className="font-lato">
                          {" "}
                          {record.totalReputation}
                        </span>
                      </p>
                      <p>
                        {" "}
                        <span className="font-latoBold">
                          Total Rewards:
                        </span>{" "}
                        <span className="font-lato">
                          {" "}
                          {record.totalRewards}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
                {/* Save button */}
              </Modal>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
