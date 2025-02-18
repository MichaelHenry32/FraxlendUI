export const FRAXLEND_FACTORY_ABI = [
  {
    "inputs": [],
    "name": "getAllPairAddresses",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const FRAXLEND_PAIR_ABI = [
  {
    "inputs": [],
    "name": "asset",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "collateralContract",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentRateInfo",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "lastBlock",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "feeToProtocolRate",
        "type": "uint32"
      },
      {
        "internalType": "uint64",
        "name": "lastTimestamp",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "ratePerSec",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "fullUtilizationRate",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPairAccounting",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "_totalAssetAmount",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "_totalAssetShares",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "_totalBorrowAmount",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "_totalBorrowShares",
        "type": "uint128"
      },
      {
        "internalType": "uint256",
        "name": "_totalCollateral",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const ERC20_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const; 