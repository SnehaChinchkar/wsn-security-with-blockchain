const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();


const contractJson = require("../artifacts/contracts/SensorDataStorage.sol/SensorDataStorage.json");
const abi = contractJson.abi;

const CONTRACT_ADDRESS = "0xYourDeployedContractAddressHere";

async function registerEdgeNode(dataCID) {
  try {
    //Ethereum provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    console.log("Sending storeSensorData transaction...");
    const tx = await contract.storeSensorData(dataCID);

    console.log("Waiting for transaction to be mined...");
    const receipt = await tx.wait();

    console.log("Data stored successfully!");
    console.log("Transaction Hash:", receipt.transactionHash);
  } catch (err) {
    console.error("Error storing data:", err);
  }
}

// Example: Store a test CID
const cid = "QmYourExampleCID"; // Replace with your actual IPFS hash
registerEdgeNode(cid);
