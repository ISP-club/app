<template>
  <q-page />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
} from 'vue';

import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'PageInvite',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const user = ref<string>(<string>route.params.user);
    if (localStorage.getItem('invite') === null) localStorage.setItem('invite', user.value);
    router.push({ name: 'signup' })
  }
});
</script>
