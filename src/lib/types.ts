// Blockchain Data Types
export interface RateInfo {
  lastBlock: bigint;
  feeToProtocolRate: bigint;
  lastTimestamp: bigint;
  ratePerSec: bigint;
  fullUtilizationRate: bigint;
}

export interface PairAccounting {
  totalAssetAmount: bigint;
  totalAssetShares: bigint;
  totalBorrowAmount: bigint;
  totalBorrowShares: bigint;
  totalCollateral: bigint;
}

// Serialized Types for Redux
export interface SerializedPairAccounting {
  totalAssetAmount: string;
  totalAssetShares: string;
  totalBorrowAmount: string;
  totalBorrowShares: string;
  totalCollateral: string;
}

// Utility functions for serialization/deserialization
export function serializeAccounting(accounting: PairAccounting): SerializedPairAccounting {
  return {
    totalAssetAmount: accounting.totalAssetAmount.toString(),
    totalAssetShares: accounting.totalAssetShares.toString(),
    totalBorrowAmount: accounting.totalBorrowAmount.toString(),
    totalBorrowShares: accounting.totalBorrowShares.toString(),
    totalCollateral: accounting.totalCollateral.toString(),
  };
}

export function deserializeAccounting(accounting: SerializedPairAccounting): PairAccounting {
  return {
    totalAssetAmount: BigInt(accounting.totalAssetAmount),
    totalAssetShares: BigInt(accounting.totalAssetShares),
    totalBorrowAmount: BigInt(accounting.totalBorrowAmount),
    totalBorrowShares: BigInt(accounting.totalBorrowShares),
    totalCollateral: BigInt(accounting.totalCollateral),
  };
}

// Formatting utilities
export function formatAmount(amount: string | bigint, decimals: number = 18): string {
  const value = typeof amount === 'string' ? BigInt(amount) : amount;
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const significantDecimals = 2;
  const truncatedFractional = fractionalStr.slice(0, significantDecimals);
  return `${integerPart}.${truncatedFractional}`;
}

export function formatRate(rate: number): string {
  return rate.toFixed(2) + '%';
}

export function calculateUtilization(totalBorrow: string | bigint, totalAsset: string | bigint): string {
  const borrowAmount = typeof totalBorrow === 'string' ? BigInt(totalBorrow) : totalBorrow;
  const assetAmount = typeof totalAsset === 'string' ? BigInt(totalAsset) : totalAsset;
  if (assetAmount === BigInt(0)) return '0.00%';
  const utilization = (Number(borrowAmount) / Number(assetAmount)) * 100;
  return utilization.toFixed(2) + '%';
} 