

export const SuperChainEERC20BridgeAbi = [
    "event CreateTaskSendERC20(uint256 indexed sourceChainId, address indexed token, address from, address to, uint256 amount, uint256 destinationChainId, bytes32 msgHash)",
    "function bridgeERC20AndCreateTask(address _token, uint256 _amount, uint256 _chainId) external",
]