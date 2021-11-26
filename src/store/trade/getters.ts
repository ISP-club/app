import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TradeStateInterface } from './state';

import { PairInterface, DepthOrderInterface } from 'src/interfaces/trade';

import { OrderType } from 'src/enum/order';

const getters: GetterTree<TradeStateInterface, StateInterface> = {
  pairs (state: TradeStateInterface): PairInterface[] {
    return state.pairs;
  },
  currencyPairs: (state: TradeStateInterface) => (currency: string): PairInterface[] => {
    return state.pairs.filter(pair => pair.base._id === currency || pair.quote._id === currency);
  },
  marketRate: (state: TradeStateInterface) => (pair: PairInterface, type: OrderType, volume: number): number => {
    let orders: DepthOrderInterface[] = state.depth.filter(order => order.type === type && order.code === pair.base.code + pair.quote.code);
    if (type === OrderType.Sell) orders = orders.reverse();
    const totalVolume: number = orders.map(order => order.volume).reduce((a, b) => a + b, 0);

    let orderVolume = +volume;
    let amount = [];

    if (!orderVolume) return 0;
    if (orderVolume <= 0) return 0;
    if (orderVolume > totalVolume) return 0;

    for (let i = 0; i < orders.length; i++) {
      if (orderVolume <= orders[i].volume) {
        amount.push(orderVolume * orders[i].rate);
        break;
      } else {
        amount.push(orders[i].volume * orders[i].rate);
        orderVolume -= orders[i].volume;
      }
    }

    const totalAmount = amount.reduce((a, b) => a + b, 0);
    return totalAmount / +volume;
  },
};

export default getters;
