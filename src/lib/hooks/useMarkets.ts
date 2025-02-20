'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useContractRead, usePublicClient } from 'wagmi';
import { FRAXLEND_FACTORY_ABI, FRAXLEND_PAIR_ABI, ERC20_ABI } from '../contracts/abis';
import { setMarkets } from '../store/marketsSlice';
import type { Market } from '../store/marketsSlice';
import {
  RateInfo,
  PairAccounting,
  serializeAccounting,
} from '../types';
import { config } from '../config';

const { FRAXLEND_FACTORY_ADDRESS } = config.contracts;
const SUPERCHAIN_TOKEN_LIST_URL = 'https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json';
const DEFAULT_TOKEN_ICON = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';

interface TokenListToken {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

interface TokenList {
  tokens: TokenListToken[];
}

interface TokenInfo {
  name: string;
  symbol: string;
}

interface TokenData {
  address: `0x${string}`;
  name: string;
  symbol: string;
  logo: string;
}

interface PairData {
  id: string;
  asset: {
    address: `0x${string}`;
    info: TokenInfo;
  };
  collateral: {
    address: `0x${string}`;
    info: TokenInfo;
  };
  rateInfo: RateInfo;
  accounting: PairAccounting;
}

type WagmiMulticallResult<T> = {
  error?: Error;
  result?: T;
  status: 'success' | 'failure';
};

interface PairDataResults {
  asset: WagmiMulticallResult<`0x${string}`>;
  collateral: WagmiMulticallResult<`0x${string}`>;
  rateInfo: WagmiMulticallResult<readonly [number, number, bigint, bigint, bigint]>;
  accounting: WagmiMulticallResult<readonly [bigint, bigint, bigint, bigint, bigint]>;
}

interface TokenDataResults {
  assetName: WagmiMulticallResult<string>;
  assetSymbol: WagmiMulticallResult<string>;
  collateralName: WagmiMulticallResult<string>;
  collateralSymbol: WagmiMulticallResult<string>;
}

function getTokenLogoFromList(address: string, tokenList: TokenList | null): string {
  const token = tokenList?.tokens.find(t => 
    t.address.toLowerCase() === address.toLowerCase() && 
    t.chainId === 2522 // Fraxtal chain ID
  );

  if (token?.logoURI) {
    return token.logoURI;
  }

  return DEFAULT_TOKEN_ICON;
}

// Convert rate per second to APR with decimal precision
function calculateAPR(ratePerSec: bigint): number {
  const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
  const WAD = 1e18;
  
  // Convert to decimal calculation to maintain precision
  // (ratePerSec / 10^18) * (365 * 24 * 60 * 60) * 100
  return Number(ratePerSec) * SECONDS_PER_YEAR * 100 / WAD;
}

// Calculate lending yield based on borrow APR and utilization
function calculateLendingYield(borrowAPR: number, totalBorrowAmount: bigint, totalAssetAmount: bigint): number {
  if (totalAssetAmount === BigInt(0)) return 0;
  const utilization = Number(totalBorrowAmount) / Number(totalAssetAmount);
  return borrowAPR * utilization;
}

async function transformPairData(
  pairAddress: `0x${string}`,
  pairData: PairDataResults,
  tokenData: TokenDataResults,
  tokenList: TokenList | null
): Promise<Market | null> {
  const { asset, collateral, rateInfo, accounting } = pairData;
  const { assetName, assetSymbol, collateralName, collateralSymbol } = tokenData;

  if (!asset.result || !collateral.result || !rateInfo.result || !accounting.result ||
      !assetName.result || !assetSymbol.result || !collateralName.result || !collateralSymbol.result) {
    console.error(`Missing data for pair ${pairAddress}`);
    return null;
  }

  const pair: PairData = {
    id: pairAddress,
    asset: {
      address: asset.result,
      info: {
        name: assetName.result,
        symbol: assetSymbol.result,
      },
    },
    collateral: {
      address: collateral.result,
      info: {
        name: collateralName.result,
        symbol: collateralSymbol.result,
      },
    },
    rateInfo: {
      lastBlock: BigInt(rateInfo.result[0]),
      feeToProtocolRate: BigInt(rateInfo.result[1]),
      lastTimestamp: BigInt(rateInfo.result[2]),
      ratePerSec: BigInt(rateInfo.result[3]),
      fullUtilizationRate: BigInt(rateInfo.result[4]),
    },
    accounting: {
      totalAssetAmount: BigInt(accounting.result[0]),
      totalAssetShares: BigInt(accounting.result[1]),
      totalBorrowAmount: BigInt(accounting.result[2]),
      totalBorrowShares: BigInt(accounting.result[3]),
      totalCollateral: BigInt(accounting.result[4]),
    },
  };

  const borrowingCost = calculateAPR(pair.rateInfo.ratePerSec);
  const lendingYield = calculateLendingYield(
    borrowingCost,
    pair.accounting.totalBorrowAmount,
    pair.accounting.totalAssetAmount
  );

  return {
    id: pair.id,
    asset: {
      address: asset.result,
      name: assetName.result,
      symbol: assetSymbol.result,
      logo: getTokenLogoFromList(asset.result, tokenList)
    },
    collateral: {
      address: collateral.result,
      name: collateralName.result,
      symbol: collateralSymbol.result,
      logo: getTokenLogoFromList(collateral.result, tokenList)
    },
    borrowingCost,
    lendingYield,
    accounting: serializeAccounting(pair.accounting),
  };
}

export function useMarkets() {
  const dispatch = useDispatch();
  const [tokenList, setTokenList] = useState<TokenList | null>(null);
  const publicClient = usePublicClient();

  // Fetch the Superchain token list
  useEffect(() => {
    fetch(SUPERCHAIN_TOKEN_LIST_URL)
      .then(response => response.json())
      .then(data => setTokenList(data))
      .catch(error => console.error('Error fetching token list:', error));
  }, []);

  // Get all pair addresses
  const { data: pairAddresses } = useContractRead({
    address: FRAXLEND_FACTORY_ADDRESS,
    abi: FRAXLEND_FACTORY_ABI,
    functionName: 'getAllPairAddresses',
  });

  useEffect(() => {
    async function fetchMarketData() {
      if (!pairAddresses || !publicClient) return;

      try {
        const marketsData = await Promise.all(
          pairAddresses.map(async (pairAddress) => {
            try {
              // Get pair data using multicall
              const [asset, collateral, rateInfo, accounting] = await publicClient.multicall({
                contracts: [
                  { address: pairAddress, abi: FRAXLEND_PAIR_ABI, functionName: 'asset' },
                  { address: pairAddress, abi: FRAXLEND_PAIR_ABI, functionName: 'collateralContract' },
                  { address: pairAddress, abi: FRAXLEND_PAIR_ABI, functionName: 'currentRateInfo' },
                  { address: pairAddress, abi: FRAXLEND_PAIR_ABI, functionName: 'getPairAccounting' },
                ],
              });

              // Get token info using multicall
              const [assetName, assetSymbol, collateralName, collateralSymbol] = await publicClient.multicall({
                contracts: [
                  { address: asset.result!, abi: ERC20_ABI, functionName: 'name' },
                  { address: asset.result!, abi: ERC20_ABI, functionName: 'symbol' },
                  { address: collateral.result!, abi: ERC20_ABI, functionName: 'name' },
                  { address: collateral.result!, abi: ERC20_ABI, functionName: 'symbol' },
                ],
              });

              return transformPairData(
                pairAddress,
                { asset, collateral, rateInfo, accounting },
                { assetName, assetSymbol, collateralName, collateralSymbol },
                tokenList
              );
            } catch (error) {
              console.error(`Error processing pair ${pairAddress}:`, error);
              return null;
            }
          })
        );

        const validMarkets = marketsData.filter((market): market is NonNullable<typeof market> => market !== null);
        dispatch(setMarkets(validMarkets));
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    }

    fetchMarketData();
  }, [pairAddresses, publicClient, tokenList, dispatch]);
} 