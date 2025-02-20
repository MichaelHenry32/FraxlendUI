import type { Market } from '@/lib/store/marketsSlice';
import Image from 'next/image';

interface MarketInfoProps {
  market: Market;
  address: string;
  formatTokenName: (token: Market['asset']) => string;
}

export function MarketInfo({ market, address, formatTokenName }: MarketInfoProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Basic Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Pair Address</p>
          <p className="font-mono">{address}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Asset / Collateral</p>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-2">
              <Image
                src={market.asset.logo}
                alt={market.asset.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{formatTokenName(market.asset)}</span>
            </div>
            <span>/</span>
            <div className="flex items-center space-x-2">
              <Image
                src={market.collateral.logo}
                alt={market.collateral.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{formatTokenName(market.collateral)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 