import { formatAmount } from '@/lib/types';

interface AssetInputProps {
  label: string;
  asset: string;
  amount: string;
  maxAmount?: string;
  onChange: (value: string) => void;
}

export function AssetInput({ 
  label, 
  asset, 
  amount, 
  maxAmount, 
  onChange 
}: AssetInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {maxAmount && (
          <button
            onClick={() => onChange(formatAmount(maxAmount))}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Max: {formatAmount(maxAmount)}
          </button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span className="text-sm font-medium text-gray-600">{asset}</span>
      </div>
    </div>
  );
} 