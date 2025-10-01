<script setup>
  import { parse } from 'cookie-es';
  import { useCommonStore } from '~/store';

  const commonStore = useCommonStore()
  onBeforeMount(() => {
    const cookies = parse(document.cookie);
    commonStore.token = cookies.auth_token;
  })
</script>

<template>
  <div>
    <NuxtLayout />
      <NuxtPage />
    <NuxtLayout />
  </div>
</template>
