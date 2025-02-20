import { useReadContract } from 'wagmi';
import { ERC20_ABI } from '../contracts/abis';
import type { Market } from '../store/marketsSlice';
import { config } from '../config';

const { SFRXUSD_ADDRESS, FRXUSD_ADDRESS, YIELD_TOKEN_HELPERS_ADDRESS } = config.contracts;

export function useTokenAllowance(
  market: Market | undefined,
  walletAddress: `0x${string}` | undefined,
  amount: string
) {
  // For sfrxUSD markets, we need to check frxUSD allowance for YieldTokenHelpers
  // For other markets, we check the asset allowance for the FraxlendPair
  const isSfrxUSDMarket = market?.asset.address.toLowerCase() === SFRXUSD_ADDRESS.toLowerCase();
  
  const tokenAddress = isSfrxUSDMarket 
    ? FRXUSD_ADDRESS
    : market?.asset.address;

  const spenderAddress = isSfrxUSDMarket
    ? YIELD_TOKEN_HELPERS_ADDRESS // YieldTokenHelpers for sfrxUSD
    : market?.id; // FraxlendPair address for others

  // Get token decimals
  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  const { data: allowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: walletAddress && spenderAddress ? [walletAddress, spenderAddress as `0x${string}`] : undefined,
    query: {
      enabled: Boolean(tokenAddress && walletAddress && spenderAddress),
      refetchInterval: 5_000 // Refresh every 5 seconds to catch approval changes
    }
  });

  // Check if the allowance is sufficient for the amount
  const hasAllowance = Boolean(
    allowance && 
    amount && 
    decimals !== undefined &&
    BigInt(allowance) >= BigInt(
      Math.round(parseFloat(amount) * Math.pow(10, decimals))
    )
  );

  return {
    allowance: allowance?.toString(),
    hasAllowance,
    spenderAddress
  };
} 