// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SensorDataStorage {
    struct SensorData {
        uint256 timestamp;
        string dataCID; 
    }

    mapping(address => SensorData[]) private sensorRecords;

    event DataStored(address indexed sensor, uint256 timestamp, string dataCID);

    function storeSensorData(string memory _dataCID) public {
        sensorRecords[msg.sender].push(SensorData(block.timestamp, _dataCID));
        emit DataStored(msg.sender, block.timestamp, _dataCID);
    }

    function getSensorData(address _sensor) public view returns (SensorData[] memory) {
        return sensorRecords[_sensor];
    }
}
