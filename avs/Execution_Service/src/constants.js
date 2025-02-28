
"use strict";
require("dotenv").config();

const SuperChainERC20BridgeAddress = "0xF3129E7A264a174AF742604cE59C7b6E640F4A75";
const AttestationServiceAddress = "0x850F28d7C0E8A1158C4e6B74674B2f52658069eF";

const chains = {
    11155420: {
        name: "OP Sepolia",
        rpcUrl: process.env.OP_SEPOLIA_RPC_URL,
        tokenBridgeAddress: "0x7cFbD302f1F8e02347862641973792CBD60c453F"
    }
}

module.exports = {
    chains,
    SuperChainERC20BridgeAddress,
    AttestationServiceAddress
}