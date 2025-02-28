// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {SuperChainERC20Bridge} from "../src/SuperChainERC20Bridge.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@othentic/NetworkManagement/L2/interfaces/IAttestationCenter.sol";
import "@othentic/NetworkManagement/L2/interfaces/IAvsLogic.sol";
import "@othentic/NetworkManagement/L2/TaskDefinitionLibrary.sol";


contract CreateTaskDefinitionScript is Script {

    SuperChainERC20Bridge public bridge;

    IAvsLogic public avsLogic;


    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        address attestationCenter = 0x850F28d7C0E8A1158C4e6B74674B2f52658069eF;

        TaskDefinitionParams memory taskDefinitionParams = TaskDefinitionParams({
            blockExpiry: type(uint256).max,
            baseRewardFeeForAttesters: 0.00001 ether,
            baseRewardFeeForPerformer: 0.00001 ether,
            baseRewardFeeForAggregator: 0.00001 ether,
            disputePeriodBlocks: 0,
            minimumVotingPower: 0,
            restrictedOperatorIndexes: new uint256[](0)
        });

        string memory name = "SuperChainERC20 - Bridge";

        uint16 taskDefinitionId = IAttestationCenter(attestationCenter).createNewTaskDefinition(name, taskDefinitionParams);

        console.log("Task definition created with id: %s", taskDefinitionId);

        vm.stopBroadcast();
    }
}
