import type { Market } from '@/lib/store/marketsSlice';
import { formatAmount, calculateUtilization } from '@/lib/types';

interface MarketStatsProps {
  market: Market;
}

export function MarketStats({ market }: MarketStatsProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Statistics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Assets</p>
          <p className="text-lg font-semibold">
            {formatAmount(market.accounting.totalAssetAmount)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Borrowed</p>
          <p className="text-lg font-semibold">
            {formatAmount(market.accounting.totalBorrowAmount)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Utilization</p>
          <p className="text-lg font-semibold">
            {calculateUtilization(
              market.accounting.totalBorrowAmount,
              market.accounting.totalAssetAmount
            )}
          </p>
        </div>
      </div>
    </section>
  );
} 