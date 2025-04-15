import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const sendSensorData = (sensorName, sensorData) =>
  axios.post(`${API_BASE_URL}/sendData`, { sensorName, sensorData });

export const getSensorData = (sensorAddress) =>
  axios.get(`${API_BASE_URL}/getData/${sensorAddress}`);

export const getTransactionDetail = (transactionHash) =>
  axios.get(`${API_BASE_URL}/transactionDetail/${transactionHash}`);
