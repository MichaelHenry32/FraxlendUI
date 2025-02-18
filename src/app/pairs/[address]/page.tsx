'use client';

import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Market } from '@/lib/store/marketsSlice';
import Image from 'next/image';
import Link from 'next/link';
import { formatAmount, formatRate, calculateUtilization } from '@/lib/types';
import { useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { ConnectWalletButton } from '@/components/WalletConnection';
import { ERC20_ABI } from '@/lib/contracts/abis';
import { useMarkets } from '@/lib/hooks/useMarkets';

type ActionType = 'lend' | 'withdraw' | 'repay' | 'borrow';

function ActionTab({ type, active, onClick }: { type: ActionType; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </button>
  );
}

function AssetInput({ 
  label, 
  asset, 
  amount, 
  maxAmount, 
  onChange 
}: { 
  label: string; 
  asset: string; 
  amount: string; 
  maxAmount?: string;
  onChange: (value: string) => void;
}) {
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

function formatTokenName(token: Market['asset']): string {
  return `${token.name} (${token.symbol})`;
}

export default function PairDetails() {
  const params = useParams();
  const address = typeof params.address === 'string' ? params.address : Array.isArray(params.address) ? params.address[0] : '';
  const { markets, viewMode } = useSelector((state: RootState) => state.markets);
  const market = markets.find(m => m.id.toLowerCase() === address.toLowerCase());
  const { address: walletAddress, isConnected } = useAccount();
  const [selectedAction, setSelectedAction] = useState<ActionType>(viewMode === 'lending' ? 'lend' : 'borrow');
  const [lendAmount, setLendAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [withdrawCollateralAmount, setWithdrawCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');

  // Load markets data
  useMarkets();

  // Fetch user's asset balance using the asset token address
  const { data: assetBalance } = useContractRead({
    address: market?.asset.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: walletAddress ? [walletAddress] : undefined,
  });

  // Balances for max amounts
  const balances = {
    asset: assetBalance?.toString() || '0',
    collateral: market?.accounting.totalCollateral || '0',
    lendingPosition: '1000000000000000000', // 1.0 in wei - TODO: Fetch from contract
    borrowingPosition: '2000000000000000000', // 2.0 in wei - TODO: Fetch from contract
  };

  if (!market) {
    return (
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Link href="/" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
            ← Back to Markets
          </Link>
          <div className="text-center text-gray-500">Market not found</div>
        </div>
      </main>
    );
  }

  // Extract asset and collateral symbols from the names
  const assetSymbol = market.asset.symbol;
  const collateralSymbol = market.collateral.symbol;

  return (
    <main className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Link href="/" className="text-blue-500 hover:text-blue-600 mb-6 inline-block">
          ← Back to Markets
        </Link>
        
        <h1 className="text-2xl font-bold mb-6">Pair Details</h1>
        
        <div className="grid gap-6">
          {/* Basic Info Section */}
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

          {/* Stats Section */}
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

          {/* Rates Section */}
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

          {/* Actions Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Actions</h2>
            
            {/* Action Tabs - Always visible */}
            <div className="flex space-x-2 border-b border-gray-200 pb-2">
              <ActionTab type="lend" active={selectedAction === 'lend'} onClick={() => setSelectedAction('lend')} />
              <ActionTab type="withdraw" active={selectedAction === 'withdraw'} onClick={() => setSelectedAction('withdraw')} />
              <ActionTab type="repay" active={selectedAction === 'repay'} onClick={() => setSelectedAction('repay')} />
              <ActionTab type="borrow" active={selectedAction === 'borrow'} onClick={() => setSelectedAction('borrow')} />
            </div>

            {/* Action Forms */}
            <div className="p-4 border border-gray-200 rounded-lg">
              {!isConnected ? (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">Connect your wallet to interact with this market</p>
                  <ConnectWalletButton />
                </div>
              ) : (
                <>
                  {selectedAction === 'lend' && (
                    <div className="space-y-4">
                      <AssetInput
                        label="Amount to Lend"
                        asset={assetSymbol}
                        amount={lendAmount}
                        maxAmount={balances.asset}
                        onChange={setLendAmount}
                      />
                      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Lend {assetSymbol}
                      </button>
                    </div>
                  )}

                  {selectedAction === 'withdraw' && (
                    <div className="space-y-4">
                      <AssetInput
                        label="Amount to Withdraw"
                        asset={assetSymbol}
                        amount={withdrawAmount}
                        maxAmount={balances.lendingPosition}
                        onChange={setWithdrawAmount}
                      />
                      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Withdraw {assetSymbol}
                      </button>
                    </div>
                  )}

                  {selectedAction === 'repay' && (
                    <div className="space-y-4">
                      <AssetInput
                        label="Amount to Repay"
                        asset={assetSymbol}
                        amount={repayAmount}
                        maxAmount={balances.borrowingPosition}
                        onChange={setRepayAmount}
                      />
                      <AssetInput
                        label="Collateral to Withdraw"
                        asset={collateralSymbol}
                        amount={withdrawCollateralAmount}
                        maxAmount={balances.collateral}
                        onChange={setWithdrawCollateralAmount}
                      />
                      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Repay and Withdraw
                      </button>
                    </div>
                  )}

                  {selectedAction === 'borrow' && (
                    <div className="space-y-4">
                      <AssetInput
                        label="Collateral to Deposit"
                        asset={collateralSymbol}
                        amount={collateralAmount}
                        maxAmount={balances.collateral}
                        onChange={setCollateralAmount}
                      />
                      <AssetInput
                        label="Amount to Borrow"
                        asset={assetSymbol}
                        amount={borrowAmount}
                        maxAmount={market.accounting.totalAssetAmount}
                        onChange={setBorrowAmount}
                      />
                      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Deposit and Borrow
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 