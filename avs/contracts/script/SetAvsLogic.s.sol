// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {SuperChainERC20Bridge} from "../src/SuperChainERC20Bridge.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@othentic/NetworkManagement/L2/interfaces/IAttestationCenter.sol";
import "@othentic/NetworkManagement/L2/interfaces/IAvsLogic.sol";


contract DeploySuperChainERC20BridgeScript is Script {

    SuperChainERC20Bridge public bridge;

    IAvsLogic public avsLogic;


    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        address token = 0x3A5890D3F7cDB45F4c8d08a2969AD5084Fdb7f78;

        avsLogic = IAvsLogic(0xF3129E7A264a174AF742604cE59C7b6E640F4A75);

        address attestationCenter = 0x850F28d7C0E8A1158C4e6B74674B2f52658069eF;

        IAttestationCenter(attestationCenter).setAvsLogic(avsLogic);

        vm.stopBroadcast();
    }
}
