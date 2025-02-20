import { useState } from 'react';
import type { Market } from '../store/marketsSlice';

export type ActionType = 'lend' | 'withdraw' | 'repay' | 'borrow';

export function useMarketActions(initialAction: ActionType = 'lend') {
  const [selectedAction, setSelectedAction] = useState<ActionType>(initialAction);
  const [lendAmount, setLendAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [withdrawCollateralAmount, setWithdrawCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');

  return {
    // Current action
    selectedAction,
    setSelectedAction,

    // Amount states
    lendAmount,
    setLendAmount,
    withdrawAmount,
    setWithdrawAmount,
    repayAmount,
    setRepayAmount,
    withdrawCollateralAmount,
    setWithdrawCollateralAmount,
    borrowAmount,
    setBorrowAmount,
    collateralAmount,
    setCollateralAmount,
  };
} 