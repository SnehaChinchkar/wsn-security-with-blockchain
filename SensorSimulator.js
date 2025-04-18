// sensorSimulator.js
const axios = require("axios");

const BACKEND_URL = "http://localhost:3000/sendData";

// Simulate sensor names
const sensors = ["Sensor-A", "Sensor-B"];

function getRandomTemperature() {
  return (20 + Math.random() * 10).toFixed(2); 
}

function getRandomHumidity() {
  return (30 + Math.random() * 20).toFixed(2); 
}

async function sendSensorData(sensorName) {
  const data = {
    temperature: getRandomTemperature(),
    humidity: getRandomHumidity(),
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await axios.post(BACKEND_URL, {
      sensorName,
      sensorData: JSON.stringify(data), // Assuming backend expects a string
    });

    console.log(`Sent data for ${sensorName}:`, data);
    console.log(`IPFS CID:`, response.data.ipfsCID);
  } catch (err) {
    console.error(`Failed to send data for ${sensorName}:`, err.message);
  }
}

// Start simulation
function startSimulation() {
  sensors.forEach((sensor) => {
    setInterval(() => {
      sendSensorData(sensor);
    }, 5000);
  });
}

startSimulation();
