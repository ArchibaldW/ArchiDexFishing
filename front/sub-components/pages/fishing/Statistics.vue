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
const userCatches = ref([])
const ready = ref(false)

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
      EN CONSTRUCTION
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
