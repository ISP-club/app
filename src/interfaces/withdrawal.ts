import {
  WithdrawalFiatMethod
} from 'src/enum/withdrawal';

export interface WithdrawalRequestInterface {
  amount: number;
  address?: string;
  fiatMethod?: WithdrawalFiatMethod;
  fiatCard?: number;
}
