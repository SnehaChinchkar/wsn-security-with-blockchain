// src/components/SensorFormWithMetaMask.jsx
import React, { useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../../../artifacts/contracts/SensorDataStorage.sol/SensorDataStorage.json";
const contractAddress = "0xA97c403E42066Ab58662F3FeC3a3976eF393D006";

export default function SensorFormWithMetaMask() {
  const [sensorName, setSensorName] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
      alert("MetaMask is not installed");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Instantiate the contract with the signer from MetaMask
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      // Create your sensor data payload (here you may want to upload to IPFS first)
      const data = {
        temperature,
        humidity,
        timestamp: new Date().toISOString(), // Example data
      };

      // Upload to IPFS (assume you have a function for this)
      // For simplicity, we use a static CID here or integrate IPFS upload logic.
      const ipfsCID = "QmcH69tB4XDiq4HVcQ8GAxNafqWXLgstuGUyYaAGGyQjEL";
      
      // Send the transaction using MetaMask, replacing your server-based signing
      const tx = await contract.storeSensorData(ipfsCID, {
        gasLimit: 500000,
        // gasPrice can be set automatically or manually if needed
      });

      // Wait for confirmation
      await tx.wait();
      setResponse({ success: true, txHash: tx.hash, ipfsCID });
    } catch (error) {
      setResponse({ error: error.message });
    }
  };

  return (
    <div>
      <h2>📤 Upload Sensor Data with MetaMask</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input
          type="text"
          placeholder="Sensor Name"
          value={sensorName}
          onChange={(e) => setSensorName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Temperature (e.g. 26.03)"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          step={0.01}
          required
        />
        <input
          type="number"
          placeholder="Humidity (e.g. 36.71)"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
          min={0}
          step={0.01}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {response && (
        <div style={{ marginTop: "20px" }}>
          <strong>Response:</strong>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
