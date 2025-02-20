import { AssetInput } from '@/components/AssetInput';

interface BorrowFormProps {
  assetSymbol: string;
  collateralSymbol: string;
  collateralAmount: string;
  maxCollateralAmount: string;
  borrowAmount: string;
  maxBorrowAmount: string;
  onCollateralAmountChange: (value: string) => void;
  onBorrowAmountChange: (value: string) => void;
  onSubmit: () => void;
}

export function BorrowForm({
  assetSymbol,
  collateralSymbol,
  collateralAmount,
  maxCollateralAmount,
  borrowAmount,
  maxBorrowAmount,
  onCollateralAmountChange,
  onBorrowAmountChange,
  onSubmit
}: BorrowFormProps) {
  return (
    <div className="space-y-4">
      <AssetInput
        label="Collateral to Deposit"
        asset={collateralSymbol}
        amount={collateralAmount}
        maxAmount={maxCollateralAmount}
        onChange={onCollateralAmountChange}
      />
      <AssetInput
        label="Amount to Borrow"
        asset={assetSymbol}
        amount={borrowAmount}
        maxAmount={maxBorrowAmount}
        onChange={onBorrowAmountChange}
      />
      <button 
        onClick={onSubmit}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Deposit and Borrow
      </button>
    </div>
  );
} 