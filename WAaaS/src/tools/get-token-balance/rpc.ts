export const rpcEndpoints: {
  [chain: string]: {
    [network: string]: string;
  };
} = {
  ethereum: {
    mainnet: "https://eth.llamarpc.com",
    testnet: "https://ethereum-sepolia-rpc.publicnode.com",
  },
  base: {
    mainnet: "https://mainnet.base.org",
    testnet: "https://sepolia.base.org",
  },
  mode: {
    mainnet: "https://mainnet.mode.network",
    testnet: "https://sepolia.mode.network",
  },
};
