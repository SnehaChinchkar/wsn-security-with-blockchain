require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ethers } = require("ethers");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

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
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "sensorRecords",
    "outputs": [
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

const contractAddress = "0xA97c403E42066Ab58662F3FeC3a3976eF393D006";
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function uploadToIPFS(data) {
  try {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const response = await axios.post(url, { pinataContent: data }, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
      },
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    return null;
  }
}

app.post("/sendData", async (req, res) => {
  try {
    const sensorData = req.body;
    const ipfsCID = "QmcH69tB4XDiq4HVcQ8GAxNafqWXLgstuGUyYaAGGyQjEL";
    if (!ipfsCID) return res.status(500).json({ error: "IPFS upload failed" });

    const tx = await contract.storeSensorData(ipfsCID, {
      gasLimit: 500000,
      gasPrice: ethers.parseUnits("15", "gwei")
    });

    await tx.wait();
    res.json({ success: true, txHash: tx.hash, ipfsCID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
