const hre = require("hardhat");

async function main() {
  const SensorDataStorage = await hre.ethers.getContractFactory("SensorDataStorage");
  const sensorDataStorage = await SensorDataStorage.deploy();

  await sensorDataStorage.waitForDeployment();
  console.log("Contract deployed at:", await sensorDataStorage.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
