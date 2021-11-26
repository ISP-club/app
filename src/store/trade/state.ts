import { PairInterface, DepthOrderInterface } from 'src/interfaces/trade';

export interface TradeStateInterface {
  pairs: PairInterface[];
  depth: DepthOrderInterface[];
}

function state(): TradeStateInterface {
  return {
    pairs: [],
    depth: []
  }
}

export default state;
