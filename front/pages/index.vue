<script setup>
  import { useUserStore } from '~/store';
 
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const redirectUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${useRuntimeConfig().public.clientId}&redirect_uri=${useRuntimeConfig().public.apiRedirectUrl}/api/auth/twitch/callback&scope=user:read:email`
</script>


<template>
  <div>
    <div v-if="!user">
      <h1>Bienvenue chez les Evolis Sauvages mais gentils</h1>
      <v-btn :href="redirectUrl">
        Se connecter avec Twitch
      </v-btn>
    </div>
    <div v-else>
        Bienveue {{ user.username }}
        <v-btn to="/fishing">Je veux voir mon pokedex</v-btn>
    </div>
  </div>
</template>