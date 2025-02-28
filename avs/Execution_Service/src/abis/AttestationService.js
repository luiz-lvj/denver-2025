export const AttestationServiceAbi = [
    {
        "inputs": [],
        "type": "error",
        "name": "AccessControlBadConfirmation"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "neededRole",
                "type": "bytes32"
            }
        ],
        "type": "error",
        "name": "AccessControlUnauthorizedAccount"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InactiveAggregator"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InactiveTaskPerformer"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InvalidArrayLength"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InvalidAttesterSet"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InvalidBlsKeyUpdateSignature"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InvalidOperatorId"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InvalidOperatorsForPayment"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InvalidPaymentClaim"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InvalidPerformerSignature"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InvalidRangeForBatchPaymentRequest"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "taskDefinitionId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "operatorIndex",
                "type": "uint256"
            }
        ],
        "type": "error",
        "name": "InvalidRestrictedOperator"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InvalidRestrictedOperatorIndexes"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "InvalidTaskDefinition"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "MessageAlreadySigned"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_operatorAddress",
                "type": "address"
            }
        ],
        "type": "error",
        "name": "OperatorNotRegistered"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "PaymentClaimed"
    },
    {
        "inputs": [],
        "type": "error",
        "name": "PaymentReedemed"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "taskDefinitionId",
                "type": "uint16"
            }
        ],
        "type": "error",
        "name": "TaskDefinitionNotFound"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address",
                "indexed": false
            },
            {
                "internalType": "uint256",
                "name": "requestedTaskNumber",
                "type": "uint256",
                "indexed": false
            },
            {
                "internalType": "uint256",
                "name": "requestedAmountClaimed",
                "type": "uint256",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "ClearPaymentRejected",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "uint256[4]",
                "name": "blsKey",
                "type": "uint256[4]",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "OperatorBlsKeyUpdated",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address",
                "indexed": false
            },
            {
                "internalType": "uint256",
                "name": "votingPower",
                "type": "uint256",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "OperatorRegisteredToNetwork",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "operatorId",
                "type": "uint256",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "OperatorUnregisteredFromNetwork",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address",
                "indexed": false
            },
            {
                "internalType": "uint256",
                "name": "lastPaidTaskNumber",
                "type": "uint256",
                "indexed": false
            },
            {
                "internalType": "uint256",
                "name": "feeToClaim",
                "type": "uint256",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "PaymentRequested",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "struct IAttestationCenter.PaymentRequestMessage[]",
                "name": "operators",
                "type": "tuple[]",
                "components": [
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "feeToClaim",
                        "type": "uint256"
                    }
                ],
                "indexed": false
            },
            {
                "internalType": "uint256",
                "name": "lastPaidTaskNumber",
                "type": "uint256",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "PaymentsRequested",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_operatorId",
                "type": "uint256",
                "indexed": true
            },
            {
                "internalType": "uint256",
                "name": "_baseRewardFeeForOperator",
                "type": "uint256",
                "indexed": false
            },
            {
                "internalType": "uint32",
                "name": "_taskNumber",
                "type": "uint32",
                "indexed": true
            }
        ],
        "type": "event",
        "name": "RewardAccumulated",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32",
                "indexed": true
            },
            {
                "internalType": "bytes32",
                "name": "previousAdminRole",
                "type": "bytes32",
                "indexed": true
            },
            {
                "internalType": "bytes32",
                "name": "newAdminRole",
                "type": "bytes32",
                "indexed": true
            }
        ],
        "type": "event",
        "name": "RoleAdminChanged",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32",
                "indexed": true
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "address",
                "name": "sender",
                "type": "address",
                "indexed": true
            }
        ],
        "type": "event",
        "name": "RoleGranted",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32",
                "indexed": true
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address",
                "indexed": true
            },
            {
                "internalType": "address",
                "name": "sender",
                "type": "address",
                "indexed": true
            }
        ],
        "type": "event",
        "name": "RoleRevoked",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newAvsGovernanceMultisig",
                "type": "address",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "SetAvsGovernanceMultisig",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "avsLogic",
                "type": "address",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "SetAvsLogic",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "paymentsLogic",
                "type": "address",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "SetBeforePaymentsLogic",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "feeCalculator",
                "type": "address",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "SetFeeCalculator",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newMessageHandler",
                "type": "address",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "SetMessageHandler",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "minimumVotingPower",
                "type": "uint256",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "SetMinimumTaskDefinitionVotingPower",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "taskDefinitionId",
                "type": "uint16",
                "indexed": false
            },
            {
                "internalType": "uint256[]",
                "name": "restrictedOperatorIndexes",
                "type": "uint256[]",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "SetRestrictedOperator",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "taskDefinitionId",
                "type": "uint16",
                "indexed": false
            },
            {
                "internalType": "uint256[]",
                "name": "restrictedOperatorIndexes",
                "type": "uint256[]",
                "indexed": false
            },
            {
                "internalType": "bool[]",
                "name": "isRestricted",
                "type": "bool[]",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "TaskDefinitionRestrictedOperatorsModified",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address",
                "indexed": false
            },
            {
                "internalType": "uint32",
                "name": "taskNumber",
                "type": "uint32",
                "indexed": false
            },
            {
                "internalType": "string",
                "name": "proofOfTask",
                "type": "string",
                "indexed": false
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes",
                "indexed": false
            },
            {
                "internalType": "uint16",
                "name": "taskDefinitionId",
                "type": "uint16",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "TaskRejected",
        "anonymous": false
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address",
                "indexed": false
            },
            {
                "internalType": "uint32",
                "name": "taskNumber",
                "type": "uint32",
                "indexed": false
            },
            {
                "internalType": "string",
                "name": "proofOfTask",
                "type": "string",
                "indexed": false
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes",
                "indexed": false
            },
            {
                "internalType": "uint16",
                "name": "taskDefinitionId",
                "type": "uint16",
                "indexed": false
            }
        ],
        "type": "event",
        "name": "TaskSubmitted",
        "anonymous": false
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "avsLogic",
        "outputs": [
            {
                "internalType": "contract IAvsLogic",
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "baseRewardFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "beforePaymentsLogic",
        "outputs": [
            {
                "internalType": "contract IBeforePaymentsLogic",
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "struct IAttestationCenter.PaymentRequestMessage[]",
                "name": "_operators",
                "type": "tuple[]",
                "components": [
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "feeToClaim",
                        "type": "uint256"
                    }
                ]
            },
            {
                "internalType": "uint256",
                "name": "_lastPaidTaskNumber",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "clearBatchPayment"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_lastPaidTaskNumber",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_amountClaimed",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "clearPayment"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "struct TaskDefinitionParams",
                "name": "_taskDefinitionParams",
                "type": "tuple",
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "blockExpiry",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "baseRewardFeeForAttesters",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "baseRewardFeeForPerformer",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "baseRewardFeeForAggregator",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "disputePeriodBlocks",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minimumVotingPower",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "restrictedOperatorIndexes",
                        "type": "uint256[]"
                    }
                ]
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "createNewTaskDefinition",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_operatorId",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "getOperatorPaymentDetail",
        "outputs": [
            {
                "internalType": "struct IAttestationCenter.PaymentDetails",
                "name": "",
                "type": "tuple",
                "components": [
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lastPaidTaskNumber",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "feeToClaim",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum IAttestationCenter.PaymentStatus",
                        "name": "paymentStatus",
                        "type": "uint8"
                    }
                ]
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "getRoleAdmin",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "_taskDefinitionId",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "getTaskDefinitionMinimumVotingPower",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "_taskDefinitionId",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "getTaskDefinitionRestrictedOperators",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "grantRole"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "hasRole",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "numOfOperators",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "numOfTaskDefinitions",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ]
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "obls",
        "outputs": [
            {
                "internalType": "contract IOBLS",
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_operator",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "operatorsIdsByAddress",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_votingPower",
                "type": "uint256"
            },
            {
                "internalType": "uint256[4]",
                "name": "_blsKey",
                "type": "uint256[4]"
            },
            {
                "internalType": "address",
                "name": "_rewardsReceiver",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "registerToNetwork"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "callerConfirmation",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "renounceRole"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_from",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_to",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "requestBatchPayment"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "requestBatchPayment"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_operatorId",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "requestPayment"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "revokeRole"
    },
    {
        "inputs": [
            {
                "internalType": "contract IAvsLogic",
                "name": "_avsLogic",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "setAvsLogic"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "_taskDefinitionId",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "_minimumVotingPower",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "setTaskDefinitionMinVotingPower"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "_taskDefinitionId",
                "type": "uint16"
            },
            {
                "internalType": "uint256[]",
                "name": "_restrictedOperatorIndexes",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "setTaskDefinitionRestrictedOperators"
    },
    {
        "inputs": [
            {
                "internalType": "struct IAttestationCenter.TaskInfo",
                "name": "_taskInfo",
                "type": "tuple",
                "components": [
                    {
                        "internalType": "string",
                        "name": "proofOfTask",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    },
                    {
                        "internalType": "address",
                        "name": "taskPerformer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint16",
                        "name": "taskDefinitionId",
                        "type": "uint16"
                    }
                ]
            },
            {
                "internalType": "bool",
                "name": "_isApproved",
                "type": "bool"
            },
            {
                "internalType": "bytes",
                "name": "_tpSignature",
                "type": "bytes"
            },
            {
                "internalType": "uint256[2]",
                "name": "_taSignature",
                "type": "uint256[2]"
            },
            {
                "internalType": "uint256[]",
                "name": "_attestersIds",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "submitTask"
    },
    {
        "inputs": [
            {
                "internalType": "struct IAttestationCenter.TaskInfo",
                "name": "_taskInfo",
                "type": "tuple",
                "components": [
                    {
                        "internalType": "string",
                        "name": "proofOfTask",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    },
                    {
                        "internalType": "address",
                        "name": "taskPerformer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint16",
                        "name": "taskDefinitionId",
                        "type": "uint16"
                    }
                ]
            },
            {
                "internalType": "struct IAttestationCenter.TaskSubmissionDetails",
                "name": "_taskSubmissionDetails",
                "type": "tuple",
                "components": [
                    {
                        "internalType": "bool",
                        "name": "isApproved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bytes",
                        "name": "tpSignature",
                        "type": "bytes"
                    },
                    {
                        "internalType": "uint256[2]",
                        "name": "taSignature",
                        "type": "uint256[2]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "attestersIds",
                        "type": "uint256[]"
                    }
                ]
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "submitTask"
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "taskNumber",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newAvsGovernanceMultisig",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "transferAvsGovernanceMultisig"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_operator",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function",
        "name": "unRegisterOperatorFromNetwork"
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "type": "function",
        "name": "vault",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ]
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_operator",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "votingPower",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ]
    }
]