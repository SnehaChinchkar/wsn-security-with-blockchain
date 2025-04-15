// src/components/MetaMaskConnect.jsx
import React, { useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../contractConfig"; // Assume you export contractABI and contractAddress somewhere
const contractAddress = "0xA97c403E42066Ab58662F3FeC3a3976eF393D006";

export default function MetaMaskConnect() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        setCurrentAccount(userAddress);

        // Instantiate the contract with the user's signer so transaction can be signed by MetaMask
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contractInstance);
        console.log("Connected to MetaMask with account:", userAddress);
      } catch (error) {
        console.error("Failed to connect MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>
        {currentAccount ? "Connected" : "Connect MetaMask"}
      </button>
      {currentAccount && <p>Account: {currentAccount}</p>}
    </div>
  );
}
