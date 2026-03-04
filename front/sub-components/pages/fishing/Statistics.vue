d<script setup>
import { fisherService } from '~/_services';
import { Tag, Type } from '~/_helpers';

const stastistics = ref({})
const ready = ref(false)

onBeforeMount(async () => {
    stastistics.value = await fisherService.getUserStatistics();
    ready.value = true
});

const globalNormalProgress = computed(() => {
  return stastistics.value && stastistics.value.global ? 100*stastistics.value.global.caughtNormal/stastistics.value.global.total : 0
})

const globalShinyProgress = computed(() => {
  return stastistics.value && stastistics.value.global ? 100*stastistics.value.global.caughtShiny/stastistics.value.global.total : 0
})
</script>

<template>
  <div class="statistics">
    <h1 class="statistics__title">Tes statistiques avancées</h1>
    <template v-if="ready">
      <h2 class="statistics__subtitle">Progression globale</h2>
      <div class="statistics__global">
          <v-progress-linear :model-value="globalNormalProgress" class="statistics__global__progress statistics__global__progress--normal">
            Normal : {{stastistics.global.caughtNormal }} / {{ stastistics.global.total }} ({{ globalNormalProgress.toFixed(2) }}%)
          </v-progress-linear>
          <v-progress-linear :model-value="globalShinyProgress" class="statistics__global__progress statistics__global__progress--shiny">
            Shiny : {{stastistics.global.caughtShiny }} / {{ stastistics.global.total }} ({{ globalShinyProgress.toFixed(2) }}%)
          </v-progress-linear>
      </div>

      <h2 class="statistics__subtitle">Par génération</h2>
      <div class="statistics__category">
        <v-card class="statistics__category__card" v-for="genData of stastistics.generations" :key="genData.gen">
          <h3>Génération {{ genData.gen }}</h3>
          <div class="statistics__category__card__details">
            <v-progress-circular
              class="statistics__category__card__details__progress statistics__category__card__details__progress--normal"
              :model-value="genData.caughtNormal*100 / genData.total"
              :rotate="360"
              :size="100"
              :width="15"
            > 
              Normal
              <br>
              {{ genData.caughtNormal  }} / {{ genData.total }}
            </v-progress-circular>
            <v-progress-circular
              class="statistics__category__card__details__progress statistics__category__card__details__progress--shiny"
              :model-value="genData.caughtShiny*100 / genData.total"
              :rotate="360"
              :size="100"
              :width="15"
            >
              Shiny
              <br>
              {{ genData.caughtShiny  }} / {{ genData.total }}
            </v-progress-circular>
          </div>
        </v-card>
      </div>

      <h2 class="statistics__subtitle">Par types</h2>
      <div class="statistics__category">
        <v-card class="statistics__category__card" v-for="typeData of stastistics.types" :key="typeData.type">
          <h3>{{ Type[typeData.type] }}</h3>
          <div class="statistics__category__card__details">
            <v-progress-circular
              class="statistics__category__card__details__progress statistics__category__card__details__progress--normal"
              :model-value="typeData.caughtNormal*100 / typeData.total"
              :rotate="360"
              :size="100"
              :width="15"
            >
              Normal
              <br>
              {{ typeData.caughtNormal  }} / {{ typeData.total }}
            </v-progress-circular>
            <v-progress-circular
              class="statistics__category__card__details__progress statistics__category__card__details__progress--shiny"
              :model-value="typeData.caughtShiny*100 / typeData.total"
              :rotate="360"
              :size="100"
              :width="15"
            >
              Shiny
              <br>
              {{ typeData.caughtShiny  }} / {{ typeData.total }}
            </v-progress-circular>
          </div>
        </v-card>
      </div>

      <h2 class="statistics__subtitle">Par tags</h2>
      <div class="statistics__category">
        <v-card class="statistics__category__card" v-for="tagsData of stastistics.tags" :key="tagsData.tag">
          <h3>{{ Tag[tagsData.tag] }}</h3>
          <div class="statistics__category__card__details">
            <v-progress-circular
              class="statistics__category__card__details__progress statistics__category__card__details__progress--normal"
              :model-value="tagsData.caughtNormal*100 / tagsData.total"
              :rotate="360"
              :size="100"
              :width="15"
            >
              Normal
              <br>
              {{ tagsData.caughtNormal  }} / {{ tagsData.total }}
            </v-progress-circular>
            <v-progress-circular
              class="statistics__category__card__details__progress statistics__category__card__details__progress--shiny"
              :model-value="tagsData.caughtShiny*100 / tagsData.total"
              :rotate="360"
              :size="100"
              :width="15"
            >
              Shiny
              <br>
              {{ tagsData.caughtShiny  }} / {{ tagsData.total }}
            </v-progress-circular>
          </div>
        </v-card>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.statistics {
  padding: 10px;
  &__title {
    width: fit-content;
    margin: auto;
    font-size: 30px;
    font-weight: 800;
  }

  &__subtitle{
    width: fit-content;
    margin: 30px auto 5px;
    font-size: 24px;
    font-weight: 600;
  }

  &__global {
    width: 100%;
    display: flex;
    gap: 20px;

    @media (max-width: 768px){
      margin-top: 10px;
      flex-direction: column;
      gap: 10px;
    }

    &__progress {
      border-radius: 16px;
      height: 25px !important;
      border: 2px solid black;

      :deep(.v-progress-linear__content) {
        color: black;
      }
      
      &--normal{
        color:blue;
      }

      &--shiny{
        color: red;
      }
    }
  }

  &__category{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;

    &__card{
      border: 2px solid black;
      padding: 20px 30px;
      text-align: center;
      border-radius: 16px;

      &__details {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        gap: 30px;

        :deep(.v-progress-circular__content){
          font-size: 11px;
          font-weight: 600;
          display: flex;
          flex-direction: column;
        }

        &__progress{
          &--normal{
            color: blue;
          }
          &--shiny{
            color: red;
          }
        }
      }
    }
  }
}

</style>
