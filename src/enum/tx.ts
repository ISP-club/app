export enum TxAction {
  Adjustment = 'adjustment',
  Withdrawal = 'withdrawal',
  Deposit = 'deposit',
  Exchange = 'exchange',
}

export enum TxState {
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

export enum TxType {
  In = 'in',
  Out = 'out',
}
