source ../.env

forge script DeploySuperChainTokenBridge.s.sol:DeployScript --rpc-url $BASE_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast -vvvv

forge script DeploySuperChainTokenBridge.s.sol:DeployScript --rpc-url $OP_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast -vvvv

forge script DeploySuperChainTokenBridge.s.sol:DeployScript --rpc-url $UNI_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast -vvvv


forge script DeploySuperChainTokenBridge.s.sol:DeployScript --rpc-url $MODE_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast -vvvv
