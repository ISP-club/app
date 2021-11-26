<template>
  <q-dialog
    v-model="modelValue"
    @before-show="onShowExchangeDialog"
    position="bottom"
  >
    <q-card style="background-color: transparent; width: 400px;">
      <q-card-section class="row items-center q-pa-none" style="background: rgba(24, 24, 24, 0.65); border-radius: 15px 15px 0 0 !important;">
        <div class="text-subtitle1 text-weight-bold q-pa-md">Обмен {{ currency.code.toUpperCase() }}</div>
        <q-space />
        <q-btn class="q-ma-md" icon="close" flat round dense @click="closeDialog" />
      </q-card-section>
      <q-card-section v-if="pair" style="max-height: 500px; background: rgba(24, 24, 24, 0.65);" class="scroll q-pl-md q-pr-md q-pb-md q-mt-none">
        <div v-if="type === 'buy'">
          <div class="q-gutter-y-md column">
            <q-select
              color='secondary'
              outlined
              square
              emit-value
              map-options
              v-model="pair"
              :options="pairs"
              label="Валюта"
            />

            <q-input
              v-model="buyTotal"
              :suffix="selectedPair.quote.code.toUpperCase()"
              type="text"
              square
              outlined
              readonly
              color="secondary"
              label="Отдаете"
            />

            <q-input
              v-model="buyVolume"
              :suffix="selectedPair.base.code.toUpperCase()"
              type="text"
              square
              outlined
              color="secondary"
              label="Получаете"
            />

            <q-input
              v-if="+buyRateMarket === +buyRateMarketShort"
              v-model="buyRateMarketShort"
              :suffix="selectedPair.quote.code.toUpperCase()"
              type="text"
              square
              outlined
              readonly
              label="Курс"
            />
            <q-input
              v-else
              v-model="buyRateMarketShort"
              prefix="~"
              :suffix="selectedPair.quote.code.toUpperCase()"
              type="text"
              square
              outlined
              readonly
              label="Курс"
            />

            <div class="row q-col-gutter-x-md">
              <div class="col-6">
                <q-input
                  v-model="selectedPair.feeBuy"
                  type="text"
                  suffix="%"
                  square
                  outlined
                  readonly
                  color="secondary"
                  label="Комиссия"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="buyFeeVolume"
                  :suffix="selectedPair.quote.code.toUpperCase()"
                  type="text"
                  square
                  outlined
                  readonly
                  color="secondary"
                  label="Сумма комиссии"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-if="type === 'sell'">
          <div class="q-gutter-y-md column">
            <q-select
              color='secondary'
              outlined
              square
              emit-value
              map-options
              v-model="pair"
              :options="pairs"
              label="Валюта"
            />

            <q-input
              v-model="sellVolume"
              :suffix="selectedPair.base.code.toUpperCase()"
              type="text"
              square
              outlined
              color="secondary"
              label="Отдаете"
            />

            <q-input
              v-model="sellTotal"
              :suffix="selectedPair.quote.code.toUpperCase()"
              type="text"
              square
              outlined
              readonly
              color="secondary"
              label="Получаете"
            />

            <q-input
              v-if="+sellRateMarket === +sellRateMarketShort"
              v-model="sellRateMarketShort"
              :suffix="selectedPair.quote.code.toUpperCase()"
              type="text"
              square
              outlined
              readonly
              label="Курс"
            />
            <q-input
              v-else
              v-model="sellRateMarketShort"
              prefix="~"
              :suffix="selectedPair.quote.code.toUpperCase()"
              type="text"
              square
              outlined
              readonly
              label="Курс"
            />

            <div class="row q-col-gutter-x-md">
              <div class="col-6">
                <q-input
                  v-model="selectedPair.feeSell"
                  type="text"
                  suffix="%"
                  square
                  outlined
                  readonly
                  color="secondary"
                  label="Комиссия"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="sellFeeVolume"
                  :suffix="selectedPair.base.code.toUpperCase()"
                  type="text"
                  square
                  outlined
                  readonly
                  color="secondary"
                  label="Сумма комиссии"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section v-else style="max-height: 500px; background: rgba(24, 24, 24, 0.65);" class="scroll q-pl-md q-pr-md q-pb-md q-mt-none">
        <q-select
          color='secondary'
          outlined
          square
          emit-value
          map-options
          v-model="pair"
          :options="pairs"
          label="Валюта"
        />
      </q-card-section>
      <q-card-actions style="max-height: 500px; background: rgba(24, 24, 24, 0.65);">
        <q-btn unelevated color="secondary" text-color="black" class="full-width rounded-borders" label="Обменять" size="20px" no-caps v-ripple @click="postExchange" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRef,
  PropType,
  computed,
  watch,
} from 'vue';

import {
  OrderType,
  OrderRateType
} from 'src/enum/order';

import { Notify } from 'quasar';
import { api } from 'boot/axios'
import { useStore } from 'src/store'

import { WalletInterface } from 'src/interfaces/wallet'
import { PairInterface } from 'src/interfaces/trade';

export default defineComponent({
  name: 'ExchangeDialog',
  props: {
    modelValue: Boolean,
    currency: Object as PropType<WalletInterface>
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currency = toRef(props, 'currency');
    const store = useStore();

    const pairs = computed(() => {
      // @ts-ignore
      return (<PairInterface[]>store.getters['trade/currencyPairs'](currency.value.id)).map((pair) => {
        return {
          value: pair._id,
          // @ts-ignore
          label: (pair.base._id === currency.value.id ? pair.quote.code : pair.base.code).toUpperCase(),
        };
      });
    });
    const pair = ref<string|null>(null);
    const selectedPair = computed(() => {
      const pairs = <PairInterface[]>store.getters['trade/pairs'];
      return pair.value ? pairs.find((pairData: PairInterface) => pairData._id === pair.value) : null;
    });
    const type = computed(() => {
      const pairs = <PairInterface[]>store.getters['trade/pairs'];
      const selectedPair = pair.value ? pairs.find((pairData: PairInterface) => pairData._id === pair.value) : null;
      // @ts-ignore
      return selectedPair ? currency.value.id == selectedPair.base._id ? OrderType.Sell : OrderType.Buy : null;
    });

    const buyVolume = ref<number>(0);
    const buyRateMarket = computed(() => store.getters['trade/marketRate'](selectedPair.value, OrderType.Sell, buyVolume.value));
    // @ts-ignore
    const buyRateMarketShort = computed(() => buyRateMarket.value.toFixed(selectedPair.value.quote.decimal));
    const buyFeeVolume = ref<number>(0);
    const buyTotal = ref<number>(0);

    const sellVolume = ref<number>(0);
    const sellRateMarket = computed(() => store.getters['trade/marketRate'](selectedPair.value, OrderType.Buy, sellVolume.value));
    // @ts-ignore
    const sellRateMarketShort = computed(() => sellRateMarket.value.toFixed(selectedPair.value.quote.decimal));
    const sellFeeVolume = ref<number>(0);
    const sellTotal = ref<number>(0);

    const gaussRound = (number: number, digits: number) => {
      const d = digits || 0,
        m = Math.pow(10, d),
        n = +(d ? number * m : number).toFixed(8),
        i = Math.floor(n), f = n - i,
        e = 1e-8,
        r = (f > 0.5 - e && f < 0.5 + e)
          ? ((i % 2 == 0) ? i : i + 1) : Math.round(n);

      return d ? r / m : r
    };
    const closeDialog = () => emit('update:modelValue', false);
    const exchangeValidation = () => {
      if (!selectedPair.value) {
        Notify.create({
          position: 'top',
          message: 'Валюта не выбрана'
        });
        return;
      }

      switch (type.value) {
        case OrderType.Sell:
          if (!sellVolume.value) {
            Notify.create({
              position: 'top',
              message: 'Сумма не определена'
            });
            return;
          }

          // @ts-ignore
          if (currency.value.balance.available < sellTotal.value) {
            Notify.create({
              position: 'top',
              message: 'Сумма превышает допустимую'
            });
            return;
          }

          if (selectedPair.value.minSell > sellTotal.value) {
            Notify.create({
              position: 'top',
              message: 'Сумма меньше минимальной'
            });
            return;
          }
          break;
        case OrderType.Buy:
          if (!buyVolume.value) {
            Notify.create({
              position: 'top',
              message: 'Сумма не определена'
            });
            return;
          }
          // @ts-ignore
          if (currency.value.balance.available < buyTotal.value) {
            Notify.create({
              position: 'top',
              message: 'Сумма превышает допустимую'
            });
            return;
          }
          if (selectedPair.value.minBuy > sellTotal.value) {
            Notify.create({
              position: 'top',
              message: 'Сумма меньше минимальной'
            });
            return;
          }
          break;
      }

      postExchange();
    };
    const onShowExchangeDialog = () => {
      buyVolume.value = 0;
      buyFeeVolume.value = 0;
      buyTotal.value = 0;
      sellVolume.value = 0;
      sellFeeVolume.value = 0;
      sellTotal.value = 0;
      pair.value = null;
    };
    const updateBuyForm = (): void => {
      if (!buyVolume.value) {
        buyFeeVolume.value = 0;
        buyTotal.value = 0;
        return;
      }

      // @ts-ignore
      const amount = gaussRound(buyRateMarket.value * buyVolume.value, selectedPair.value.base.decimal);
      // @ts-ignore
      const fee = (amount / 100) * selectedPair.value.feeBuy;
      const total = amount + fee;

      // @ts-ignore
      buyFeeVolume.value = gaussRound(fee, selectedPair.value.quote.decimal);
      // @ts-ignore
      buyTotal.value = gaussRound(total, selectedPair.value.quote.decimal);
    };
    const updateSellForm = (): void => {
      if (!sellVolume.value) {
        sellFeeVolume.value = 0;
        sellTotal.value = 0;
        return;
      }

      // @ts-ignore
      const amount = gaussRound(sellRateMarket.value * sellVolume.value, selectedPair.value.quote.decimal);
      const feeRate = sellRateMarket.value;
      // @ts-ignore
      const fee = (sellVolume.value / 100) * selectedPair.value.feeSell;
      const total = amount - (fee * feeRate);

      // @ts-ignore
      sellFeeVolume.value = gaussRound(fee, selectedPair.value.base.decimal).toFixed(selectedPair.value.base.decimal);
      // @ts-ignore
      sellTotal.value = gaussRound(total, selectedPair.value.quote.decimal).toFixed(selectedPair.value.quote.decimal);
    };
    const postExchange = () => api({
      url: 'exchange/user/order',
      method: 'post',
      data: {
        type: type.value,
        pair: pair.value,
        rateType: OrderRateType.Market,
        volume: type.value == OrderType.Sell ? sellVolume.value : buyVolume.value
      },
    })
      .then(response => {
        switch (response.status) {
          case 201:
            Notify.create({
              position: 'top',
              message: 'Заявка успешно отправлена'
            });
            closeDialog();
            break;
        }
      });

    watch(buyVolume, () => updateBuyForm());
    watch(sellVolume, () => updateSellForm());
    watch(pair, () => {
      updateBuyForm();
      updateSellForm();
    });

    return {
      pairs,
      pair,
      selectedPair,
      type,
      buyVolume,
      buyRateMarket,
      buyRateMarketShort,
      buyFeeVolume,
      buyTotal,
      sellVolume,
      sellRateMarket,
      sellRateMarketShort,
      sellFeeVolume,
      sellTotal,
      postExchange,
      onShowExchangeDialog,
      exchangeValidation,
      closeDialog,
    };
  }
});
</script>
