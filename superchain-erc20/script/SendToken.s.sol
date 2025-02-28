// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {SuperchainTokenBridgeMock} from "../src/mock/SuperchainTokenBridge.sol";
import {SuperChainERC20} from "../src/SuperChainERC20.sol";

contract DeployScript is Script {
    SuperchainTokenBridgeMock public superchainTokenBridgeMock;
    SuperChainERC20 public superChainERC20;
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        superchainTokenBridgeMock = SuperchainTokenBridgeMock(0x7cFbD302f1F8e02347862641973792CBD60c453F);

        superChainERC20 = SuperChainERC20(0x3A5890D3F7cDB45F4c8d08a2969AD5084Fdb7f78);

        address recipient = 0x9a56fFd72F4B526c523C733F1F74197A51c495E1;

        uint256 targetChainId = 919; // Mode Testnet

        superchainTokenBridgeMock.sendERC20(address(superChainERC20), recipient, 0.1 ether, targetChainId);


        vm.stopBroadcast();
    }
}
