// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {SuperChainERC20Bridge} from "../src/SuperChainERC20Bridge.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract DeploySuperChainERC20BridgeScript is Script {

    SuperChainERC20Bridge public bridge;


    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        address token = 0x3A5890D3F7cDB45F4c8d08a2969AD5084Fdb7f78;

        uint256 targetChainId = 11155420; // OP Sepolia

        bridge = new SuperChainERC20Bridge();

        IERC20(token).approve(address(bridge), 0.01 ether);

        console.log("Bridge deployed at", address(bridge));

        bridge.bridgeERC20AndCreateTask(token, 0.01 ether, targetChainId);



        vm.stopBroadcast();
    }
}
