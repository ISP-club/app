import {
  OrderType,
} from 'src/enum/order';

import {
  TxType,
  TxAction,
  TxState
} from 'src/enum/tx';

export interface CurrencyInterface {
  _id: string,
  state: string,
  provider: string,
  code: string,
  decimal: number,
  minDeposit: number,
  minWithdrawal: number,
  feeWithdrawal: number
}

export interface PairInterface {
  _id: string,
  state: string,
  base: CurrencyInterface,
  quote: CurrencyInterface,
  minBuy: number,
  minSell: number,
  feeBuy: number,
  feeSell: number,
  rateValue: number;
  rateDirection: string;
  liquidity: string[],
  chart: string,
}

export interface DepthOrderInterface {
  code: string;
  type: OrderType;
  volume: number;
  rate: number;
}

export interface TxInterface {
  user: string;
  currency: string;
  type: TxType;
  action: TxAction;
  state: TxState;
  amount: number;
  fee: number;
  details: string;
}
