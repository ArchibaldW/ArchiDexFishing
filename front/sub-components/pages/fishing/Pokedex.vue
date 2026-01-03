<script setup>
import { fisherService } from '~/_services';

const pokedex = ref([])
const ready = ref(false)

onBeforeMount(async () => {
  pokedex.value = await fisherService.getUserPokedex();
  ready.value = true
});

function codeOnlyNumber(code){
  const match = code.match(/^(\d{4})/);
  return match ? match[1] : code;
}

const showShiny = ref(false)
const showNotCaught = ref(true)
</script>

<template>
  <div class="container">
    <h1 class="title">Ton Pokedex</h1>
    <template v-if="ready">
      <div class="filters">
        <v-checkbox 
          v-model="showShiny" 
          label="Shiny?"
          hide-details
          density="compact"
        />
        <v-checkbox 
          v-model="showNotCaught" 
          label="Voir non capturés"
          hide-details
          density="compact"
        />
      </div>
      <div class="pokecards">
        <template v-for="(catchItem, index) in pokedex">
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
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 10px;
}

.filters {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 10px;
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
