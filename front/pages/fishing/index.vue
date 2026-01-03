<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '~/store';
import Pokedex from '~/sub-components/pages/fishing/Pokedex.vue';
import Statistics from '~/sub-components/pages/fishing/Statistics.vue';

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const router = useRouter()

const selectedTab = ref('')
const tabList = [
    {label : 'Pokédex', value : 'pokedex'},
    {label : 'Statistiques', value : 'statistics'},
]

onBeforeMount(async () => {
  if(!user.value){
    await router.push('/')
  }
});
</script>

<template>
    <div>
        <v-tabs v-model="selectedTab">
            <v-tab v-for="tab in tabList" :key="tab.value" :value="tab.value">{{ tab.label }}</v-tab>
        </v-tabs>
        <Pokedex v-if="selectedTab === 'pokedex'"/>
        <Statistics v-else-if="selectedTab === 'statistics'"/>
    </div>
</template>

<style lang="scss" scoped>
</style>

