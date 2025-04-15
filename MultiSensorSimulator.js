const { ethers } = require("ethers");
const axios = require("axios");

//Ethereum wallets
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const privateKeys = [
  "0x59c6995e998f97a5a0044966f0945382d3e79b7e8e1f7b5f3962e69c1f9bdca1", // From Hardhat
  "0x8b3a350cf5c34c9194ca3a545d1f62f6e9f7a8dfd3f5c7d22dbdd3d1fa3e5611", 
];
const wallets = privateKeys.map((key) => new ethers.Wallet(key, provider));

const BACKEND_URL = "http://localhost:3000/sendData";

function getRandomTemp() {
  return (20 + Math.random() * 10).toFixed(2);
}
function getRandomHumidity() {
  return (30 + Math.random() * 20).toFixed(2);
}

async function sendData(wallet) {
  const data = {
    temperature: getRandomTemp(),
    humidity: getRandomHumidity(),
    timestamp: new Date().toISOString(),
  };

  const sensorName = wallet.address;

  try {
    const res = await axios.post(BACKEND_URL, {
      sensorName,
      sensorData: JSON.stringify(data),
    });

    console.log(`Data sent from ${sensorName}`);
    console.log(`IPFS CID: ${res.data.ipfsCID}`);
  } catch (err) {
    console.error(`Error sending data from ${sensorName}:`, err.message);
  }
}

function startSimulation() {
  wallets.forEach((wallet) => {
    setInterval(() => sendData(wallet), 5000);
  });
}

startSimulation();
