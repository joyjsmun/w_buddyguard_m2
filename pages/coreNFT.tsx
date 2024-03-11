import React from "react";

export default function CoreNFT() {
  return (
    <div className="h-56 w-full p-2 border-2 border-blue-500 rounded-lg ">
      <iframe
        src="https://embed.ipfscdn.io/ipfs/bafybeicd3qfzelz4su7ng6n523virdsgobrc5pcbarhwqv3dj3drh645pi/?contract=0x4f8f3D60f99a90F0e15b50C8E238d7E02c48086A&chain=%7B%22name%22%3A%22Arbitrum+Sepolia%22%2C%22chain%22%3A%22ETH%22%2C%22rpc%22%3A%5B%22https%3A%2F%2F421614.rpc.thirdweb.com%2F%24%7BTHIRDWEB_API_KEY%7D%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22Sepolia+Ether%22%2C%22symbol%22%3A%22ETH%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22arb-sep%22%2C%22chainId%22%3A421614%2C%22testnet%22%3Atrue%2C%22slug%22%3A%22arbitrum-sepolia%22%7D&clientId=833996b2d080980da3975eb07563f830&theme=dark&primaryColor=purple"
        width="600px"
        height="600px"
        className="w-full"
      ></iframe>
    </div>
  );
}
