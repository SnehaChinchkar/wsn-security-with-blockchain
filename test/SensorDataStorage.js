const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SensorDataStorage", function () {
    let sensorDataStorage, owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        const SensorDataStorage = await ethers.getContractFactory("SensorDataStorage");
        sensorDataStorage = await SensorDataStorage.deploy();
        await sensorDataStorage.deployed();
    });

    it("should store and retrieve sensor data", async function () {
        const dataCID = "QmcH69tB4XDiq4HVcQ8GAxNafqWXLgstuGUyYaAGGyQjEL";

        await sensorDataStorage.storeSensorData(dataCID);
        const records = await sensorDataStorage.getSensorData(owner.address);

        expect(records.length).to.equal(1);
        expect(records[0].dataCID).to.equal(dataCID);
    });
});
