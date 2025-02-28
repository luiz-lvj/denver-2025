// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {SuperChainERC20} from "../src/SuperChainERC20.sol";
import "@openzeppelin/contracts/utils/Create2.sol";


contract DeployScript is Script {
    SuperChainERC20 public superChainERC20;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        address owner = 0x9a56fFd72F4B526c523C733F1F74197A51c495E1;

        address token = Create2.deploy(
            0,
            "",
            abi.encodePacked(type(SuperChainERC20).creationCode, abi.encode("USDC", "USDC", owner))
        );

        console.log("Chain ID:", block.chainid);
        console.log("Token deployed to:", token);

        vm.stopBroadcast();
    }
}
