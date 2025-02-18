import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SerializedPairAccounting } from '../types';

export interface Market {
  id: string;
  assetName: string;
  assetLogo: string;
  collateralName: string;
  collateralLogo: string;
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