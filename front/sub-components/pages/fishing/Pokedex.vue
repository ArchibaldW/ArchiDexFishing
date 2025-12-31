<script setup>
import { fisherService } from '~/_services';

const props = defineProps({
  pseudo: {
    type: String,
    required: true
  },
});

const pseudo = toRef(props, 'pseudo');
const catches = ref([])
const ready = ref(false)
const userCatches = ref([])

onBeforeMount(async () => {
  catches.value = await fisherService.getCatches();
  userCatches.value = await fisherService.getUserCatches(pseudo.value);
  ready.value = true
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
    <template v-if="ready">
      <div class="title">Pokédex de {{ pseudo }}</div>
      <div class="filters">
        <v-checkbox 
          v-model="showShiny" 
          label="Shiny?"
          hide-details
        />
        <v-checkbox 
          v-model="showNotCaught" 
          label="Voir non capturés"
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
            :class="[
              { 'pokemon-caught': !showShiny ? catchItem.caughtNormal : catchItem.caughtShiny },
              `type1-${catchItem.type1}`,
              catchItem.type2 ? `type2-${catchItem.type2}` : null
            ]"
          >
              <v-card-title class="pokecards__pokecard__title">#{{codeOnlyNumber(catchItem.code)}} - {{ catchItem.caughtNormal || catchItem.caughtShiny ? catchItem.name : '???' }}</v-card-title>
              <img  class="pokecards__pokecard__image" :src="`/assets/${catchItem.code}${showShiny ? 's' : ''}.png`" />
          </v-card>
        </template>
      </div>
    </template>
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  &__pokecard{
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
          background: linear-gradient(135deg, var(--bg-type1) 25%, var(--bg-type2) 75%);
          color: white;
        }
        &__image {
          filter: unset;
        }
      }

      @each $type, $color in $type-colors {
        &.type1-#{$type} {
          .pokecards__pokecard__title {
            --bg-type1: #{$color};
            --bg-type2: #{$color};
          }
        }
        
        &.type2-#{$type} {
          .pokecards__pokecard__title {
            --bg-type2: #{$color} !important;
          }
        }
      }
    }
  }
}
</style>
