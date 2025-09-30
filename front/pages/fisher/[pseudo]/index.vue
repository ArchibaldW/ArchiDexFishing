<script setup>
const pseudo = useRoute().params.pseudo;
const catches = ref([])
const userCatches = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`/api/catches`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Erreur API');
    catches.value = await res.json();
  }
  catch (error){
    console.log(error)
  }

  try {
    const res = await fetch(`/api/users/${pseudo}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Erreur API');
    userCatches.value = await res.json();
  } catch (error) {
    console.error(error);
  }
});

const normalSet = computed(() => {
  return new Set(userCatches.value.filter(c => !c.shiny).map(c => c.code));
})

const shinySet = computed(() => {
  return new Set(userCatches.value.filter(c => c.shiny).map(c => c.code));
})

const pokemonsWithStatus = computed(() => {
  return catches.value.map(
    p => (
      {
        ...p,
        caughtNormal: normalSet.value.has(p.code),
        caughtShiny: shinySet.value.has(p.code)
      }
    )
  );
})

function codeOnlyNumber(code){
  const match = code.match(/^(\d{4})/);
  return match ? match[1] : code;
}

const showShiny = ref(false)
const showNotCaught = ref(true)

const progress = computed(() => {
  return showShiny.value ? 100*shinySet.value.size / pokemonsWithStatus.value.length : 100*normalSet.value.size / pokemonsWithStatus.value.length
})
</script>

<template>
  <div class="container">
    <div class="title">Pokédex de {{ pseudo }}</div>
    <div class="filters">
      <v-checkbox 
        v-model="showShiny" 
        label="Shiny?"
        density="flat"
        hide-details
      />
      <v-checkbox 
        v-model="showNotCaught" 
        label="Voir non capturés"
        density="flat"
        hide-details
      />
    </div>
    <v-progress-linear :model-value="progress" class="progress">
      {{showShiny ? shinySet.size : normalSet.size }} / {{ pokemonsWithStatus.length }} ({{ progress.toFixed(2) }}%)
    </v-progress-linear>
    <div class="pokecards">
      <template v-for="(catchItem, index) in pokemonsWithStatus">
        <v-card 
          v-if="showNotCaught || !showNotCaught && ((!showShiny && catchItem.caughtNormal) || (showShiny && catchItem.caughtShiny))"
          :key="index"
          class="pokecards__pokecard"
          :class="{
            'pokemon-caught' : !showShiny ? catchItem.caughtNormal : catchItem.caughtShiny
          }"
        >
            <v-card-title class="pokecards__pokecard__title">#{{codeOnlyNumber(catchItem.code)}} - {{ catchItem.caughtNormal || catchItem.caughtShiny ? catchItem.name : '???' }}</v-card-title>
            <img  class="pokecards__pokecard__image" :src="`/assets/${catchItem.code}${showShiny ? 's' : ''}.png`" />
        </v-card>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 10px;
}

.title {
  width: fit-content;
  margin: auto;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.filters {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 10px;
}

.progress {
  margin-bottom: 10px;
  border-radius: 10px;
  color:#2481EF;
  height:25px !important;
  width: calc(100% - 20px);
  border: 2px solid black;

  :deep(.v-progress-linear__content) {
    color: black;
  }
}

.pokecards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  row-gap: 20px;
  &__pokecard{
    width: 240px;
    max-width: 240px;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 20px;

    &__title {
      background-color: grey;
      color: white;
      width: 100%;
      white-space: break-spaces;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    &__image {
      padding: 10px;
      height: 240px;
      object-fit: contain;
      width: 100%;
      filter: brightness(0) invert(0);
    }

    &.pokemon-caught{
      .pokecards__pokecard {
        &__title {
          background-color : #2481EF;
        }

        &__image {
          filter: unset;
        }
      }
    }
  }
}
</style>
