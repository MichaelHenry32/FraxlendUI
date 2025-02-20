import { useContractRead } from 'wagmi';
import { ERC20_ABI } from '../contracts/abis';
import type { Market } from '../store/marketsSlice';
import { config } from '../config';

const { SFRXUSD_ADDRESS, FRXUSD_ADDRESS } = config.contracts;

export function useSfrxUSDMarket(market: Market | undefined, walletAddress: `0x${string}` | undefined) {
  // Check if this is an sfrxUSD market
  const isSfrxUSDMarket = market?.asset.address.toLowerCase() === SFRXUSD_ADDRESS.toLowerCase();

  // Get user's frxUSD balance for lending
  const { data: frxUSDBalance } = useContractRead({
    address: FRXUSD_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: walletAddress ? [walletAddress] : undefined,
    query: {
      enabled: Boolean(isSfrxUSDMarket && walletAddress),
      refetchInterval: 10_000
    }
  });

  return {
    isSfrxUSDMarket,
    frxUSDBalance: frxUSDBalance?.toString(),
    frxUSDAddress: FRXUSD_ADDRESS,
    sfrxUSDAddress: SFRXUSD_ADDRESS
  };
} 