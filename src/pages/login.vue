<template>
  <q-page class="flex flex-center">
    <q-page-sticky position="top-right" :offset="[30, 30]">
      <q-btn @click="router.push({ name: 'signup' })" outline color="secondary" label="Регистрация" rounded />
    </q-page-sticky>
    <q-intersection transition="scale" once>
      <div class="text-center q-my-lg">
        <q-img src="~assets/logo2.svg" style="width: 140px; height: 179px;" />
      </div>

      <q-card dark flat class="q-my-md" v-ripple style="width: 280px">
        <q-card-section class="q-py-none q-ma-none">
          <q-input
            borderless
            v-model="signin.username"
            label="Имя пользователя"
            color='secondary'
            @keydown.enter.prevent="login"
          />
        </q-card-section>
      </q-card>

      <q-card dark flat class="q-my-md" v-ripple style="width: 280px">
        <q-card-section class="q-py-none q-ma-none">
          <q-input
            borderless
            type="password"
            v-model="signin.password"
            label="Пароль"
            color='secondary'
            @keydown.enter.prevent="login"
          />
        </q-card-section>
      </q-card>

      <div class="column items-center">
        <div class="col">
          <q-btn unelevated color="secondary" text-color='black' label="Войти" size='md' @click="login" />
        </div>
      </div>
    </q-intersection>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router'
import { useStore } from 'src/store'
import { UserSigninInterface } from 'src/interfaces/user';

export default defineComponent({
  name: 'PageLogin',
  setup() {
    const router = useRouter();
    const store = useStore();
    // @ts-ignore
    const signin = ref<UserSigninInterface>({
      username: '',
      password: '',
    });

    const login = () => store.dispatch('user/login', signin.value)
      .then(() => router.push({ name: 'index' }))
      .catch(() => Notify.create({
        position: 'top',
        message: 'Неверный логин или пароль'
      }));

    return { signin, login, router };
  }
});
</script>
