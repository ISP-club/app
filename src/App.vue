<template>
  <q-banner v-if="initState === false" inline-actions class="text-white bg-red">
    Ошибка инициализации приложения. Попробуйте через несколько минут.
  </q-banner>
  <router-view v-if="initState" />
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'src/store'

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    const initState = computed(() => store.getters['user/init']);

    return { initState };
  }
})
</script>
