import { AssetInput } from '@/components/AssetInput';
import { useTokenAllowance } from '@/lib/hooks/useTokenAllowance';
import { useTokenApproval } from '@/lib/hooks/useTokenApproval';
import { useAccount } from 'wagmi';
import type { Market } from '@/lib/store/marketsSlice';

interface LendFormProps {
  market: Market;
  assetSymbol: string;
  amount: string;
  maxAmount: string;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
}

export function LendForm({
  market,
  assetSymbol,
  amount,
  maxAmount,
  onAmountChange,
  onSubmit
}: LendFormProps) {
  const { address: walletAddress } = useAccount();
  const { hasAllowance } = useTokenAllowance(market, walletAddress, amount);
  const { approve, isApproving } = useTokenApproval(market);

  return (
    <div className="space-y-4">
      <AssetInput
        label="Amount to Lend"
        asset={assetSymbol}
        amount={amount}
        maxAmount={maxAmount}
        onChange={onAmountChange}
      />
      <div className="space-y-2">
        {!hasAllowance && (
          <button 
            onClick={() => approve(amount)}
            disabled={!amount || amount === '0' || isApproving || hasAllowance}
            className={`w-full px-4 py-2 rounded-md transition-colors ${
              hasAllowance 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isApproving
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isApproving ? 'Approving...' : `Approve ${assetSymbol}`}
          </button>
        )}
        <button 
          onClick={onSubmit}
          disabled={!amount || amount === '0' || !hasAllowance}
          className={`w-full px-4 py-2 rounded-md transition-colors ${
            !hasAllowance || !amount || amount === '0'
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Lend {assetSymbol}
        </button>
      </div>
    </div>
  );
} 