import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com")

const balanceOfABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
]

// DAI token contract
const tokenContract = "0x779877A7B0D9E8603169DdbD7836e478b4624789"
// A DAI token holder
const tokenHolder = "0x035475D1b044F15A742c32468872523622DF7eb2"
const contract = new ethers.Contract(tokenContract, balanceOfABI, provider)

async function getTokenBalance() {
  const result = await contract.balanceOf(tokenHolder)
  const formattedResult = ethers.formatUnits(result, 18)
  console.log(formattedResult)
}

getTokenBalance()