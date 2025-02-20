import type { Market } from '@/lib/store/marketsSlice';
import { formatRate } from '@/lib/types';

interface MarketRatesProps {
  market: Market;
}

export function MarketRates({ market }: MarketRatesProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Rates</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Borrowing Cost</p>
          <p className="text-lg font-semibold">{formatRate(market.borrowingCost)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Lending Yield</p>
          <p className="text-lg font-semibold">{formatRate(market.lendingYield)}</p>
        </div>
      </div>
    </section>
  );
} 