'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Market } from '@/lib/store/marketsSlice';
import { toggleViewMode } from '@/lib/store/marketsSlice';
import Image from 'next/image';
import { useMarkets } from '@/lib/hooks/useMarkets';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/config';

const { SFRXUSD_ADDRESS } = config.contracts;

// Format rate as percentage with 2 decimal places
function formatRate(rate: number): string {
  return rate.toFixed(2) + '%';
}

function formatTokenName(token: Market['asset']): string {
  // Special case for sfrxUSD
  if (token.address.toLowerCase() === SFRXUSD_ADDRESS.toLowerCase()) {
    return `Enhanced Frax USD (frxUSD)`;
  }
  return `${token.name} (${token.symbol})`;
}

export default function Markets() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { markets, viewMode } = useSelector((state: RootState) => state.markets);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load markets data from blockchain
  useMarkets();

  // Filter markets based on search query
  const filteredMarkets = useMemo(() => {
    if (!searchQuery) return markets;
    
    const query = searchQuery.toLowerCase();
    return markets.filter(market => {
      // Special case for sfrxUSD
      if (market.asset.address.toLowerCase() === SFRXUSD_ADDRESS.toLowerCase()) {
        const enhancedName = 'Enhanced Frax USD'.toLowerCase();
        const frxUSDSymbol = 'frxUSD'.toLowerCase();
        if (enhancedName.includes(query) || frxUSDSymbol.includes(query)) {
          return true;
        }
      }

      const assetName = market.asset.name.toLowerCase();
      const assetSymbol = market.asset.symbol.toLowerCase();
      const collateralName = market.collateral.name.toLowerCase();
      const collateralSymbol = market.collateral.symbol.toLowerCase();
      
      return assetName.includes(query) || 
             assetSymbol.includes(query) || 
             collateralName.includes(query) || 
             collateralSymbol.includes(query);
    });
  }, [markets, searchQuery]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Markets</h1>
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => viewMode === 'borrowing' && dispatch(toggleViewMode())}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'lending'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lend
            </button>
            <button
              onClick={() => viewMode === 'lending' && dispatch(toggleViewMode())}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'borrowing'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Borrow
            </button>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by asset or collateral..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {markets.length === 0 ? (
        <div className="text-center text-gray-500">Loading markets...</div>
      ) : filteredMarkets.length === 0 ? (
        <div className="text-center text-gray-500">No markets found matching your search</div>
      ) : (
        <div className="grid gap-4">
          <div className="grid grid-cols-3 px-4 text-sm font-medium text-gray-500">
            <div>Collateral</div>
            <div>{viewMode === 'borrowing' ? 'Borrow' : 'Lend'}</div>
            <div className="text-right">
              {viewMode === 'borrowing' ? 'Borrowing Cost' : 'Lending Yield'}
            </div>
          </div>
          {filteredMarkets.map((market) => (
            <div
              key={market.id}
              onClick={() => router.push(`/pairs/${market.id}`)}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="grid grid-cols-3 items-center">
                <div className="flex items-center space-x-2">
                  <Image
                    src={market.collateral.logo}
                    alt={market.collateral.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-medium">{formatTokenName(market.collateral)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Image
                    src={market.asset.logo}
                    alt={market.asset.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-medium">{formatTokenName(market.asset)}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {viewMode === 'borrowing'
                      ? formatRate(market.borrowingCost)
                      : formatRate(market.lendingYield)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 