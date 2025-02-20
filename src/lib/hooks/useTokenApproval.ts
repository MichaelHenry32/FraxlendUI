import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import type { BaseError } from 'viem';
import { ERC20_ABI } from '../contracts/abis';
import type { Market } from '../store/marketsSlice';
import { config } from '../config';

const {
  SFRXUSD_ADDRESS,
  FRXUSD_ADDRESS,
  YIELD_TOKEN_HELPERS_ADDRESS,
} = config.contracts;

export function useTokenApproval(market: Market | undefined) {
  const isSfrxUSDMarket = market?.asset.address.toLowerCase() === SFRXUSD_ADDRESS.toLowerCase();
  
  // For sfrxUSD markets, we need to approve frxUSD
  const tokenAddress = isSfrxUSDMarket 
    ? FRXUSD_ADDRESS
    : market?.asset.address;

  const spenderAddress = isSfrxUSDMarket
    ? YIELD_TOKEN_HELPERS_ADDRESS
    : market?.id;

  // Get token decimals
  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  const { writeContract, data: hash, isPending: isWritePending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleApprove = async (amount: string) => {
    if (!spenderAddress || !tokenAddress) {
      console.error('Missing spender or token address');
      return;
    }

    if (decimals === undefined) {
      console.error('Token decimals not loaded');
      return;
    }

    try {
      // Convert amount to wei (multiply by 10^18)
      const amountInWei = BigInt(
        Math.floor(parseFloat(amount) * 10**18)
      );

      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress as `0x${string}`, amountInWei],
      });
    } catch (err) {
      console.error('Error approving token:', (err as BaseError).message);
    }
  };

  if (error) {
    console.error('Contract write error:', error);
  }

  return {
    approve: handleApprove,
    isApproving: isWritePending || isConfirming,
    isApprovalSuccess: isSuccess,
    approvalHash: hash
  };
} 