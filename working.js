require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ FIX: Explicitly set Hardhat provider
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545", { chainId: 31337, name: "hardhat" });
console.log("✅ Connected to Hardhat local network");

// ✅ FIX: Use Hardhat test account (replace with actual private key from `npx hardhat node`)
const HARDHAT_PRIVATE_KEY = "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"; 

const wallet = new ethers.Wallet(HARDHAT_PRIVATE_KEY, provider);
console.log("✅ Wallet initialized");

// ✅ FIX: Ensure contract address is formatted correctly
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI= [
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
  
// ✅ FIX: Force address validation to avoid ENS lookup
const contract = new ethers.Contract(ethers.getAddress(contractAddress), contractABI, wallet);
console.log("✅ Contract connected");

// HTTP Endpoint to Send Data
app.post("/sendData", async (req, res) => {
    try {
        const sensorData = req.body;
        const ipfsCID = "QmcH69tB4XDiq4HVcQ8GAxNafqWXLgstuGUyYaAGGyQjEL"; 

        const tx = await contract.storeSensorData(ipfsCID, {
            gasLimit: 500000,
            gasPrice: ethers.parseUnits("15", "gwei")
        });

        await tx.wait();
        console.log("✅ Transaction successful:", tx.hash);
        res.json({ success: true, txHash: tx.hash, ipfsCID });
    } catch (error) {
        console.error("❌ Transaction Error:", error);
        res.status(500).json({ error: error.message });
    }
});
app.get("/getData/:sensorAddress", async (req, res) => {
    try {
        const { sensorAddress } = req.params;

        // Call the smart contract function to get stored data
        const storedData = await contract.getSensorData(sensorAddress);

        console.log("📥 Retrieved data:", storedData);
        res.json({ success: true, data: storedData });
    } catch (error) {
        console.error("❌ Error retrieving data:", error);
        res.status(500).json({ error: error.message });
    }
});
app.get("/transactionDetail/:transactionHash", async (req, res) => {
    try {
        const { transactionHash } = req.params;

        // Call the smart contract function to get stored data
        const transactionDetail = await provider.getTransaction(transactionHash);

        console.log("📥 Retrieved transaction detail:", transactionDetail);
        res.json({ success: true, data: transactionDetail });
    } catch (error) {
        console.error("❌ Error retrieving transaction detail:", error);
        res.status(500).json({ error: error.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
