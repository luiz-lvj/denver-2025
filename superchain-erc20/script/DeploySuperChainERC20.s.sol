// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {SuperChainERC20} from "../src/SuperChainERC20.sol";


contract DeployScript is Script {
    SuperChainERC20 public superChainERC20;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        address owner = 0x9a56fFd72F4B526c523C733F1F74197A51c495E1;

        superChainERC20 = new SuperChainERC20("USDC", "USDC", owner);

        vm.stopBroadcast();
    }
}
