// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface ISuperChainTokenBridge {
    function sendERC20(
        address _token,
        address _to,
        uint256 _amount,
        uint256 _chainId
    ) external returns (bytes32 msgHash_);
}