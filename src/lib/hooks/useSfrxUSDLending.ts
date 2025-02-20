import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import type { BaseError } from 'viem';
import { SFRXUSD_MANAGER_ABI } from '../contracts/abis';
import type { Market } from '../store/marketsSlice';
import { config } from '../config';

const { YIELD_TOKEN_HELPERS_ADDRESS } = config.contracts;

export function useSfrxUSDLending(market: Market | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isLending, isSuccess: isLendingSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleLend = async (amount: string) => {
    if (!market?.id) {
      console.error('Missing market ID');
      return;
    }

    try {
      // Convert amount to wei (multiply by 10^18)
      const amountInWei = BigInt(
        Math.floor(parseFloat(amount) * 10**18)
      );

      await writeContract({
        address: YIELD_TOKEN_HELPERS_ADDRESS,
        abi: SFRXUSD_MANAGER_ABI,
        functionName: 'convertAndDeposit',
        args: [amountInWei, market.id as `0x${string}`],
      });
    } catch (err) {
      console.error('Error lending frxUSD:', (err as BaseError).message);
    }
  };

  if (error) {
    console.error('Contract write error:', error);
  }

  return {
    lend: handleLend,
    isLending: isPending || isLending,
    isLendingSuccess,
    lendingHash: hash
  };
} 