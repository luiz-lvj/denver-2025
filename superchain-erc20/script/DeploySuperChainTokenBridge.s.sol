// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import {SuperchainTokenBridgeMock} from "../src/mock/SuperchainTokenBridge.sol";

contract DeployScript is Script {
    SuperchainTokenBridgeMock public superchainTokenBridgeMock;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();


        address bridge = Create2.deploy(
            0,
            "",
            abi.encodePacked(type(SuperchainTokenBridgeMock).creationCode)
        );

        console.log("Chain ID:", block.chainid);
        console.log("Bridge deployed to:", bridge);

        vm.stopBroadcast();
    }
}
