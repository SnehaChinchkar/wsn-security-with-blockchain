import React, { useState } from "react";
import { ethers } from "ethers";
import { BrowserProvider, Contract } from "ethers";
import contractArtifact from "../../../artifacts/contracts/SensorDataStorage.sol/SensorDataStorage.json";
const contractABI = contractArtifact.abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function MetaMaskConnect() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setCurrentAccount(userAddress);

        
        const contractInstance = new Contract(
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
