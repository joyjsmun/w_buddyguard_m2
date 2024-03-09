import React, { useState } from "react";
// Import Push SDK & Ethers
import { PushAPI } from "@pushprotocol/restapi";
import { useWalletClient } from "wagmi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";

const TestPage = () => {
  const { data: signer } = useWalletClient();

  const handleSendMessage = async () => {
    // Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
    const userAlice = await PushAPI.initialize(signer, { env: "staging" as ENV});

    // Send a message to Bob
    await userAlice.chat.send("0x7C81461eE3EfEc10CC6BB3A3DbBA3CCA9B0EF127", {
      content: "Gm gm! SOS Help meeeeee!!!!!",
    });
  };

  return (
    <div>
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default TestPage;
