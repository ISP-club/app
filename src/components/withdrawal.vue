<template>
  <q-dialog
    v-model="modelValue"
    @before-show="onShowWithdrawalDialog"
    position="bottom"
  >
    <q-card style="background-color: transparent; width: 400px;">
      <q-card-section class="row items-center q-pa-none" style="background: rgba(24, 24, 24, 0.65); border-radius: 15px 15px 0 0 !important;">
        <div class="text-subtitle1 text-weight-bold q-pa-md">Вывод {{ currency.code.toUpperCase() }}</div>
        <q-space />
        <q-btn class="q-ma-md" icon="close" flat round dense @click="closeDialog" />
      </q-card-section>
      <q-card-section style="max-height: 500px; background: rgba(24, 24, 24, 0.65);" class="scroll q-pl-md q-pr-md q-pb-md q-mt-none" v-if="[
        'bitcoin',
        'ethereum',
        'ethereumErc20',
        'umi',
        ].includes(currency.provider)">
        <div class="q-gutter-y-md column">
          <q-input outlined square v-model="withdrawal.address" label="Адрес вывода" color='secondary' />
          <q-input outlined square bottom-slots v-model="withdrawal.amount" label="Сумма" color='secondary'>
            <template v-slot:append>
              <q-btn
                unelevated
                text-color="secondary"
                style="width: 40px"
                icon="fas fa-wallet"
                @click="withdrawal.amount = currency.balance.available"
              ></q-btn>
            </template>
            <template v-slot:hint>
              Мин: {{ currency.minWithdrawal }} {{ currency.code.toUpperCase() }}, макс: {{ currency.balance.available }} {{ currency.code.toUpperCase() }}
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-section style="max-height: 500px; background: rgba(24, 24, 24, 0.65);" class="scroll q-pl-md q-pr-md q-pb-md q-mt-none" v-if="currency.provider === 'fiat'">
        <div class="q-gutter-y-md column">
          <q-select
            color='secondary'
            outlined
            square
            emit-value
            map-options
            v-model="withdrawal.fiatMethod"
            :options="[{
              label: 'Наличными в офисе в Москве',
              value: 'cash'
            },
            {
              label: 'Банковская карта',
              value: 'card'
            }]"
            label="Способ вывода"
          />
          <q-input
            color='secondary'
            v-if="withdrawal.fiatMethod === 'card'"
            outlined
            square
            v-model="withdrawal.fiatCard"
            label="Номер карты"
          />
          <q-input outlined square bottom-slots v-model="withdrawal.amount" label="Сумма" color='secondary'>
            <template v-slot:append>
              <q-btn
                unelevated
                text-color="secondary"
                style="width: 40px"
                icon="fas fa-wallet"
                @click="withdrawal.amount = currency.balance.available"
              ></q-btn>
            </template>
            <template v-slot:hint>
              Мин: {{ currency.minWithdrawal }} {{ currency.code.toUpperCase() }}, макс: {{ currency.balance.available }} {{ currency.code.toUpperCase() }}
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-section style="max-height: 500px; background: rgba(24, 24, 24, 0.65);" class="scroll q-pl-md q-pr-md q-pb-md q-mt-none" v-if="currency.provider === 'qiwi'">
        <q-banner class="text-white bg-orange">
          Временно недоступно
        </q-banner>
      </q-card-section>
      <q-card-section style="background: rgba(24, 24, 24, 0.75);">
        <div class="row q-col-gutter-x-md">
          <q-input class="col" outlined square v-model="fee" label="Комиссия" :suffix="currency.code.toUpperCase()" disable />
          <q-input class="col" outlined square v-model="total" label="Сумма выплаты" :suffix="currency.code.toUpperCase()" disable />
        </div>
      </q-card-section>
      <q-card-actions style="background: rgba(24, 24, 24, 0.65);">
        <q-btn
          unelevated
          color="secondary"
          text-color="black"
          class="full-width rounded-borders"
          label="Вывести"
          size="20px"
          no-caps
          v-ripple
          @click="withdrawalValidation"
          :disable="total === 0 || total > currency.balance.available"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref, toRef, PropType, watch
} from 'vue';

import { Notify } from 'quasar'
import { api } from 'boot/axios'

import { WithdrawalRequestInterface } from 'src/interfaces/withdrawal';
import { WalletInterface } from 'src/interfaces/wallet'
import { WithdrawalFiatMethod } from 'src/enum/withdrawal';

export default defineComponent({
  name: 'WithdrawalDialog',
  props: {
    modelValue: Boolean,
    currency: Object as PropType<WalletInterface>
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currency = toRef(props, 'currency');
    // @ts-ignore
    const defaultWithdrawal = (): WithdrawalRequestInterface  => <WithdrawalRequestInterface>{
      amount: 0,
      address:'',
      fiatMethod: WithdrawalFiatMethod.Cash,
      fiatCard: '',
    };
    const withdrawal = ref<WithdrawalRequestInterface>(defaultWithdrawal());
    // @ts-ignore
    const fee = ref<number>(currency.value.feeWithdrawal.toFixed(currency.value.decimal));
    const total = ref<number>(0);

    watch(withdrawal.value, (value: WithdrawalRequestInterface) => {
      const totalValue: number = value.amount ? value.amount - fee.value : 0;
      // @ts-ignore
      total.value = totalValue > 0 ? gaussRound(totalValue, currency.value.decimal).toFixed(currency.value.decimal) : 0;
    });

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
    const onShowWithdrawalDialog = () => {
      const withdrawalData: WithdrawalRequestInterface = defaultWithdrawal();
      withdrawal.value.amount = withdrawalData.amount;
      withdrawal.value.address = withdrawalData.address;
      withdrawal.value.fiatMethod = withdrawalData.fiatMethod;
      withdrawal.value.fiatCard = withdrawalData.fiatCard;
    };
    const closeDialog = () => emit('update:modelValue', false);
    const withdrawalValidation = () => {
      let request: WithdrawalRequestInterface = {
        amount: withdrawal.value.amount
      };
      // @ts-ignore
      switch (currency.value.provider) {
        case 'bitcoin':
        case 'ethereum':
        case 'ethereumErc20':
        case 'umi':
        case 'qiwi':
          if (withdrawal.value.address === '') {
            Notify.create({
              position: 'top',
              message: 'Адрес не введен'
            });
            return;
          }
          request.address = withdrawal.value.address;
          break;
        case 'fiat':
          // @ts-ignore
          if (withdrawal.value.fiatMethod === WithdrawalFiatMethod.Card && withdrawal.value.fiatCard === '') {
            Notify.create({
              position: 'top',
              message: 'Номер карты не введен'
            });
            return;
          }
          request.fiatMethod = withdrawal.value.fiatMethod;
          if (withdrawal.value.fiatMethod === WithdrawalFiatMethod.Card)
            request.fiatCard = withdrawal.value.fiatCard;
          break;
      }

      postWithdrawal(request);
    };
    const postWithdrawal = (data: WithdrawalRequestInterface) => api({
      // @ts-ignore
      url: 'exchange/user/withdrawal/' + currency.value.id,
      method: 'post',
      data,
    })
      .then(response => {
        switch (response.status) {
          case 201:
            Notify.create({
              position: 'top',
              message: 'Заявка на вывод отправлена'
            });
            closeDialog();
            break;
        }
      });

    return { withdrawal, onShowWithdrawalDialog, withdrawalValidation, closeDialog, fee, total };
  }
});
</script>
