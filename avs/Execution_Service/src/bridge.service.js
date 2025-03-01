"use strict";
require('dotenv').config();
const { ethers } = require('ethers');
const axios = require("axios");
const { chains, AttestationServiceAddress } = require('./constants');
const { SuperChainTokenBridgeAbi } = require('./abis/SuperChainTokenBridge');
const { AttestationServiceAbi } = require('./abis/AttestationService');

const bls = require('@noble/bls12-381');
const crypto = require('crypto');



const  { bn254 } = require('@noble/curves/bn254');

const { bls12_381 } = require('@noble/curves/bls12-381');

const bls_bn254 = require('@kevincharm/bls-bn254');


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

      //await tx.wait();

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

      const tpSignature =  await wallet.signMessage(ethers.getBytes(messageHash));

      console.log("private key:", process.env.PRIVATE_KEY);

      const signatureBytes = await bls.sign(
        ethers.getBytes(messageHash), 
        String(process.env.PRIVATE_KEY).replace("0x", "")
      );

      console.log("messageHash:", messageHash);

      // const sig = bls12_381.sign(String(messageHash).replace("0x", ""), String(process.env.PRIVATE_KEY).replace("0x", ""));

      // const sig2 = bls12_381.ShortSignature.fromHex(ethers.hexlify(sig).replace("0x", "").slice(0,48));

      // console.log("sig2:", sig2);

      // const x = sig2.x.c0;
      // const y = sig2.y.c0;

      // console.log("x:", x);
      // console.log("y:", y);

      const bn254_instance = await bls_bn254.BlsBn254.create();

      const g1 = bn254.G1.hashToCurve(ethers.hexlify(messageHash));

      const sig3 = bn254_instance.sign(g1, process.env.PRIVATE_KEY)

      console.log("sig3:", sig3);

      //const a = bn254.Signature.fromHex(String(messageHash).replace("0x", ""));




      
      //const taSignature = splitSignatureToUint256(signatureBytes);

      const taskSubmissionDetails = {
        isApproved: true,
        tpSignature: tpSignature,
        taSignature: [x, y],
        attestersIds: [1]
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