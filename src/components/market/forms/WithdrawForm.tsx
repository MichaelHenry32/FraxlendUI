import { AssetInput } from '@/components/AssetInput';

interface WithdrawFormProps {
  assetSymbol: string;
  amount: string;
  maxAmount: string;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
}

export function WithdrawForm({
  assetSymbol,
  amount,
  maxAmount,
  onAmountChange,
  onSubmit
}: WithdrawFormProps) {
  return (
    <div className="space-y-4">
      <AssetInput
        label="Amount to Withdraw"
        asset={assetSymbol}
        amount={amount}
        maxAmount={maxAmount}
        onChange={onAmountChange}
      />
      <button 
        onClick={onSubmit}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Withdraw {assetSymbol}
      </button>
    </div>
  );
} 