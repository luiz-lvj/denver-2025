// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Bridgeable} from "@openzeppelin/community-contracts/contracts/token/ERC20/extensions/ERC20Bridgeable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract SuperChainERC20 is ERC20, ERC20Bridgeable, ERC20Permit {
    address internal constant SUPERCHAIN_TOKEN_BRIDGE = 0x7cFbD302f1F8e02347862641973792CBD60c453F;
    error Unauthorized();

    constructor(string memory name, string memory symbol, address recipient)
        ERC20(name, symbol)
        ERC20Permit(name)
    {
        if (block.chainid == 84532) { // Base Sepolia as the first Superchain (default)
            _mint(recipient, 100000000 * 10 ** decimals());
        }
    }

    /**
     * @dev Checks if the caller is the predeployed SuperchainTokenBridge. Reverts otherwise.
     *
     * IMPORTANT: The predeployed SuperchainTokenBridge is only available on chains in the Superchain.
     */
    function _checkTokenBridge(address caller) internal pure override {
        if (caller != SUPERCHAIN_TOKEN_BRIDGE) revert Unauthorized();
    }


    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}