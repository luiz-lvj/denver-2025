// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Interfaces
import { IERC7802 } from "@openzeppelin/community-contracts/contracts/interfaces/IERC7802.sol";


contract SuperchainTokenBridgeMock {

    error ZeroAddress();
    error Unauthorized();


    /// @notice Emitted when tokens are sent from one chain to another.
    /// @param token         Address of the token sent.
    /// @param from          Address of the sender.
    /// @param to            Address of the recipient.
    /// @param amount        Number of tokens sent.
    /// @param destination   Chain ID of the destination chain.
    event SendERC20(
        address indexed token, address indexed from, address indexed to, uint256 amount, uint256 destination
    );

    /// @notice Emitted whenever tokens are successfully relayed on this chain.
    /// @param token         Address of the token relayed.
    /// @param from          Address of the msg.sender of sendERC20 on the source chain.
    /// @param to            Address of the recipient.
    /// @param amount        Amount of tokens relayed.
    event RelayERC20(address indexed token, address indexed from, address indexed to, uint256 amount);



    /// @notice Sends tokens to a target address on another chain.
    /// @dev Tokens are burned on the source chain.
    /// @param _token    Token to send.
    /// @param _to       Address to send tokens to.
    /// @param _amount   Amount of tokens to send.
    /// @param _chainId  Chain ID of the destination chain.
    /// @return msgHash_ Hash of the message sent.
    function sendERC20(
        address _token,
        address _to,
        uint256 _amount,
        uint256 _chainId
    )
        external
        returns (bytes32 msgHash_)
    {
        if (_to == address(0)) revert ZeroAddress();

        IERC7802(_token).crosschainBurn(msg.sender, _amount);

        bytes memory message = abi.encodeCall(this.relayERC20, (_token, msg.sender, _to, _amount));
        //msgHash_ = IL2ToL2CrossDomainMessenger(MESSENGER).sendMessage(_chainId, address(this), message);

        msgHash_ = keccak256(message);

        emit SendERC20(_token, msg.sender, _to, _amount, _chainId);
    }

    /// @notice Relays tokens received from another chain.
    /// @dev Tokens are minted on the destination chain.
    /// @param _token   Token to relay.
    /// @param _from    Address of the msg.sender of sendERC20 on the source chain.
    /// @param _to      Address to relay tokens to.
    /// @param _amount  Amount of tokens to relay.
    function relayERC20(address _token, address _from, address _to, uint256 _amount) external {

        IERC7802(_token).crosschainMint(_to, _amount);

        emit RelayERC20(_token, _from, _to, _amount);
    }
}