<template>
  <q-page class="flex flex-center">
    <q-page-sticky position="top-right" :offset="[30, 30]">
      <q-btn @click="router.push({ name: 'login' })" outline color="secondary" label=Вход rounded />
    </q-page-sticky>
    <q-intersection v-if="success" transition="scale" once>
      <div class="text-center q-my-lg">
        <q-img src="~assets/logo2.svg" style="width: 140px; height: 179px;" />
      </div>
      <q-card dark flat class="q-ma-md rounded-borders" v-ripple style="width: 280px">
        <q-card-section class="q-pa-md text-center">
          Учетная запись успешно активирована
        </q-card-section>
      </q-card>
    </q-intersection>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent, onMounted,
  ref
} from 'vue';
import { Loading } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'PageActivate',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const user = ref<string>(<string>route.params.user);
    const success = ref<boolean>(false);

    const activate = () => {
      Loading.show();
      api({
        url: 'user/activate/' + user.value,
        method: 'get'
      })
        .then(response => {
          switch (response.status) {
            case 200:
              Loading.hide();
              success.value = true;
              break;
          }
        })
    };

    onMounted(() => activate());

    return {
      success,
      router,
    }
  }
});
</script>
