<script setup>
  import FisherView from '~/components/FisherView.vue';
  import { useCommonStore } from '~/store';
 
  const commonStore = useCommonStore()
</script>


<template>
  <div>
    <template v-if="!commonStore.token">
      <h1>Bienvenue sur l’appli Fishing</h1>
      <v-btn href="https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=vgmhmvzkrzart4tbyqr0qntw0t9e7i&redirect_uri=http://localhost:5000/api/auth/twitch/callback&scope=user:read:email">
        Se connecter avec Twitch
      </v-btn>
    </template>
    <template v-else>
      <FisherView />
    </template>
  </div>
</template>