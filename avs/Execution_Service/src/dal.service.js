require('dotenv').config();
const pinataSDK = require("@pinata/sdk");
const { ethers, AbiCoder } = require('ethers');
const { SuperChainERC20BridgeAddress } = require('./constants');
const { SuperChainEERC20BridgeAbi } = require('./abis/SuperChainERC20Bridge');
const { relayERC20 } = require('./bridge.service');

var pinataApiKey='';
var pinataSecretApiKey='';
var rpcBaseAddress='';
var privateKey='';



function init() {
  pinataApiKey = process.env.PINATA_API_KEY;
  pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
  rpcBaseAddress = process.env.OTHENTIC_CLIENT_RPC_ADDRESS;
  privateKey = process.env.PRIVATE_KEY;
}


function listenToEvents(wssUrl) {
  console.log("Listening to events on:", wssUrl);
  const provider = new ethers.WebSocketProvider(wssUrl);

  const superChainERC20BriddeContract = new ethers.Contract(SuperChainERC20BridgeAddress, SuperChainEERC20BridgeAbi, provider);

  superChainERC20BriddeContract.on(superChainERC20BriddeContract.getEvent("CreateTaskSendERC20"), (
    sourceChainId,
    token,
    from,
    to,
    amount,
    destinationChainId,
    msgHash
  ) => {
    console.log("CreateTaskSendERC20 event received");
    console.log("sourceChainId:", sourceChainId);

    relayERC20(sourceChainId, token, from, to, amount, destinationChainId, msgHash);


  });

}

async function sendTask(proofOfTask, data, taskDefinitionId) {

  var wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  var performerAddress = wallet.address;

  data = ethers.hexlify(ethers.toUtf8Bytes(data));
  const message = ethers.AbiCoder.defaultAbiCoder().encode(["string", "bytes", "address", "uint16"], [proofOfTask, data, performerAddress, taskDefinitionId]);
  const messageHash = ethers.keccak256(message);
  const sig = wallet.signingKey.sign(messageHash).serialized;

  const jsonRpcBody = {
    jsonrpc: "2.0",
    method: "sendTask",
    params: [
      proofOfTask,
      data,
      taskDefinitionId,
      performerAddress,
      sig,
    ]
  };
    try {
      const provider = new ethers.JsonRpcProvider(rpcBaseAddress);
      const response = await provider.send(jsonRpcBody.method, jsonRpcBody.params);
      console.log("API response:", response);
  } catch (error) {
      console.error("Error making API request:", error);
  }
}

async function publishJSONToIpfs(data) {
  var proofOfTask = '';
  try {   
    const pinata = new pinataSDK(pinataApiKey, pinataSecretApiKey);
    const response = await pinata.pinJSONToIPFS(data);
    proofOfTask = response.IpfsHash;
    console.log(`proofOfTask: ${proofOfTask}`);
  }
  catch (error) {  
    console.error("Error making API request to pinataSDK:", error);
  }
  return proofOfTask;
}

module.exports = {
  init,
  publishJSONToIpfs,
  sendTask,
  listenToEvents
}
