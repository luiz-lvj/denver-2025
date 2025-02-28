"use strict";
require('dotenv').config();
const { ethers } = require('ethers');
const axios = require("axios");
const { chains, AttestationServiceAddress } = require('./constants');
const { SuperChainTokenBridgeAbi } = require('./abis/SuperChainTokenBridge');
const { AttestationServiceAbi } = require('./abis/AttestationService');

const bls = require('@noble/bls12-381');
const crypto = require('crypto');


async function getTpAndTaSignatures(message) {
  // Create two different private keys from the main private key
  const mainPrivateKey = process.env.PRIVATE_KEY;
  const s1 = ethers.keccak256(ethers.toUtf8Bytes(mainPrivateKey + "TP"));
  const s2 = ethers.keccak256(ethers.toUtf8Bytes(mainPrivateKey + "TA"));

  // Create wallets for signing
  const wallet1 = new ethers.Wallet(s1);
  const wallet2 = new ethers.Wallet(s2);

  // Sign the message with both keys
  const tpSignature = await wallet1.signMessage(ethers.getBytes(message));
  const taSignature = await wallet2.signMessage(ethers.getBytes(message));

  // Convert taSignature to [uint256, uint256] format
  const [taSig0, taSig1] = splitECDSASignature(taSignature);

  return {
    tpSignature: tpSignature,
    taSignature: [taSig0, taSig1],
  };
}

/**
 * Splits an ECDSA signature into two 256-bit words
 */
function splitECDSASignature(signature) {
  // Remove '0x' and split into r, s components (ignore v)
  const sig = signature.slice(2);
  const r = sig.slice(0, 64);
  const s = sig.slice(64, 128);

  // Convert to decimal strings
  const rVal = BigInt('0x' + r).toString();
  const sVal = BigInt('0x' + s).toString();

  return [rVal, sVal];
}


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
        taskPerformer: wallet.address,
        taskDefinitionId: 1
      }

      const message = ethers.AbiCoder.defaultAbiCoder().encode(["string", "bytes", "address", "uint16"], [taskInfo.proofOfTask, taskInfo.data, taskInfo.taskPerformer, taskInfo.taskDefinitionId]);
      const messageHash = ethers.keccak256(message);


      //const { tpSignature, taSignature } = await getTpAndTaSignatures(message);

      const tpSignature =  wallet.signingKey.sign(messageHash);

      const taSignature = [tpSignature.r, tpSignature.s];

      const tpSig = ethers.AbiCoder.defaultAbiCoder().encode(["string"], ["tpSignature"]);



      console.log("tpSignature:", tpSignature);
      console.log("taSignature:", taSignature);



      const taskSubmissionDetails = {
        isApproved: true,
        tpSignature: tpSig,
        taSignature: [1, 2],
        attestersIds: [1]
      }

      //await sendTask(taskInfo.proofOfTask, taskInfo.data, taskInfo.taskDefinitionId);

      

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