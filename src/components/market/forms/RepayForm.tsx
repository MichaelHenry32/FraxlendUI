import { AssetInput } from '@/components/AssetInput';

interface RepayFormProps {
  assetSymbol: string;
  collateralSymbol: string;
  repayAmount: string;
  maxRepayAmount: string;
  withdrawAmount: string;
  maxWithdrawAmount: string;
  onRepayAmountChange: (value: string) => void;
  onWithdrawAmountChange: (value: string) => void;
  onSubmit: () => void;
}

export function RepayForm({
  assetSymbol,
  collateralSymbol,
  repayAmount,
  maxRepayAmount,
  withdrawAmount,
  maxWithdrawAmount,
  onRepayAmountChange,
  onWithdrawAmountChange,
  onSubmit
}: RepayFormProps) {
  return (
    <div className="space-y-4">
      <AssetInput
        label="Amount to Repay"
        asset={assetSymbol}
        amount={repayAmount}
        maxAmount={maxRepayAmount}
        onChange={onRepayAmountChange}
      />
      <AssetInput
        label="Collateral to Withdraw"
        asset={collateralSymbol}
        amount={withdrawAmount}
        maxAmount={maxWithdrawAmount}
        onChange={onWithdrawAmountChange}
      />
      <button 
        onClick={onSubmit}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Repay and Withdraw
      </button>
    </div>
  );
} 