// src/components/SensorDataViewer.jsx
import { useState } from "react";
import { getSensorData, getTransactionDetail } from "../api";

function SensorDataViewer() {
  const [sensorAddress, setSensorAddress] = useState("");
//   const [sensorData, setSensorData] = useState(null);
const [sensorData, setSensorData] = useState([]);

  const [txHash, setTxHash] = useState("");
  const [txData, setTxData] = useState(null);
  const [ipfsPreview, setIpfsPreview] = useState({});

  const handleSensorFetch = async () => {
    try {
      const res = await getSensorData(sensorAddress);
      console.log("Sensor data:", res.data.data);
      setSensorData(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching sensor data:", err);
    }
  };

  const handleTxFetch = async () => {
    try {
      const res = await getTransactionDetail(txHash);
      setTxData(res.data);
    } catch (err) {
      console.error("❌ Error fetching transaction detail:", err);
    }
  };

//   const handleIPFSPreview = async (cid, index) => {
//     setIpfsPreview((prev) => ({ ...prev, [index]: "Loading..." }));

//     try {
//       const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
//       const contentType = response.headers.get("Content-Type");

//       let content;
//       if (contentType.includes("application/json")) {
//         const json = await response.json();
//         content = JSON.stringify(json, null, 2);
//       } else {
//         content = await response.text();
//       }

//       setIpfsPreview((prev) => ({ ...prev, [index]: content }));
//     } catch (err) {
//       setIpfsPreview((prev) => ({ ...prev, [index]: `❌ Error: ${err.message}` }));
//     }
//   };
const handleIPFSPreview = async (cid, index) => {
    setIpfsPreview((prev) => ({ ...prev, [index]: "Loading..." }));
  
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
      const contentType = response.headers.get("Content-Type");
  
      let content;
  
      if (contentType.includes("application/json")) {
        const json = await response.json();
        content = json;
      } else {
        const text = await response.text();
  
        try {
          // Try to parse in case it's JSON inside a string
          const parsed = JSON.parse(text);
          content = parsed;
        } catch {
          content = { raw: text }; // fallback
        }
      }
  
      setIpfsPreview((prev) => ({ ...prev, [index]: content }));
    } catch (err) {
      setIpfsPreview((prev) => ({
        ...prev,
        [index]: { error: `❌ Error: ${err.message}` },
      }));
    }
  };
  
  return (
    <div>
      <h2>📥 View Sensor Data</h2>
      <input
        type="text"
        placeholder="Sensor Address"
        value={sensorAddress}
        onChange={(e) => setSensorAddress(e.target.value)}
      />
      <button onClick={handleSensorFetch}>Get Sensor Data</button>

      {sensorData && sensorData.length > 0 && (
        <table style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>CID</th>
              <th>IPFS</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.timestamp * 1000).toLocaleString()}</td>
                <td>{entry.dataCID}</td>
                <td>
                  <a
                    href={`https://ipfs.io/ipfs/${entry.dataCID}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                </td>
                <td>
                  <button onClick={() => handleIPFSPreview(entry.dataCID, index)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Show IPFS previews */}
      {sensorData &&
        sensorData.map((entry, index) => (
          ipfsPreview[index] && (
            <div key={`preview-${index}`} style={{ marginTop: "10px" }}>
              <strong>Preview for CID {entry.dataCID}:</strong>
              <pre style={{ background: "#f9f9f9", padding: "10px", whiteSpace: "pre-wrap" }}>
                {ipfsPreview[index]}
              </pre>
            </div>
          )
        ))}

      <hr style={{ margin: "40px 0" }} />

      <h2>🔍 Transaction Detail</h2>
      <input
        type="text"
        placeholder="Transaction Hash"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
      />
      <button onClick={handleTxFetch}>Get Transaction</button>
      {txData && (
        <pre style={{ marginTop: "10px", background: "#f0f0f0", padding: "10px" }}>
          {JSON.stringify(txData, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default SensorDataViewer;
