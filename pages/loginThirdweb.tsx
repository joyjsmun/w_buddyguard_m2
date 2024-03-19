import React, { useState } from "react";
import { ConnectWallet, useAddress, useAuth } from "@thirdweb-dev/react";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { signInWithCustomToken } from "firebase/auth";
import initializeFirebaseClient from "../lib/initFirebase";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { LogoImage } from "@/public/assets/images";

export default function Login() {
  const thirdwebAuth = useAuth();
  const address = useAddress();
  const { auth, db } = initializeFirebaseClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function signIn() {
    setIsLoading(true); // Set loading state to true before initiating the sign-in process
    const payload = await thirdwebAuth?.login();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });

      const { token } = await res.json();

      const userCredential = await signInWithCustomToken(auth, token);
      const user = userCredential.user;

      const usersRef = doc(db, "users", user.uid!);
      const userDoc = await getDoc(usersRef);

      if (!userDoc.exists()) {
        setDoc(
          usersRef,
          {
            createdAt: serverTimestamp(),
            groupName: "Add Your BuddyGuard Group Info",
            groupContractAddress: "",
            totalRewards: 0,
            totalReputation: 0,
            personalInfo: "",
            verified: false,
            waltIdCertification: "",
          },
          { merge: true }
        );
      }

      // Navigate to the home page after successful sign-in
      router.push("/home");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading state back to false after the sign-in process completes
    }
  }

  return (
    <div className="bg-[#0A0A0A] flex flex-col space-y-10 items-center justify-center h-screen relative border-4 border-[#ECEC04]">
      <Head>
        <title>Login Page</title>
        <meta name="login" />
      </Head>
      {/* loading page start */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <Image className="w-20 h-22 mb-2" src={LogoImage} alt="Logo" />
        <h1 className="font-kodeSemi text-center text-4xl text-[#ECEC04]">
          Buddy Guard
        </h1>
        <p className="text-center text-gray-100 font-latoLight text-lg">
          Safety Social dApp
        </p>
      </div>
      <div>
        {address ? (
          <button
            className="bg-[#ECEC04] w-full p-4 font-bold text-[#0A0A0A]"
            onClick={() => signIn()}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">Loading...</span>
                <svg
                  className="animate-spin h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Join Buddy Guard Member"
            )}
          </button>
        ) : (
          <ConnectWallet />
        )}
      </div>
    </div>
  );
}
