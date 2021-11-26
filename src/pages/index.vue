<template>
  <q-page>
    <!-- Wallets -->
    <q-pull-to-refresh @refresh="getWallets" color='black'>
      <q-intersection transition="scale" once style='width: 100%'>
      <div class="row items-center" style="min-height: inherit; width: 100%; position: absolute; background-image: url(/bg/3.png) !important; background-repeat: no-repeat !important; background-size: auto 100% !important; height: 100vh !important;">
        <q-carousel
          v-model="defaultWallet"
          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          control-color="white"
          padding
          arrows
          infinite
          height="300px"
          class="bg-transparent text-white q-ma-none"
          style='width: 100%'
          dark
        >
          <q-carousel-slide
            :name="wallet.id"
            class="column no-wrap flex-center cursor-pointer"
            v-for="wallet in wallets"
            :key="wallet.id"
            clickable
            bordered
            flat
            v-ripple
            @click="getWallet(wallet.id)"
          >
            <q-card flat style='background: transparent; width: 100%;'>
              <q-card-section>
                <div class="row q-col-gutter-md text-center">
                  <div class="col-12">
                    <q-avatar v-if="wallet.code === 'umi'" rounded style='border-radius: 10px; width: 90px; height: 90px; background: rgba(51, 170, 51, .05)'>
                      <q-img src="coins/umi.png"></q-img>
                    </q-avatar>
                    <q-avatar v-if="wallet.code === 'umis'" rounded style='border-radius: 10px; width: 90px; height: 90px; background: rgba(51, 170, 51, .05)'>
                      <q-img src="coins/umi.png"></q-img>
                    </q-avatar>
                    <q-avatar v-if="wallet.code === 'eth'" rounded style='border-radius: 10px; width: 90px; height: 90px; background: rgba(51, 170, 51, .05)'>
                      <q-icon name="fab fa-ethereum" size="60px" color='secondary'></q-icon>
                    </q-avatar>
                    <q-avatar v-if="wallet.code === 'rub'" rounded style='border-radius: 10px; width: 90px; height: 90px; background: rgba(51, 170, 51, .05)'>
                      <q-icon name="fas fa-ruble-sign" size="60px" color='secondary'></q-icon>
                    </q-avatar>
                    <q-avatar v-if="wallet.code === 'mrub'" rounded style='border-radius: 10px; width: 90px; height: 90px; background: rgba(51, 170, 51, .05)'>
                      <q-icon name="fas fa-ruble-sign" size="60px" color='secondary'></q-icon>
                    </q-avatar>
                    <q-avatar v-if="wallet.code === 'ecu'" rounded style='border-radius: 10px; width: 90px; height: 90px; background: rgba(51, 170, 51, .05)'>
                      <q-img src="coins/ecu.svg" style='width: 65px'></q-img>
                    </q-avatar>
                    <q-avatar v-if="wallet.code === 'usdt'" rounded style='border-radius: 10px; width: 90px; height: 90px; background: rgba(51, 170, 51, .05)'>
                      <q-img src="coins/usdt.svg" style='width: 65px'></q-img>
                    </q-avatar>
                    <q-avatar v-if="wallet.code === 'usdts'" rounded style='border-radius: 10px; width: 90px; height: 90px; background: rgba(51, 170, 51, .05)'>
                      <q-img src="coins/usdt.svg" style='width: 65px'></q-img>
                    </q-avatar>
                    <q-avatar v-if="wallet.code === 'btc'" rounded style='border-radius: 10px; width: 90px; height: 90px; background: rgba(51, 170, 51, .05)'>
                      <q-icon name="fab fa-bitcoin" size="60px" color='secondary'></q-icon>
                    </q-avatar>
                  </div>
                  <div class="col-12">
                    <div class="text-h6 q-pa-none">{{ numberFormat(wallet.balance.available, wallet.decimal) }}</div>
                    <div class="text-subtitle1 text-bold">
                      <q-chip outline square class='text-bold q-ma-none q-mt-xs' color='white' text-color="white" style='font-size: 16px'>
                        {{ (wallet.code).toUpperCase() }}
                      </q-chip>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </q-intersection>
    </q-pull-to-refresh>

    <!-- User button -->
    <q-page-sticky position="top" :offset="[18, 18]">
      <q-intersection transition="scale" once>
        <q-btn rounded outline style="color: rgb(67, 177, 116)" size="16px" :label="profile.username" no-caps @click="userDialog = true" />
      </q-intersection>
    </q-page-sticky>

    <!-- Wallet list button -->
    <q-page-sticky position="bottom" :offset="[18, 18]">
      <q-intersection transition="scale" once>
        <q-btn style="color: rgb(67, 177, 116)" round outline size="20px" icon="fas fa-chevron-up" v-ripple @click="walletListDialog = true" />
      </q-intersection>
    </q-page-sticky>

    <!-- Wallet list dialog -->
    <q-dialog v-model="walletListDialog" position="bottom">
      <div style="width: 300px">
        <q-card
          v-for="wallet in wallets"
          :key="wallet.id"
          flat
          :dark="true"
          class="q-ma-md rounded-borders cursor-pointer"
          v-ripple
          @click="getWallet(wallet.id)"
          v-close-popup
          style='background: rgba(36, 35, 35, 0.35);'
        >
          <q-card-section>
            <div class="row text-subtitle1 text-weight-bold">
              <div class='col'>
                {{ (wallet.code).toUpperCase() }}
              </div>
              <div class='col text-right'>
                {{ numberFormat(wallet.balance.available, wallet.decimal) }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>

    <!-- Wallet dialog -->
    <q-dialog v-model="walletDialog" position='bottom'>
      <q-card style="background-color: transparent; width: 100vh;">
        <q-card-section class="row items-center q-pa-none" style="background: rgba(24, 24, 24, 0.55);">
          <div class="text-subtitle1 text-weight-bold q-pa-md">{{ (wallet.wallet.code).toUpperCase() }} кошелек</div>
          <q-space />
          <q-btn class="q-ma-md" icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section style="max-height: 10000px; background: rgba(24, 24, 24, 0.55);" class="scroll q-pa-none q-mt-none">
          <q-card flat class='q-ma-md q-py-sm' style="background: rgba(38, 38, 38, 0.40); border-radius: 10px;">
            <q-item>
              <q-item-section avatar>
                <q-avatar v-if="wallet.wallet.code === 'umi'" rounded style='border-radius: 10px; width: 65px; height: 65px; background: rgba(51, 170, 51, .05)'>
                  <q-img src="coins/umi.png"></q-img>
                </q-avatar>
                <q-avatar v-if="wallet.wallet.code === 'umis'" rounded style='border-radius: 10px; width: 65px; height: 65px; background: rgba(51, 170, 51, .05)'>
                  <q-img src="coins/umi.png"></q-img>
                </q-avatar>
                <q-avatar v-if="wallet.wallet.code === 'eth'" rounded style='border-radius: 10px; width: 65px; height: 65px; background: rgba(51, 170, 51, .05)'>
                  <q-icon name="fab fa-ethereum" size="45px" color='secondary'></q-icon>
                </q-avatar>
                <q-avatar v-if="wallet.wallet.code === 'rub'" rounded style='border-radius: 10px; width: 65px; height: 65px; background: rgba(51, 170, 51, .05)'>
                  <q-icon name="fas fa-ruble-sign" size="45px" color='secondary'></q-icon>
                </q-avatar>
                <q-avatar v-if="wallet.wallet.code === 'mrub'" rounded style='border-radius: 10px; width: 65px; height: 65px; background: rgba(51, 170, 51, .05)'>
                  <q-icon name="fas fa-ruble-sign" size="45px" color='secondary'></q-icon>
                </q-avatar>
                <q-avatar v-if="wallet.wallet.code === 'ecu'" rounded style='border-radius: 10px; width: 65px; height: 65px; background: rgba(51, 170, 51, .05)'>
                  <q-img src="coins/ecu.svg" style='width: 45px'></q-img>
                </q-avatar>
                <q-avatar v-if="wallet.wallet.code === 'usdt'" rounded style='border-radius: 10px; width: 65px; height: 65px; background: rgba(51, 170, 51, .05)'>
                  <q-img src="coins/usdt.svg" style='width: 45px'></q-img>
                </q-avatar>
                <q-avatar v-if="wallet.wallet.code === 'usdts'" rounded style='border-radius: 10px; width: 65px; height: 65px; background: rgba(51, 170, 51, .05)'>
                  <q-img src="coins/usdt.svg" style='width: 45px'></q-img>
                </q-avatar>
                <q-avatar v-if="wallet.wallet.code === 'btc'" rounded style='border-radius: 10px; width: 65px; height: 65px; background: rgba(51, 170, 51, .05)'>
                  <q-icon name="fab fa-bitcoin" size="45px" color='secondary'></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <div class='text-h6'>
                    <div v-if="wallet.wallet.provider === 'qiwi'" class="float-right">
                      <q-icon name="fab fa-cc-visa" size="30px" color='secondary'></q-icon>
                    </div>
                    {{ numberFormat(wallet.wallet.balance.available, wallet.wallet.decimal) }}
                  </div>
                  <div>
                    <q-icon color="white" name="fas fa-lock" style="font-size: 12px;"/>
                    {{ numberFormat(wallet.wallet.balance.hold, wallet.wallet.decimal) }}
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
          <div class="col-12">
            <div class='row q-my-lg'>
              <div class='col text-center'>
                <q-btn round outline style='color: rgb(67, 177, 116)' size="18px" icon="fas fa-sign-in-alt" @click="depositDialog = true" />
              </div>
              <div class='col text-center'>
                <q-btn round outline style='color: rgb(67, 177, 116)' size="18px" icon="fas fa-exchange-alt" @click="exchangeDialog = true" />
              </div>
              <div class='col text-center'>
                <q-btn round outline style='color: rgb(67, 177, 116)' size="18px" icon="fas fa-sign-out-alt" @click="withdrawalDialog = true" />
              </div>
            </div>
          </div>
          <div class="col-12">
            <div v-if="wallet.tx.length">
              <q-card
                v-for="tx in wallet.tx"
                :key="tx._id"
                flat
                :dark="true"
                class="q-ma-md rounded-borders"
                style="background: rgba(38, 38, 38, 0.40); border-radius: 10px;"
              >
                <q-card-section>
                  <div class="row q-gutter-md">
                    <div class="col-auto">
                      <q-avatar v-if="tx.action === 'withdrawal'" color="transparent" text-color="secondary" size="50px" icon="fas fa-share" />
                      <q-avatar v-if="tx.action === 'adjustment'" color="transparent" text-color="secondary" size="50px" icon="fas fa-pen-nib" />
                      <q-avatar v-if="tx.action === 'deposit'" color="transparent" text-color="secondary" size="50px" icon="fas fa-plus" />
                      <q-avatar v-if="tx.action === 'exchange'" color="transparent" text-color="secondary" size="50px" icon="fas fa-exchange-alt" />
                      <q-avatar v-if="tx.action === 'exchangeFee'" color="transparent" text-color="secondary" size="50px" icon="fas fa-percentage" />
                      <q-avatar v-if="tx.action === 'cardIn'" color="transparent" text-color="secondary" size="50px" icon="fas fa-sign-in-alt" />
                      <q-avatar v-if="tx.action === 'cardOut'" color="transparent" text-color="secondary" size="50px" icon="fas fa-sign-out-alt" />
                      <q-avatar v-if="tx.action === 'staking'" color="transparent" text-color="secondary" size="50px" icon="fas fa-hand-holding-usd" />
                    </div>
                    <div class="col">
                      <div class="text-subtitle2 text-weight-bold" style="font-size: 18px; line-height: 26px;">
                        <span v-if="tx.type === 'in'">+</span>
                        <span v-if="tx.type === 'out'">-</span>
                        {{ numberFormat(tx.amount, wallet.wallet.decimal) }}
                      </div>
                      <q-badge v-if="tx.fee" class="q-my-xs" outline color="secondary">комиссия {{ numberFormat(tx.fee, wallet.wallet.decimal) }}</q-badge>
                      <div class="text-subtitle1">
                        <div v-if="tx.action === 'withdrawal'">Вывод на кошелек</div>
                        <div v-if="tx.action === 'adjustment'">Корректировка</div>
                        <div v-if="tx.action === 'deposit'">Депозит</div>
                        <div v-if="tx.action === 'exchange'">Обмен</div>
                        <div v-if="tx.action === 'exchangeFee'">Комиссия обмена</div>
                        <div v-if="tx.action === 'cardIn'">Пополнение карты</div>
                        <div v-if="tx.action === 'cardOut'">Списание с карты</div>
                        <div v-if="tx.action === 'staking'">Стейкинг</div>
                      </div>
                      <div class="text-caption">
                        {{ dateFormat(tx.created, 'DD.MM.YYYY HH:mm:ss') }}
                      </div>
                    </div>
                    <div class="col-auto">
                      <q-icon v-if="tx.state === 'success'" name="fas fa-check" color="secondary"></q-icon>
                      <q-icon v-if="tx.state === 'pending'" name="fas fa-clock" color="grey-5"></q-icon>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <q-card
              v-else
              flat
              :dark="true"
              class="q-ma-md rounded-borders"
              style="background: rgba(38, 38, 38, 0.40); border-radius: 10px;"
            >
              <q-card-section>
                Транзакции не найдены
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- User dialog -->
    <q-dialog v-model="userDialog" position="bottom">
      <q-card style="background-color: transparent; width: 100vh;">
        <q-card-section>
          <q-card flat class="q-py-sm q-mb-md" style="background: rgba(38, 38, 38, 0.40); border-radius: 10px;">
            <q-item>
              <q-item-section>
                <q-item-label>ID</q-item-label>
                <q-item-label caption>{{ profile.id }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
          <q-card flat class="q-py-sm q-mb-md" style="background: rgba(38, 38, 38, 0.40); border-radius: 10px;">
            <q-item>
              <q-item-section>
                <q-item-label>Имя пользователя</q-item-label>
                <q-item-label caption>{{ profile.username }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
          <q-card flat class="q-py-sm q-mb-md" style="background: rgba(38, 38, 38, 0.40); border-radius: 10px;">
            <q-item>
              <q-item-section>
                <q-item-label>E-Mail</q-item-label>
                <q-item-label caption>{{ profile.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
          <q-card flat class="q-mb-md q-pa-none" style="background: rgba(38, 38, 38, 0.40); border-radius: 10px;" @click="logout">
            <q-item clickable v-ripple>
              <q-item-section class="text-red">Выход</q-item-section>
            </q-item>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>

    <deposit-dialog v-if="wallet" v-model="depositDialog" :currency="wallet.wallet"></deposit-dialog>
    <exchange-dialog v-if="wallet" v-model="exchangeDialog" :currency="wallet.wallet"></exchange-dialog>
    <withdrawal-dialog v-if="wallet" v-model="withdrawalDialog" :currency="wallet.wallet"></withdrawal-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue';
import { useStore } from 'src/store'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { WalletDetailsInterface, WalletInterface } from 'src/interfaces/wallet';
import { date } from 'quasar';

import DepositDialog from 'components/deposit.vue';
import ExchangeDialog from 'components/exchange.vue';
import WithdrawalDialog from 'components/withdrawal.vue';

export default defineComponent({
  name: 'PageIndex',
  components: {
    DepositDialog,
    ExchangeDialog,
    WithdrawalDialog,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const wallets = ref<WalletInterface[]>();
    const wallet = ref<WalletDetailsInterface>();
    const userDialog = ref<boolean>(false);
    const walletListDialog = ref<boolean>(false);
    const walletDialog = ref<boolean>(false);
    const depositDialog = ref<boolean>(false);
    const exchangeDialog = ref<boolean>(false);
    const withdrawalDialog = ref<boolean>(false);

    // @ts-ignore
    const getWallets = (done) => api({
      url: 'exchange/user/wallet',
      method: 'get'
    })
      .then(response => {
        switch (response.status) {
          case 200:
            wallets.value = <WalletInterface[]>response.data;
            if (done) done();
            break;
        }
      });

    const getWallet = (id: string) => api({
      url: 'exchange/user/wallet/' + id,
      method: 'get'
    })
      .then(response => {
        switch (response.status) {
          case 200:
            wallet.value = <WalletDetailsInterface>response.data;
            walletDialog.value = true;
            break;
        }
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
    const dateFormat = (fullDate: string, format: string) => date.formatDate(fullDate, format);

    onMounted(() => getWallets(false));

    // @ts-ignore
    watch(exchangeDialog, (value: boolean) => {
      // @ts-ignore
      if (!value) getWallet(wallet.value.wallet.id);
    });

    // @ts-ignore
    watch(withdrawalDialog, (value: boolean) => {
      // @ts-ignore
      if (!value) getWallet(wallet.value.wallet.id);
    });

    return {
      profile: computed(() => store.getters['user/profile']),
      defaultWallet: ref('61460802481f2e393dae1de9'),
      wallets,
      wallet,
      getWallets,
      getWallet,
      userDialog,
      walletListDialog,
      walletDialog,
      depositDialog,
      exchangeDialog,
      withdrawalDialog,
      numberFormat: (number: number, digits: number) =>
        new Intl.NumberFormat(
          'ru-RU',
          { maximumFractionDigits: digits, minimumFractionDigits: digits }
        ).format(
          gaussRound(number, digits)
        ),
      dateFormat,
      logout: () => store.dispatch('user/logout').then(() => router.push({ name: 'login' }))
    }
  }
});
</script>
