require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ethers } = require("ethers");
const uploadToIPFS = require("./uploadToIPFS.js");
const axios = require("axios");
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());
const registerEdgeNode = require("./scripts/registerEdgeNode.js");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545", { chainId: 31337, name: "hardhat" });
console.log("Connected to Hardhat local network");

const HARDHAT_PRIVATE_KEY = "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"; 
const wallet = new ethers.Wallet(HARDHAT_PRIVATE_KEY, provider);
console.log("Wallet initialized");
console.log("Wallet Address:", wallet.address);

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sensor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "dataCID",
        "type": "string"
      }
    ],
    "name": "DataStored",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_sensor",
        "type": "address"
      }
    ],
    "name": "getSensorData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "dataCID",
            "type": "string"
          }
        ],
        "internalType": "struct SensorDataStorage.SensorData[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_dataCID",
        "type": "string"
      }
    ],
    "name": "storeSensorData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contract = new ethers.Contract(ethers.getAddress(contractAddress), contractABI, wallet);
console.log("Contract connected");

app.post("/sendData", async (req, res) => {
  try {
    const { sensorName, sensorData } = req.body;

    if (!sensorName || !sensorData) {
      return res.status(400).json({ error: "Sensor name and data are required" });
    }

    const ipfsCID = await uploadToIPFS(sensorName, sensorData);
    console.log("Stored on IPFS:", ipfsCID);
	const nonce = await wallet.getNonce();
    const tx = await contract.storeSensorData(ipfsCID);
    await tx.wait();
    console.log("CID stored on-chain in tx:", tx.hash);

    res.json({ success: true, ipfsCID, txHash: tx.hash });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/getData/:sensorAddress", async (req, res) => {
  try {
    const { sensorAddress } = req.params;
    const storedData = await contract.getSensorData(sensorAddress);
    const cleanedData = storedData.map((entry) => ({
      timestamp: Number(entry.timestamp),
      dataCID: entry.dataCID
    }));

    console.log("Cleaned retrieved data:", cleanedData);
    res.json({ success: true, data: cleanedData });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/transactionDetail/:transactionHash", async (req, res) => {
  try {
    const { transactionHash } = req.params;
    const transactionDetail = await provider.getTransaction(transactionHash);
    console.log("Retrieved transaction detail:", transactionDetail);
    res.json({ success: true, data: transactionDetail });
  } catch (error) {
    console.error("Error retrieving transaction detail:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/registerNode", async (req, res) => {
  try {
    const { nodeAddress } = req.body;

    if (!nodeAddress) {
      return res.status(400).json({ error: "Node address is required." });
    }

    const txHash = await registerEdgeNode(contract, nodeAddress);
    console.log("Edge node registered in tx:", txHash);

    res.json({ success: true, txHash });
  } catch (error) {
    console.error("Error registering edge node:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
