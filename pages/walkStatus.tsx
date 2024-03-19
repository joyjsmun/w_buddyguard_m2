import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Avatar1,
  Avatar2,
  LogoImage,
  arrive,
  complete,
  help,
  pin2,
} from "../public/assets/images";
import Modal from "../components/modal";
import Layout from "@/components/layout";
import {
  doc,
  query,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
  collection,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { ethers } from "ethers";
import initializeFirebaseClient from "../lib/initFirebase";
import { getAuth, User } from "firebase/auth";
import Map from "../pages/map";

interface UserLocation {
  location: {
    latitude: number;
    longitude: number;
  };
  lastUpdated: any;
  previousLocation: {
    latitude: number;
    longitude: number;
  };
}

import { StaticImageData } from "next/image";

interface BuddyGuard {
  id: number;
  avatar: StaticImageData;
  address: string;
}

const WalkStatus = () => {
  const router = useRouter();
  const [isSosModal, setIsSosModal] = useState(false);
  const [isOrderId, setIsOrderId] = useState(55);
  const [selectedBuddyGuard, setSelectedBuddyGuard] =
    useState<BuddyGuard | null>(null);
  const [isCurrentBuddyGuard, setIsCurrentBuddyGuard] = useState<BuddyGuard[]>(
    []
  );
  const [selectedRemoveBuddyGuard, setSelectedRemoveBuddyGuard] =
    useState<BuddyGuard | null>(null);

  const [userLocations, setUserLocations] = useState<
    Record<string, UserLocation>
  >({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [infoWindowData, setInfoWindowData] = useState<string | null>(null);

  const isMapPage = router.pathname === "/map";

  const [nearbyBuddyGuards, setNearbyBuddyGuards] = useState<BuddyGuard[]>([
    {
      id: 1,
      avatar: Avatar1,
      address: "0x97d7a75Bec591698e7FAd02c2e89f6b1E79D343C",
    },
    {
      id: 2,
      avatar: LogoImage,
      address: "0xb89C33bE71c2aAd77d6712b1AD47274aD9fb7dcb",
    },
  ]);

  const { db: firestore } = initializeFirebaseClient();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Listen for changes in user locations
    const unsubscribe = onSnapshot(
      collection(firestore, "users"),
      (snapshot) => {
        const locations = snapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data() as UserLocation;
          return acc;
        }, {} as Record<string, UserLocation>);
        setUserLocations(locations);
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const handleInfoWindowData = (data: string | null) => {
    setInfoWindowData(data);
  };

  // Function to handle selecting a Buddy Guard
  const handleSelectBuddyGuard = (buddyGuard: BuddyGuard) => {
    setSelectedBuddyGuard(buddyGuard);
  };
  // Add Guardian
  const handleAddBuddyGuard = async () => {
    if (!selectedBuddyGuard) {
      console.error("No Buddy Guard selected.");
      return;
    }
    handleChangeGuardians();

    // Add the selected buddy guard to the isCurrentBuddyGuard array
    setIsCurrentBuddyGuard((prevCurrentBuddyGuards) => [
      ...prevCurrentBuddyGuards,
      selectedBuddyGuard,
    ]);

    // Remove the selected buddy guard from the nearbyBuddyGuards list
    setNearbyBuddyGuards((prevNearbyBuddyGuards) =>
      prevNearbyBuddyGuards.filter(
        (buddyGuard) => buddyGuard.id !== selectedBuddyGuard.id
      )
    );

    // Reset the selected buddy guard state
    setSelectedBuddyGuard(null);
  };

  // Remove Guardian
  const handleRemoveBuddyGuard = async (buddyGuardToRemove: BuddyGuard) => {
    if (!buddyGuardToRemove) {
      console.error("No buddy guard selected for removal.");
      return;
    }

    handleChangeGuardians();

    // Add the selected buddy guard back to the nearbyBuddyGuards list
    setNearbyBuddyGuards((prevNearbyBuddyGuards) => [
      ...prevNearbyBuddyGuards,
      buddyGuardToRemove,
    ]);

    // Remove the selected buddy guard from the isCurrentBuddyGuard array
    setIsCurrentBuddyGuard((prevCurrentBuddyGuards) => {
      const updatedCurrentBuddyGuards = prevCurrentBuddyGuards.filter(
        (guard) => guard.id !== buddyGuardToRemove.id
      );

      return updatedCurrentBuddyGuards;
    });

    // Reset the selected remove buddy guard state
    setSelectedRemoveBuddyGuard(null);
  };

  async function handleChangeGuardians() {
    // Check if Ethereum is available in the browser
    if (!window.ethereum) {
      console.error(
        "Error: Ethereum provider not found. Please install MetaMask or another Ethereum wallet."
      );
      return;
    }

    // Request access to the user's Ethereum account and signature
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("Error requesting Ethereum account access:", error);
      return;
    }

    // Use the injected provider from MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Get the current user's wallet
    const userWallet = provider.getSigner();

    // Get the address of the BuddyGuard contract from environment variables
    const buddyGuardAddress = "0x4EeFA835A807c36DD0a643A7D97cD6E2b8Ca29c2";

    // ABI for the BuddyGuard contract's `changeGuardians` function
    const buddyGuardABI = [
      "function changeGuardians(uint256 _orderId, address[] calldata _guardiansToAdd, address[] calldata _guardiansToRemove) external",
    ];

    // Connect to the BuddyGuard contract using the user's wallet
    const buddyGuardContract = new ethers.Contract(
      buddyGuardAddress,
      buddyGuardABI,
      userWallet
    );

    // Specify the order ID and guardians to add/remove
    const orderId = isOrderId;
    const guardiansToAdd = selectedBuddyGuard
      ? [selectedBuddyGuard.address]
      : [];
    const guardiansToRemove = selectedRemoveBuddyGuard
      ? [selectedRemoveBuddyGuard.address]
      : [];

    try {
      // Call the `changeGuardians` function on the BuddyGuard contract
      const tx = await buddyGuardContract.changeGuardians(
        orderId,
        guardiansToAdd,
        guardiansToRemove,
        {
          gasLimit: 10000000, // Specify your desired gas limit here
        }
      );

      await tx.wait(); // Wait for the transaction to be mined

      console.log("Guardians changed successfully");
      console.log("Guardians to add:", guardiansToAdd);
      console.log("Guardians to remove:", guardiansToRemove);

      window.alert("Guardians changed successfully");
    } catch (error) {
      console.error("Error changing guardians:", error);
    }
  }

  async function handleCompleteOrder() {
    try {
      // The address of the deployed buddyGuard contract
      const contractAddress = "0x4EeFA835A807c36DD0a643A7D97cD6E2b8Ca29c2";

      // The ID of the order to complete
      const orderId = isOrderId; // Example order ID, replace with actual order ID

      // Check if Ethereum is available in the browser
      if (!window.ethereum) {
        throw new Error(
          "Ethereum provider not found. Please install MetaMask or another Ethereum wallet."
        );
      }

      // Request access to the user's Ethereum account and signature
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Use the injected provider from MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the signer
      const signer = provider.getSigner();

      // The ABI for the buddyGuard contract's `completeOrder` function
      const contractABI = ["function completeOrder(uint256 _orderId) external"];

      // Connect to the buddyGuard contract
      const buddyGuard = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Call the `completeOrder` function
      console.log(`Completing order with ID: ${orderId}`);
      const tx = await buddyGuard.completeOrder(orderId, {
        gasLimit: 10000000, // Specify your desired gas limit here
      });
      await tx.wait(); // Wait for the transaction to be mined

      console.log(
        `Order with ID ${orderId} completed successfully. Transaction Hash: ${tx.hash}`
      );

      const txHash = tx.hash;
      const url = `https://sepolia.arbiscan.io/tx/${txHash}`;
      const message = `Buddy Guard service order completed successfully!! Transaction Hash: ${txHash}`;
      window.alert(message);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error completing order:", error);
    }
  }

  const handleArrive = async () => {
    try {
      const { auth, db } = initializeFirebaseClient();

      // Get the current user
      const user = auth.currentUser;

      if (user) {
        // Update user document in Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          totalRewards: increment(5000),
          totalReputation: increment(100), // Increment reputation by 1
        });

        // Get the updated totalRewards from the user document
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const totalRewards = userSnapshot.data()?.totalRewards;
          const totalReputation = userSnapshot.data()?.totalReputation;

          // Get the last orderNumber
          const recordsRef = collection(db, `users/${user.uid}/rewardRecords`);
          const querySnapshot = await getDocs(
            query(collection(db, `users/${user.uid}/rewardRecords`))
          );
          const lastRecord = querySnapshot.docs[querySnapshot.docs.length - 1];
          const lastOrderNumber = lastRecord
            ? lastRecord.data().orderNumber
            : 0;

          // Add record to the user's reward_records subcollection
          await addDoc(recordsRef, {
            orderNumber: increment(lastOrderNumber + 1),
            type: "Buddy Guard Service Reward",
            rewardAmount: 5000,
            totalRewards: totalRewards,
            totalReputation: totalReputation,
            rewardReceivedAt: serverTimestamp(),
          });

          console.log("Successfully updated user data and added record.");
          // Navigate to home page after successful update
          router.push("/home");
        } else {
          console.error("User document does not exist.");
          // Display an error message to the user, indicating that the user document does not exist
          // For example:
          // setError("User document does not exist. Please try again later.");
        }
      } else {
        console.error("User not found.");
        // Display an error message to the user, indicating that they need to sign in first
        // For example:
        // setError("User not found. Please sign in first.");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      // You can handle errors here, such as displaying an error message to the user
      // For example:
      // setError("Error updating user data. Please try again later.");
    }
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push("/safetyTimer");
  //   }, 7000);
  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <Layout>
      <div className="bg-[#0A0A0A] min-h-screen flex flex-col mt-12">
        <div className="px-4 flex w-full flex-col space-y-2">
          {/* Top Section */}
          <div className="flex flex-col space-y-2">
            <div
              className={`w-full ${isMapPage ? "h-screen" : "h-[32vh]"}`}
              onClick={() => router.push("/map")}
            >
              <Map
                preview={!isMapPage}
                showOthers={false}
                userLocations={userLocations}
                currentUser={currentUser}
                onInfoWindowData={handleInfoWindowData}
              />
            </div>
          </div>
          <div className=" border-[#ECEC04] border-2  px-4 py-2 flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <p className="font-lato text-[#d1d1d1]">Status</p>
              {/* added buddy guard will be added here */}
              {/* Display the selected buddy guard's and current avatar */}
              <div className="flex flex-row space-x-2">
                <button className="">
                  <Image
                    className="w-16 h-16 rounded-full relative  border-4 border-[#ECEC04] p-1  "
                    src={Avatar2}
                    alt="current avatar"
                  />
                </button>

                {/* Display the selected buddy guard's avatar */}
                {selectedBuddyGuard && (
                  <button className="">
                    <Image
                      className="w-16 h-16 rounded-full relative border-4 border-[#ECEC04] p-1"
                      src={selectedBuddyGuard.avatar}
                      alt={`Buddy Guard ${selectedBuddyGuard.id}`}
                    />
                  </button>
                )}
                {isCurrentBuddyGuard.length > 0 && (
                  <button className="">
                    <Image
                      className="w-16 h-16 rounded-full relative border-4 border-[#ECEC04] p-1"
                      src={isCurrentBuddyGuard[0].avatar} // Assuming you only want to display the first buddy guard in the array
                      alt={`Buddy Guard ${isCurrentBuddyGuard[0].id}`}
                    />
                  </button>
                )}
              </div>

              <p className="font-latoLight text-[#d1d1d1]">
                {" "}
                Your Buddy Guard has been walking with you about 7mins
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row justify-between">
                <p className="font-lato text-[#d1d1d1]">Current Location</p>
                {/* <p className="font-lato text-red-500">3 min left</p> */}
              </div>
              <div className="bg-[#ECEC04] px-4 py-2 flex flex-col space-y-2">
                <div className="flex flex-row items-center space-x-2">
                  <Image src={pin2} className="w-7 h-7" alt="Pin" />
                  <div className="text-[#0A0A0A] text-sm">{infoWindowData}</div>
                </div>
              </div>
            </div>
            {isSosModal && (
              <Modal onClickToggleModal={() => setIsSosModal(!isSosModal)}>
                <p className="font-bold text-lg pb-2">SOS Message</p>
                <p className="font-semibold">
                  We Will Send This Msg to the Buddy Guard :
                </p>
                <div className="bg-yellow-400 w-30 h-34 mb-3 flex justify-center space-y-2 p-3  ">
                  <p className="font-bold">
                    SOS Time: 21:34, February 21st, 2024
                  </p>
                  <p className="font-bold">
                    SOS Location Link : 1212st, Bogota, Colombia
                  </p>
                  <p className="font-bold">
                    Personal Contact Number : 987-232-1829
                  </p>
                </div>
                <div className="my-3">
                  <p className="text-red-500 font-bold leading-5">
                    Help will be on the way soon. If possible, provide any
                    additional information or updates to the Buddy Guard Group
                    once they arrive
                  </p>
                </div>
                <button className="bg-red-500 text-white font-bold py-3 px-6  ">
                  Send SOS Message Now
                </button>
              </Modal>
            )}
            <div className="flex justify-between">
              <div className="flex flex-col space-y-2">
                <p className="font-lato  mb-2 text-[#d1d1d1]">
                  Add / Remove more nearby Buddy Guards
                </p>
                <div className="w-full flex flex-row space-x-3">
                  {nearbyBuddyGuards.map((buddyGuard) => (
                    <button
                      key={buddyGuard.id}
                      onClick={() => handleSelectBuddyGuard(buddyGuard)}
                    >
                      <Image
                        className="w-16 h-16 rounded-full relative border-4 border-[#ECEC04] p-1"
                        src={buddyGuard.avatar}
                        alt={`Buddy Guard ${buddyGuard.id}`}
                      />
                    </button>
                  ))}
                </div>
                {/* Add Button */}
                {selectedBuddyGuard && (
                  <button
                    onClick={handleAddBuddyGuard}
                    className="bg-[#ECEC04] text-[#0A0A0A] font-lato py-1 w-1/4 "
                  >
                    ADD
                  </button>
                )}
              </div>
            </div>
            {/* Display remove button for selected buddy guard */}
            {/* Display the selected buddy guard's avatar */}
            <div>
              {/* {selectedBuddyGuard && (
                <button className="">
                  <Image
                    className="w-16 h-16 rounded-full relative border-4 border-green-500 p-1"
                    src={selectedBuddyGuard.avatar}
                    alt={`Buddy Guard ${selectedBuddyGuard.id}`}
                  />
                </button>
              )} */}

              {/* Display remove button for each buddy guard in isCurrentBuddyGuard */}
              {isCurrentBuddyGuard.map((buddyGuard) => (
                <div key={buddyGuard.id} className="relative py-1">
                  <button
                    onClick={() => handleRemoveBuddyGuard(buddyGuard)}
                    className=" absolute top-4 right-10 bg-[#ECEC04] text-[#0A0A0A] font-lato py-1 w-1/4   items-center justify-center"
                  >
                    REMOVE
                  </button>
                  <Image
                    className="w-16 h-16 rounded-full relative border-4 border-[#ECEC04] p-1 "
                    src={buddyGuard.avatar}
                    alt={`Buddy Guard ${buddyGuard.id}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-around items-center space-x-3">
              <button
                onClick={() => setIsSosModal(true)}
                className="bg-[#ECEC04] flex flex-row text-[#0A0A0A] justify-center items-center font-lato py-2 w-full  "
              >
                SEND SOS
                {/* <Image src={help} className="w-7 h-7 ml-1" alt="Complete" /> */}
              </button>

              <button
                onClick={async () => {
                  await handleCompleteOrder();
                  await handleArrive();

                  router.push("/home");
                }}
                className="bg-[#ECEC04] flex flex-row text-[#0A0A0A] justify-center items-center font-lato py-2 w-full animate-pulse "
              >
                ARRIVED
                <Image src={complete} className="w-7 h-7 ml-1" alt="Complete" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WalkStatus;
