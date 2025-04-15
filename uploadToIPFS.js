require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_KEY;

async function uploadToIPFS(sensorName, sensorData) {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const data = {
        pinataContent: sensorData,
        pinataMetadata: {
            name: sensorName,
            keyvalues: {
                type: "sensor-data", 
                uploadedBy: "Node.js App"
            }
        }
    };

    const response = await axios.post(url, data, {
        headers: {
            "Content-Type": "application/json",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
        },
    });

    return response.data.IpfsHash;
}

// const sensorData = { temperature: 22.5, humidity: 55 };
// uploadToIPFS(sensorData).then(cid => console.log("Uploaded to IPFS:", cid));
module.exports = uploadToIPFS;