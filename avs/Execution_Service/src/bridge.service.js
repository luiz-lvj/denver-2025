
"use strict";
require('dotenv').config();
const { ethers } = require('ethers');
const axios = require("axios");
const { chains, AttestationServiceAddress } = require('./constants');
const { SuperChainTokenBridgeAbi } = require('./abis/SuperChainTokenBridge');
const { AttestationServiceAbi } = require('./abis/AttestationService');


async function relayERC20(
  sourceChainId,
  token,
  from,
  to,
  amount,
  destinationChainId,
  msgHash
  ) {

    console.log("Relaying ERC20 from:", sourceChainId, "to:", destinationChainId);
    try { 

      const provider = new ethers.JsonRpcProvider(chains[destinationChainId].rpcUrl);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const tokenBridgeContract = new ethers.Contract(chains[destinationChainId].tokenBridgeAddress, SuperChainTokenBridgeAbi, wallet);

      const tx = await tokenBridgeContract.relayERC20(token, from, to, amount);

      await tx.wait();

      console.log("Token Relayed");

      const txHash = tx.hash;

      const attestationServiceContract = new ethers.Contract(AttestationServiceAddress, AttestationServiceAbi, wallet);

      console.log("Attestation Service Contract");

      const taskInfo = {
        proofOfTask: txHash,
        data: ethers.hexlify(ethers.toUtf8Bytes("hello")),
        taskPerformer: from,
        taskDefinitionId: 1
      }

      const message = ethers.AbiCoder.defaultAbiCoder().encode(["string", "bytes", "address", "uint16"], [taskInfo.proofOfTask, taskInfo.data, taskInfo.taskPerformer, taskInfo.taskDefinitionId]);
      const messageHash = ethers.keccak256(message);
      const taskSubmissionDetails = {
        isApproved: true,
        tpSignature: wallet.signingKey.sign(messageHash).serialized,
        taSignature: [0, 0],
        attestersIds: [0]
      }

      await submitTask(taskInfo, taskSubmissionDetails);

      return txHash;

    } catch (err) {
      console.log("Error relaying ERC20:", err);
    }
}


async function submitTask(taskInfo, taskSubmissionDetails) {

  try{
    const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const attestationServiceContract = new ethers.Contract(AttestationServiceAddress, AttestationServiceAbi, wallet);

    const txSubmitTask = await attestationServiceContract.submitTask(taskInfo, taskSubmissionDetails, {gasLimit: 10000000});

    console.log("Task Submitted");

    console.log("txSubmitTask:", txSubmitTask.hash);

  } catch(err) {
    console.log("Error submitting task:", err);
  }

}






async function getPrice(pair) {
  var res = null;
    try {
        const result = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);
        res = result.data;

    } catch (err) {
      result = await axios.get(`https://api.binance.us/api/v3/ticker/price?symbol=${pair}`);
      res = result.data;
    }
    return res;
  }
  
  module.exports = {
    getPrice,
    relayERC20
  }