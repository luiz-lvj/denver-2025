// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { IAvsLogic } from "./interfaces/IAvsLogic.sol";
import "@othentic/NetworkManagement/L2/interfaces/IAttestationCenter.sol";
import "@othentic/NetworkManagement/L2/interfaces/IAvsLogic.sol";

contract SuperChainERC20Bridge is IAvsLogic {
    uint256 public number;

    function afterTaskSubmission(
        IAttestationCenter.TaskInfo calldata _taskInfo,
        bool _isApproved,
        bytes calldata _tpSignature,
        uint256[2] calldata _taSignature,
        uint256[] calldata _attestersIds
    ) external override {
        // TODO: Implement
    }

    function beforeTaskSubmission(
        IAttestationCenter.TaskInfo calldata _taskInfo,
        bool _isApproved,
        bytes calldata _tpSignature,
        uint256[2] calldata _taSignature,
        uint256[] calldata _attestersIds
    ) external override {
        // TODO: Implement
    }
}
