import { TxInterface } from 'src/interfaces/trade';

export interface WalletInterface {
  id: string,
  code: string,
  decimal: number,
  minDeposit: number,
  minWithdrawal: number,
  feeWithdrawal: number,
  balance: WalletBalanceInterface
}

export interface WalletDetailsInterface {
  wallet: WalletInterface;
  tx: TxInterface[];
}

export interface WalletBalanceInterface {
  available: number,
  hold: number
}
