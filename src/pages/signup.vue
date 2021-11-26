<template>
  <q-page class="flex flex-center">
    <q-page-sticky position="top-right" :offset="[30, 30]">
      <q-btn @click="router.push({ name: 'login' })" outline color="secondary" label=Вход rounded />
    </q-page-sticky>
    <q-intersection v-if='success' transition="scale" once>
      <div class="text-center q-my-lg">
        <q-img src="~assets/logo2.svg" style="width: 140px; height: 179px;" />
      </div>

      <q-card dark flat class="q-ma-md rounded-borders" v-ripple style="width: 280px">
        <q-card-section class="q-pa-md text-center">
          На ваш email отправлена ссылка для активации учетной записи
        </q-card-section>
      </q-card>
    </q-intersection>
    <q-intersection v-else transition="scale" once>
      <div class="text-center q-my-lg">
        <q-img src="~assets/logo2.svg" style="width: 140px; height: 179px;" />
      </div>

      <q-card dark flat class="q-my-md" v-ripple style="width: 280px">
        <q-card-section class="q-py-none q-ma-none">
          <q-input
            borderless
            v-model="signup.email"
            label="E-Mail"
            color='secondary'
            @keydown.enter.prevent="signupValidation"
          />
        </q-card-section>
      </q-card>

      <q-card dark flat class="q-my-md" v-ripple style="width: 280px">
        <q-card-section class="q-py-none q-ma-none">
          <q-input
            borderless
            v-model="signup.username"
            label="Имя пользователя"
            color='secondary'
            @keydown.enter.prevent="signupValidation"
          />
        </q-card-section>
      </q-card>

      <q-card dark flat class="q-my-md" v-ripple style="width: 280px">
        <q-card-section class="q-py-none q-ma-none">
          <q-input
            borderless
            type="password"
            v-model="signup.password"
            label="Пароль"
            color='secondary'
            @keydown.enter.prevent="signupValidation"
          />
        </q-card-section>
      </q-card>

      <q-card dark flat class="q-my-md" v-ripple style="width: 280px">
        <q-card-section class="q-py-none q-ma-none">
          <q-input
            borderless
            type="password"
            v-model="signup.repeatPassword"
            label="Повторите пароль"
            color='secondary'
            @keydown.enter.prevent="signupValidation"
          />
        </q-card-section>
      </q-card>

      <div class="items-center q-my-md" style="width: 280px">
        <div class="row">
          <div class="col-auto">
            <q-checkbox v-model="signup.accept" color="secondary" dark />
          </div>
          <div class="col">
            <div>Я ознакомлен и принимаю</div>
            <span @click="termsDialog = true" style="cursor: pointer; border-bottom: 1px dotted #ffffff">условия использования сервиса</span>
          </div>
        </div>
      </div>

      <div class="column items-center">
        <div class="col">
          <q-btn unelevated color="secondary" text-color='black' label="Далее" size='md' @click="signupValidation" />
        </div>
      </div>
    </q-intersection>

    <!-- Terms dialog -->
    <q-dialog v-model="termsDialog" position="bottom">
      <q-card style="background-color: transparent; width: 400px;">
        <q-card-section class="row items-center q-pa-none" style="background: rgba(36, 35, 35, 0.85); border-radius: 15px 15px 0 0 !important;">
          <div class="text-subtitle1 text-weight-bold q-pa-md">Условия использования сервиса</div>
          <q-space />
          <q-btn class="q-ma-md" icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section style="max-height: 500px; background: rgba(36, 35, 35, 0.85);" class="scroll q-pa-none q-mt-none">
          <q-card flat :dark="true" class="q-ma-md rounded-borders" style="background: rgba(48, 48, 48, 0.65);">
            <q-card-section>
              Текст условий использования сервиса
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue';

import { useRouter } from 'vue-router'
import { UserSignupInterface } from 'src/interfaces/user';
import { Loading, Notify } from 'quasar';
import { api } from 'boot/axios';
import { UserType } from 'src/enum/user';

export default defineComponent({
  name: 'PageSignup',
  setup() {
    const router = useRouter();
    const success = ref<boolean>(false);
    const signup = ref<UserSignupInterface>({
      email: '',
      username: '',
      password: '',
      repeatPassword: '',
      accept: false,
      // @ts-ignore
      invite: localStorage.getItem('invite'),
    });

    const signupValidation = () => {
      if (signup.value.email === '') {
        Notify.create({
          position: 'top',
          message: 'E-Mail не введен'
        });
        return;
      }
      if (signup.value.username === '') {
        Notify.create({
          position: 'top',
          message: 'Имя пользователя не введено'
        });
        return;
      }
      if (signup.value.password === '') {
        Notify.create({
          position: 'top',
          message: 'Пароль не введен'
        });
        return;
      }
      if (signup.value.repeatPassword === '') {
        Notify.create({
          position: 'top',
          message: 'Повтор пароля не введен'
        });
        return;
      }
      if (signup.value.password !== signup.value.repeatPassword) {
        Notify.create({
          position: 'top',
          message: 'Введенные пароли не совпадают'
        });
        return;
      }
      if (!signup.value.accept) {
        Notify.create({
          position: 'top',
          message: 'Необходимо принять условия использования'
        });
        return;
      }
      postSignup();
    };

    const postSignup = () => {
      Loading.show();
      api({
        url: 'user/signup',
        method: 'post',
        data: {
          type: UserType.PrivatePerson,
          username: signup.value.username,
          password: signup.value.password,
          email: signup.value.email,
          invite: signup.value.invite,
        },
      })
        .then(response => {
          switch (response.status) {
            case 201:
              success.value = true;
              break;
          }
          Loading.hide();
        })
        .catch(error => {
          // @ts-ignore
          if (typeof error.response.data.message === 'Array') {
            // @ts-ignore
            error.response.data.message.forEach((message) => Notify.create({
              position: 'top',
              message
            }));
          } else {
            Notify.create({
              position: 'top',
              message: error.response.data.message,
            });
          }

          Loading.hide();
        })
    };

    return {
      signup,
      termsDialog: ref(false),
      signupValidation,
      success,
      router,
    };
  }
});
</script>
