import { MutationTree } from 'vuex';
import { TradeStateInterface } from './state';

import { PairInterface, DepthOrderInterface } from 'src/interfaces/trade';

const mutation: MutationTree<TradeStateInterface> = {
  SOCKET_TRADE_PAIRS (state: TradeStateInterface, payload: PairInterface[]) {
    state.pairs = payload;
  },
  SOCKET_TRADE_DEPTH (state: TradeStateInterface, payload: DepthOrderInterface[]) {
    state.depth = payload;
  }
};

export default mutation;
