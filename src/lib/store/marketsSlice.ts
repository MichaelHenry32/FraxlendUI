import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SerializedPairAccounting } from '../types';

interface TokenData {
  address: `0x${string}`;
  name: string;
  symbol: string;
  logo: string;
}

export interface Market {
  id: string;
  asset: TokenData;
  collateral: TokenData;
  borrowingCost: number;
  lendingYield: number;
  accounting: SerializedPairAccounting;
}

interface MarketsState {
  markets: Market[];
  viewMode: 'borrowing' | 'lending';
}

const initialState: MarketsState = {
  markets: [],
  viewMode: 'borrowing',
};

export const marketsSlice = createSlice({
  name: 'markets',
  initialState,
  reducers: {
    setMarkets: (state, action: PayloadAction<Market[]>) => {
      state.markets = action.payload;
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'borrowing' ? 'lending' : 'borrowing';
    },
  },
});

export const { setMarkets, toggleViewMode } = marketsSlice.actions;
export default marketsSlice.reducer; 