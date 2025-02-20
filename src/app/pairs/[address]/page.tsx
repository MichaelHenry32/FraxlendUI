'use client';

import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Market } from '@/lib/store/marketsSlice';
import Link from 'next/link';
import { useAccount, useContractRead } from 'wagmi';
import { SFRXUSD_MANAGER_ABI } from '@/lib/contracts/abis';
import { useMarkets } from '@/lib/hooks/useMarkets';
import { useSfrxUSDMarket } from '@/lib/hooks/useSfrxUSDMarket';
import { useMarketActions } from '@/lib/hooks/useMarketActions';
import { ConnectWalletButton } from '@/components/WalletConnection';
import { MarketInfo } from '@/components/market/MarketInfo';
import { MarketStats } from '@/components/market/MarketStats';
import { MarketRates } from '@/components/market/MarketRates';
import { ActionTabs } from '@/components/market/ActionTabs';
import { SfrxUSDLendingActions } from '@/components/SfrxUSDLendingActions';
import { LendForm } from '@/components/market/forms/LendForm';
import { WithdrawForm } from '@/components/market/forms/WithdrawForm';
import { RepayForm } from '@/components/market/forms/RepayForm';
import { BorrowForm } from '@/components/market/forms/BorrowForm';
import { config } from '@/lib/config';

const { YIELD_TOKEN_HELPERS_ADDRESS, SFRXUSD_ADDRESS } = config.contracts;

function formatTokenName(token: Market['asset']): string {
  // Special case for sfrxUSD
  if (token.address.toLowerCase() === SFRXUSD_ADDRESS.toLowerCase()) {
    return `Enhanced Frax USD (frxUSD)`;
  }
  return `${token.name} (${token.symbol})`;
}

export default function PairDetails() {
  const params = useParams();
  const address = typeof params.address === 'string' ? params.address : Array.isArray(params.address) ? params.address[0] : '';
  const { markets, viewMode } = useSelector((state: RootState) => state.markets);
  const market = markets.find(m => m.id.toLowerCase() === address.toLowerCase());
  const { address: walletAddress, isConnected } = useAccount();

  // Load markets data
  useMarkets();

  // Use market action states
  const actions = useMarketActions(viewMode === 'lending' ? 'lend' : 'borrow');

  // Use the sfrxUSD market hook
  const { isSfrxUSDMarket, frxUSDBalance } = useSfrxUSDMarket(market, walletAddress);

  // Fetch max withdrawable amount for sfrxUSD markets
  const { data: maxWithdrawable } = useContractRead({
    address: YIELD_TOKEN_HELPERS_ADDRESS,
    abi: SFRXUSD_MANAGER_ABI,
    functionName: 'maxWithdrawable',
    args: walletAddress && market ? [walletAddress, market.id as `0x${string}`] : undefined,
    query: {
      enabled: Boolean(
        walletAddress && 
        market && 
        market.asset.address.toLowerCase() === SFRXUSD_ADDRESS.toLowerCase() && 
        actions.selectedAction === 'withdraw'
      ),
      refetchInterval: 10_000
    }
  });

  // Balances for max amounts
  const balances = {
    asset: isSfrxUSDMarket ? frxUSDBalance || '0' : '0',
    collateral: market?.accounting.totalCollateral || '0',
    lendingPosition: market?.asset.address.toLowerCase() === SFRXUSD_ADDRESS.toLowerCase() 
      ? maxWithdrawable?.toString() || '0'
      : '1000000000000000000', // 1.0 in wei - TODO: Fetch from contract for non-sfrxUSD markets
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
  const assetSymbol = market.asset.address.toLowerCase() === SFRXUSD_ADDRESS.toLowerCase() 
    ? 'frxUSD'
    : market.asset.symbol;
  const collateralSymbol = market.collateral.symbol;

  return (
    <main className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Link href="/" className="text-blue-500 hover:text-blue-600 mb-6 inline-block">
          ← Back to Markets
        </Link>
        
        <h1 className="text-2xl font-bold mb-6">Pair Details</h1>
        
        <div className="grid gap-6">
          <MarketInfo 
            market={market} 
            address={address} 
            formatTokenName={formatTokenName} 
          />
          <MarketStats market={market} />
          <MarketRates market={market} />

          {/* Actions Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Actions</h2>
            
            <ActionTabs 
              selectedAction={actions.selectedAction}
              onActionSelect={actions.setSelectedAction}
            />

            {/* Action Forms */}
            <div className="p-4 border border-gray-200 rounded-lg">
              {!isConnected ? (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">Connect your wallet to interact with this market</p>
                  <ConnectWalletButton />
                </div>
              ) : (
                <>
                  {actions.selectedAction === 'lend' && (
                    <>
                      {isSfrxUSDMarket ? (
                        <SfrxUSDLendingActions
                          market={market}
                          lendAmount={actions.lendAmount}
                          setLendAmount={actions.setLendAmount}
                          maxAmount={balances.asset}
                          onLend={() => {
                            console.log('Lend sfrxUSD clicked', actions.lendAmount);
                          }}
                        />
                      ) : (
                        <LendForm
                          market={market}
                          assetSymbol={assetSymbol}
                          amount={actions.lendAmount}
                          maxAmount={balances.asset}
                          onAmountChange={actions.setLendAmount}
                          onSubmit={() => {
                            console.log('Lend clicked', actions.lendAmount);
                          }}
                        />
                      )}
                    </>
                  )}

                  {actions.selectedAction === 'withdraw' && (
                    <WithdrawForm
                      assetSymbol={assetSymbol}
                      amount={actions.withdrawAmount}
                      maxAmount={balances.lendingPosition}
                      onAmountChange={actions.setWithdrawAmount}
                      onSubmit={() => {
                        console.log('Withdraw clicked', actions.withdrawAmount);
                      }}
                    />
                  )}

                  {actions.selectedAction === 'repay' && (
                    <RepayForm
                      assetSymbol={assetSymbol}
                      collateralSymbol={collateralSymbol}
                      repayAmount={actions.repayAmount}
                      maxRepayAmount={balances.borrowingPosition}
                      withdrawAmount={actions.withdrawCollateralAmount}
                      maxWithdrawAmount={balances.collateral}
                      onRepayAmountChange={actions.setRepayAmount}
                      onWithdrawAmountChange={actions.setWithdrawCollateralAmount}
                      onSubmit={() => {
                        console.log('Repay clicked', {
                          repay: actions.repayAmount,
                          withdraw: actions.withdrawCollateralAmount
                        });
                      }}
                    />
                  )}

                  {actions.selectedAction === 'borrow' && (
                    <BorrowForm
                      assetSymbol={assetSymbol}
                      collateralSymbol={collateralSymbol}
                      collateralAmount={actions.collateralAmount}
                      maxCollateralAmount={balances.collateral}
                      borrowAmount={actions.borrowAmount}
                      maxBorrowAmount={market.accounting.totalAssetAmount}
                      onCollateralAmountChange={actions.setCollateralAmount}
                      onBorrowAmountChange={actions.setBorrowAmount}
                      onSubmit={() => {
                        console.log('Borrow clicked', {
                          collateral: actions.collateralAmount,
                          borrow: actions.borrowAmount
                        });
                      }}
                    />
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