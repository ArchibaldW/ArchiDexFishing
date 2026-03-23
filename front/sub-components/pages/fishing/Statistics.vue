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
        <v-card class="statistics__category__card" v-for="typeData of stastistics.types" :key="typeData.type" :class="`type-${typeData.type}`">
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
  padding: 20px;
  background: transparent;
  min-height: 100vh;

  &__title {
    width: fit-content;
    margin: auto;
    font-size: 36px;
    font-weight: 800;
    color: white;
    margin-bottom: 40px;
    letter-spacing: 1px;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  &__subtitle {
    width: fit-content;
    margin: 40px auto 20px;
    font-size: 18px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  &__global {
    width: 100%;
    display: flex;
    gap: 20px;
    margin-bottom: 40px;
    background: rgba(255, 255, 255, 0.08);
    padding: 20px;
    border-radius: 12px;
    backdrop-filter: blur(10px);

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 15px;
    }

    &__progress {
      flex: 1;
      border-radius: 8px;
      height: 36px !important;
      border: 2px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: white;
      overflow: hidden;

      :deep(.v-progress-linear__content) {
        color: #212121;
        font-weight: 700;
        font-size: 12px;
      }

      &--normal {
          color : #2481EF !important;
      }

      &--shiny {
        color : #FFD700 !important
      }
    }
  }

  &__category {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 40px;

    &__card {
      background: linear-gradient(white, rgba(#999, 0.50)), white;
      border: none;
      border-left: 6px solid #999;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      text-align: center;
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }

      h3 {
        color: #212121;
        font-weight: 700;
        margin-bottom: 20px;
        font-size: 16px;
      }

      &__details {
        display: flex;
        justify-content: space-around;
        gap: 15px;

        :deep(.v-progress-circular__content) {
          font-size: 10px;
          font-weight: 700;
          color: #212121;
          display: flex;
          flex-direction: column;
        }

        &__progress {
          &--normal {
            :deep(.v-progress-circular__overlay) {
              stroke: #2481EF !important;
            }
            :deep(.v-progress-circular__underlay) {
              stroke: rgba(36, 129, 239, 0.15) !important;
            }
          }

          &--shiny {
            :deep(.v-progress-circular__overlay) {
              stroke: #FFD700 !important;
            }
            :deep(.v-progress-circular__underlay) {
              stroke: rgba(255, 215, 0, 0.15) !important;
            }
          }
        }
      }

      // Type colors - teinte transparente par-dessus fond blanc (12% opacité)
      @each $type, $color in $type-colors {
        &.type-#{$type} {
          border-left-color: #{$color};
          background: linear-gradient(white, rgba($color, 0.30)), white;
          h3 { color: #{$color}; }
          .statistics__category__card__details__progress--normal :deep(.v-progress-circular__overlay) { stroke: #{$color} !important; }
        }
      }
    }
  }
}
</style>
