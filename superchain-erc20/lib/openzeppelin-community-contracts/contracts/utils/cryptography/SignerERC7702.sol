// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {AbstractSigner} from "./AbstractSigner.sol";

/**
 * @dev Implementation of {AbstractSigner} for implementation for an EOA. Useful for ERC-7702 accounts.
 */
abstract contract SignerERC7702 is AbstractSigner {
    /**
     * @dev Validates the signature using the EOA's address (ie. `address(this)`).
     */
    function _rawSignatureValidation(
        bytes32 hash,
        bytes calldata signature
    ) internal view virtual override returns (bool) {
        (address recovered, ECDSA.RecoverError err, ) = ECDSA.tryRecover(hash, signature);
        return address(this) == recovered && err == ECDSA.RecoverError.NoError;
    }
}
