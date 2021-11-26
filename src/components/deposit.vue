<template>
  <q-dialog
    v-model="modelValue"
    @before-show="onShowDepositDialog"
    position="bottom"
  >
    <q-card style="background-color: transparent; width: 400px;">
      <q-card-section class="row items-center q-pa-none" style="background: rgba(24, 24, 24, 0.65); border-radius: 15px 15px 0 0 !important;">
        <div class="text-subtitle1 text-weight-bold q-pa-md">Пополнение {{ currency.code.toUpperCase() }}</div>
        <q-space />
        <q-btn class="q-ma-md" icon="close" flat round dense @click="closeDialog" />
      </q-card-section>
      <q-card-section style="max-height: 500px; background: rgba(24, 24, 24, 0.65);" class="scroll q-pl-md q-pr-md q-pb-md q-mt-none">
        <div v-if="depositResponse && currency.provider === 'bitcoin'">
          <qrcode-vue :value="depositResponse.address" style='width: 100%; height: 100%'></qrcode-vue>
          <q-input outlined readonly bottom-slots v-model="depositResponse.address" label="Адрес" class="q-mt-md">
            <template v-slot:append>
              <q-icon name="fas fa-copy" class="cursor-pointer" @click="copyAddressToClipboard(depositResponse.address)">
                <q-tooltip>
                  Скопировать
                </q-tooltip>
              </q-icon>
            </template>
            <template v-slot:hint>
              Минимальная сумма депозита: {{ currency.minDeposit }} {{ currency.code.toUpperCase() }}
            </template>
          </q-input>
        </div>
        <div v-if="depositResponse && currency.provider === 'ethereum'">
          <qrcode-vue :value="depositResponse.address" style='width: 100%; height: 100%'></qrcode-vue>
          <q-input outlined readonly bottom-slots v-model="depositResponse.address" label="Адрес" class="q-mt-md">
            <template v-slot:append>
              <q-icon name="fas fa-copy" class="cursor-pointer" @click="copyAddressToClipboard(depositResponse.address)">
                <q-tooltip>
                  Скопировать
                </q-tooltip>
              </q-icon>
            </template>
            <template v-slot:hint>
              Минимальная сумма депозита: {{ currency.minDeposit }} {{ currency.code.toUpperCase() }}
            </template>
          </q-input>
        </div>
        <div v-if="depositResponse && currency.provider === 'ethereumErc20'">
          <qrcode-vue :value="depositResponse.address" style='width: 100%; height: 100%'></qrcode-vue>
          <q-input outlined readonly bottom-slots v-model="depositResponse.address" label="Адрес" class="q-mt-md">
            <template v-slot:append>
              <q-icon name="fas fa-copy" class="cursor-pointer" @click="copyAddressToClipboard(depositResponse.address)">
                <q-tooltip>
                  Скопировать
                </q-tooltip>
              </q-icon>
            </template>
            <template v-slot:hint>
              Минимальная сумма депозита: {{ currency.minDeposit }} {{ currency.code.toUpperCase() }}
            </template>
          </q-input>
        </div>
        <div v-if="depositResponse && currency.provider === 'umi'">
          <qrcode-vue :value="depositResponse.address" style='width: 100%; height: 100%'></qrcode-vue>
          <q-input outlined readonly bottom-slots v-model="depositResponse.address" label="Адрес" class="q-mt-md">
            <template v-slot:append>
              <q-icon name="fas fa-copy" class="cursor-pointer" @click="copyAddressToClipboard(depositResponse.address)">
                <q-tooltip>
                  Скопировать
                </q-tooltip>
              </q-icon>
            </template>
            <template v-slot:hint>
              Минимальная сумма депозита: {{ currency.minDeposit }} {{ currency.code.toUpperCase() }}
            </template>
          </q-input>
        </div>
        <div v-if="currency.provider === 'fiat'">
          <q-card-section>
            <div class="q-gutter-y-md column">
              <q-select
                outlined
                square
                emit-value
                map-options
                v-model="depositRequest.fiatMethod"
                :options="[{
              label: 'Наличными в офисе в Москве',
              value: 'cash'
            },
            {
              label: 'Банковская карта',
              value: 'card'
            }]"
                label="Способ вывода"
                color='secondary'
              />
              <q-input
                v-if="depositRequest.fiatMethod === 'card'"
                outlined
                square
                v-model="depositRequest.fiatCard"
                label="Номер карты"
                color='secondary'
              />
              <q-input outlined square bottom-slots v-model="depositRequest.amount" label="Сумма" color='secondary'>
                <template v-slot:append>
                  <q-btn
                    unelevated
                    text-color="secondary"
                    style="width: 40px"
                    icon="fas fa-wallet"
                    @click="depositRequest.amount = currency.balance.available"
                  ></q-btn>
                </template>
                <template v-slot:hint>
                  Мин: {{ currency.minDeposit }} {{ currency.code.toUpperCase() }}
                </template>
              </q-input>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn unelevated color="secondary" text-color="black" class="full-width rounded-borders" label="Пополнить" size="20px" no-caps v-ripple @click="depositValidation" />
          </q-card-actions>
        </div>
        <div v-if="depositResponse && currency.provider === 'qiwi'">
          <q-banner class="text-white bg-orange">
            Временно недоступно
          </q-banner>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRef,
  PropType,
} from 'vue';

import { copyToClipboard, Notify } from 'quasar';
import { api } from 'boot/axios'
import QrcodeVue from 'qrcode.vue'

import {
  DepositRequestInterface,
  DepositBitcoinInterface,
  DepositEthereumInterface,
  DepositEthereumErc20Interface,
  DepositUmiInterface,
  DepositFiatInterface,
  DepositQiwiInterface,
} from 'src/interfaces/deposit';

import { WalletInterface } from 'src/interfaces/wallet'
import { DepositFiatMethod } from 'src/enum/deposit';

export default defineComponent({
  name: 'DepositDialog',
  components: {
    QrcodeVue
  },
  props: {
    modelValue: Boolean,
    currency: Object as PropType<WalletInterface>
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currency = toRef(props, 'currency');
    // @ts-ignore
    const defaultDepositRequest = (): DepositRequestInterface  => <DepositRequestInterface>{
      amount: 0,
      fiatMethod: DepositFiatMethod.Cash,
      fiatCard: '',
    };
    const depositRequest = ref<DepositRequestInterface>(defaultDepositRequest());
    const depositResponse = ref<
      | DepositBitcoinInterface
      | DepositEthereumInterface
      | DepositEthereumErc20Interface
      | DepositUmiInterface
      | DepositFiatInterface
      | DepositQiwiInterface
      >();
    const closeDialog = () => emit('update:modelValue', false);
    const depositValidation = () => {
      let request: DepositRequestInterface = {};

      // @ts-ignore
      if (currency.value.provider === 'fiat') {
        request.amount = depositRequest.value.amount;
        // @ts-ignore
        if (depositRequest.value.fiatMethod === DepositFiatMethod.Card && depositRequest.value.fiatCard === '') {
          Notify.create({
            position: 'top',
            message: 'Номер карты не введен'
          });
          return;
        }
        request.fiatMethod = depositRequest.value.fiatMethod;
        if (depositRequest.value.fiatMethod === DepositFiatMethod.Card)
          request.fiatCard = depositRequest.value.fiatCard;
      }

      postDeposit(request);
    };
    const onShowDepositDialog = () => {
      // @ts-ignore
      if (currency.value.provider === 'fiat') {
        const depositData: DepositRequestInterface = defaultDepositRequest();
        depositRequest.value.amount = depositData.amount;
        depositRequest.value.fiatMethod = depositData.fiatMethod;
        depositRequest.value.fiatCard = depositData.fiatCard;
      } else {
        postDeposit({});
      }
    };
    // @ts-ignore
    const copyAddressToClipboard = (data: string) => copyToClipboard(data);
    const postDeposit = (data: DepositRequestInterface) => api({
      // @ts-ignore
      url: 'exchange/user/deposit/' + currency.value.id,
      method: 'post',
      data,
    })
      .then(response => {
        switch (response.status) {
          case 201:
            depositResponse.value = <
              | DepositBitcoinInterface
              | DepositEthereumInterface
              | DepositEthereumErc20Interface
              | DepositUmiInterface
              | DepositFiatInterface
              | DepositQiwiInterface
              >response.data;

            // @ts-ignore
            if (currency.value.provider === 'fiat' && depositRequest.value.fiatMethod === DepositFiatMethod.Cash) {
              Notify.create({
                position: 'top',
                message: 'Заявка отправлена'
              });
              closeDialog();
            }

            // @ts-ignore
            if (currency.value.provider === 'fiat' && depositRequest.value.fiatMethod === DepositFiatMethod.Card) {
              Notify.create({
                position: 'top',
                message: 'Выполняется перенаправление'
              });
              closeDialog();
              // @ts-ignore
              document.location.href = depositResponse.value.payUrl
            }
            break;
        }
      });

    return {
      depositRequest,
      depositResponse,
      onShowDepositDialog,
      depositValidation,
      closeDialog,
      copyAddressToClipboard,
    };
  }
});
</script>
