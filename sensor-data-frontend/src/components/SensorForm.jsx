// src/components/SensorForm.jsx
import { useState } from "react";
import { sendSensorData } from "../api";

function SensorForm() {
  const [sensorName, setSensorName] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      temperature,
      humidity,
      timestamp: new Date().toISOString(), // Auto-generated on upload
    };

    try {
      const res = await sendSensorData(sensorName, JSON.stringify(data));
      setResponse(res.data);
    } catch (err) {
      setResponse({ error: err.message });
    }
  };

  return (
    <div>
      <h2>📤 Upload Sensor Data</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
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
          value={temperature}transaction aria-details=", sensor"
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

export default SensorForm;
