// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@othentic/NetworkManagement/L2/interfaces/IAttestationCenter.sol";
import "@othentic/NetworkManagement/L2/interfaces/IAvsLogic.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { ISuperChainTokenBridge } from "./interfaces/ISuperChainTokenBridge.sol";

contract SuperChainERC20Bridge is IAvsLogic {
    address internal constant SUPERCHAIN_TOKEN_BRIDGE = 0x7cFbD302f1F8e02347862641973792CBD60c453F;

    event CreateTaskSendERC20(uint256 indexed sourceChainId, address indexed token, address from, address to, uint256 amount, uint256 destinationChainId, bytes32 msgHash);

    function bridgeERC20AndCreateTask(
        address _token,
        uint256 _amount,
        uint256 _chainId
    ) external {

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        
        require(_chainId != block.chainid, "Invalid chainId");
        bytes32 msgHash = ISuperChainTokenBridge(SUPERCHAIN_TOKEN_BRIDGE).sendERC20(_token, msg.sender, _amount, _chainId);

        emit CreateTaskSendERC20(block.chainid, _token, msg.sender,msg.sender, _amount, _chainId, msgHash);
    }



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
