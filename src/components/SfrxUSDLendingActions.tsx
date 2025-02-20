import type { Market } from '@/lib/store/marketsSlice';
import { AssetInput } from './AssetInput';
import { useTokenAllowance } from '@/lib/hooks/useTokenAllowance';
import { useTokenApproval } from '@/lib/hooks/useTokenApproval';
import { useSfrxUSDLending } from '@/lib/hooks/useSfrxUSDLending';
import { useAccount } from 'wagmi';

interface SfrxUSDLendingActionsProps {
  market: Market;
  lendAmount: string;
  setLendAmount: (value: string) => void;
  maxAmount: string;
}

export function SfrxUSDLendingActions({ 
  market, 
  lendAmount, 
  setLendAmount, 
  maxAmount,
}: SfrxUSDLendingActionsProps) {
  const { address: walletAddress } = useAccount();
  const { hasAllowance } = useTokenAllowance(market, walletAddress, lendAmount);
  const { approve, isApproving } = useTokenApproval(market);
  const { lend, isLending } = useSfrxUSDLending(market);

  return (
    <div className="space-y-4">
      <AssetInput
        label="Amount to Lend"
        asset="frxUSD"
        amount={lendAmount}
        maxAmount={maxAmount}
        onChange={setLendAmount}
      />
      <div className="space-y-2">
        {!hasAllowance && (
          <button
            onClick={() => approve(lendAmount)}
            disabled={!lendAmount || lendAmount === '0' || isApproving || hasAllowance}
            className={`w-full px-4 py-2 rounded-md transition-colors ${
              hasAllowance 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isApproving
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isApproving ? 'Approving...' : 'Approve frxUSD'}
          </button>
        )}
        <button
          onClick={() => lend(lendAmount)}
          disabled={!lendAmount || lendAmount === '0' || !hasAllowance || isLending}
          className={`w-full px-4 py-2 rounded-md transition-colors ${
            !hasAllowance || !lendAmount || lendAmount === '0' || isLending
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLending ? 'Lending...' : 'Lend frxUSD'}
        </button>
      </div>
    </div>
  );
} 