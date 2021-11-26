import {
  DepositState,
  DepositFiatMethod,
} from 'src/enum/deposit';

export interface DepositRequestInterface {
  amount?: number;
  fiatMethod?: DepositFiatMethod;
  fiatCard?: number;
}

export interface DepositBitcoinInterface {
  _id: string;
  user: string;
  currency: string;
  state: DepositState;
  address: string;
  created: Date;
}

export interface DepositEthereumInterface {
  _id: string;
  user: string;
  currency: string;
  state: DepositState;
  address: string;
  created: Date;
}

export interface DepositEthereumErc20Interface {
  _id: string;
  user: string;
  currency: string;
  state: DepositState;
  address: string;
  created: Date;
}

export interface DepositUmiInterface {
  _id: string;
  user: string;
  currency: string;
  state: DepositState;
  address: string;
  seed: number[];
  created: Date;
}

export interface DepositFiatInterface {
  _id: string;
  user: string;
  currency: string;
  state: DepositState;
  amount: number;
  method: DepositFiatMethod;
  card?: string;
  payUrl?: string;
  created: Date;
}

export interface DepositQiwiInterface {
  _id: string;
  user: string;
  currency: string;
  state: DepositState;
  address: string;
  created: Date;
}
