<script setup>
import { fisherService } from '~/_services';
import { Tag, Type } from '~/_helpers';

const pokedex = ref([])
const ready = ref(false)
const searchName = ref('');
const filterCaught = ref('all');
const sortBy = ref('id_asc')
const selectedGen = ref(null);
const selectedTag = ref(null);
const selectedTypes = ref([]);

onBeforeMount(async () => {
  pokedex.value = await fisherService.getUserPokedex();
  ready.value = true
});

function codeOnlyNumber(code){
  const match = code.match(/^(\d{4})/);
  return match ? match[1] : code;
}

const sortOptions = [
  { title: 'Numéro croissants', value: 'id_asc' },
  { title: 'Numéro décroissants', value: 'id_desc' },
  { title: 'Plus capturés', value: 'count_desc' }
]

const availableGens = computed(() => {
  const gens = new Set();
  pokedex.value.forEach(item => {
    if (item.gen) gens.add(item.gen);
  });
  return Array.from(gens).sort((a, b) => a - b); 
});

const availableTags = computed(() => {
  const tags = new Set();
  pokedex.value.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).map(tag => ({
    value: tag,
    label: Tag[tag] || tag
  })).sort((a, b) => a.label.localeCompare(b.label, 'fr'));
});

const availableTypes = computed(() => {
  const types = new Set();
  pokedex.value.forEach(item => {
    if (item.type1) types.add(item.type1);
    if (item.type2) types.add(item.type2);
  });
  return Array.from(types).map(type => ({
    value: type,
    label: Type[type] || type
  })).sort((a, b) => a.label.localeCompare(b.label, 'fr'));
});

const processedPokedex = computed(() => {
  let result = pokedex.value.filter(catchItem => {
    const isCaught = showShiny.value ? catchItem.caughtShiny : catchItem.caughtNormal;

    if (filterCaught.value === 'caught' && !isCaught) {
      return false;
    }
    if (filterCaught.value === 'uncaught' && isCaught) {
      return false;
    }

    if (searchName.value) {
      const query = searchName.value.toLowerCase();
      const pokemonName = catchItem.name ? catchItem.name.toLowerCase() : '';
      if (!pokemonName.includes(query)) return false;
    }

    if (selectedGen.value) {
      if (catchItem.gen !== selectedGen.value) return false; 
    }

    if (selectedTag.value) {
      if (!catchItem.tags || !catchItem.tags.includes(selectedTag.value)) return false;
    }

    if (selectedTypes.value.length === 1) {
      const t1 = selectedTypes.value[0];
      return catchItem.type1 === t1 || catchItem.type2 === t1;
    } 
    else if (selectedTypes.value.length === 2) {
      const t1 = selectedTypes.value[0];
      const t2 = selectedTypes.value[1];
      return (catchItem.type1 === t1 && catchItem.type2 === t2) || (catchItem.type1 === t2 && catchItem.type2 === t1);
    }

    return true;
  });

  return result.sort((a, b) => {
    if (sortBy.value === 'id_asc') {
      return a.code.toString().localeCompare(b.code.toString());
    } 
    else if (sortBy.value === 'id_desc') {
      return b.code.toString().localeCompare(a.code.toString());
    } 
    else if (sortBy.value === 'count_desc') {
      const countA = showShiny.value ? (a.countShiny || 0) : (a.countNormal || 0);
      const countB = showShiny.value ? (b.countShiny || 0) : (b.countNormal || 0);
      
      if (countB === countA) {
        return a.code.toString().localeCompare(b.code.toString());
      }
      return countB - countA;
    }
  });
});

const showShiny = ref(false)
</script>

<template>
  <div class="container">
    <h1 class="title">Ton Pokedex</h1>
    <template v-if="ready">
      <div class="filters">
        <v-chip-group 
          v-model="showShiny" 
          mandatory 
          selected-class="bg-primary text-white" 
          class="mr-4"
        >
          <v-chip :value="false" variant="elevated">
            Normaux
          </v-chip>
          
          <v-chip :value="true" variant="elevated">
            ✨ Shiny
          </v-chip>
        </v-chip-group>

        <v-chip-group v-model="filterCaught" mandatory selected-class="bg-primary text-white" class="mr-4">
          <v-chip value="all" variant="elevated">Tous</v-chip>
          <v-chip value="caught" variant="elevated">Capturés</v-chip>
          <v-chip value="uncaught" variant="elevated">Manquants</v-chip>
        </v-chip-group>

        <v-select
          v-model="sortBy"
          :items="sortOptions"
          item-title="title"
          item-value="value"
          label="Trier par"
          variant="outlined"
          density="compact"
          hide-details
          class="sort-select"
        />
        <v-text-field
          v-model="searchName"
          label="Chercher un nom..."
          variant="outlined"
          density="compact"
          hide-details
          clearable
          prepend-inner-icon="mdi-magnify"
          class="search-bar"
        />
      </div>

      <div class="chip-container">

        <div class="chip-filters" v-if="availableGens.length > 0">
          <div class="chip-filters__title">Générations</div>
          <v-chip-group v-model="selectedGen" column selected-class="bg-primary text-white">
              <v-chip 
                v-for="gen in availableGens" 
                :key="gen"
                :value="gen"
                variant="elevated"
              >
                Genération {{ gen }}
              </v-chip>
          </v-chip-group>
        </div>

        <div class="chip-filters" v-if="availableTypes.length > 0">
          <div class="chip-filters__title">Types (2 max)</div>
          <v-chip-group v-model="selectedTypes" column multiple max="2" selected-class="bg-primary text-white">
            <v-chip 
              v-for="type in availableTypes" 
              :key="type"
              :value="type.value"
              variant="elevated"
            >
              {{ type.label }}
            </v-chip>
          </v-chip-group>
        </div>

        <div class="chip-filters" v-if="availableTags.length > 0">
          <div class="chip-filters__title">Tags spéciaux</div>
          <v-chip-group v-model="selectedTag" column selected-class="bg-primary text-white">
            <v-chip 
              v-for="tag in availableTags" 
              :key="tag"
              :value="tag.value"
              variant="elevated"
            >
              {{ tag.label }}
            </v-chip>
          </v-chip-group>
        </div>
      </div>

      <div class="pokecards">
        <v-card 
          v-for="catchItem in processedPokedex" 
          :key="catchItem.code"
          class="pokecards__pokecard"
          :class="[
            { 'pokemon-caught': !showShiny ? catchItem.caughtNormal : catchItem.caughtShiny },
            `type1-${catchItem.type1}`,
            catchItem.type2 ? `type2-${catchItem.type2}` : null
          ]"
          >
            <div v-if="showShiny ? catchItem.countShiny > 1 : catchItem.countNormal > 1" class="pokecards__pokecard__count">
              x {{ showShiny ? catchItem.countShiny : catchItem.countNormal }}
            </div>
            <v-card-title class="pokecards__pokecard__title">#{{codeOnlyNumber(catchItem.code)}} - {{ catchItem.caughtNormal || catchItem.caughtShiny ? catchItem.name : '???' }}</v-card-title>
            <img v-show="!showShiny" class="pokecards__pokecard__image" :src="`/assets/${catchItem.code}.png`" />
            <img v-show="showShiny" class="pokecards__pokecard__image" :src="`/assets/${catchItem.code}s.png`" />
        </v-card>
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
  gap: 15px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;

  .sort-select {
    max-width: 200px;
    min-width: 150px;
  }

  .search-bar {
    min-width: 200px;
    max-width: 300px;
    flex-grow: 1;
  }
}

.chip-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;

  .chip-filters {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__title {
      font-size: 0.9rem;
      font-weight: bold;
      color: gray;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
  }
}

.pokecards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;

  @media (max-width: 768px){
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

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

      @media (max-width: 768px){
        font-size: 16px;
      }
    }

    &__image {
      padding: 10px;
      height: 240px;
      object-fit: contain;
      width: 100%;
      filter: brightness(0) invert(0);

      @media (max-width: 768px){
        height: 150px;
      }
    }

    &__count{
      position: absolute;
      bottom: 5px;
      right: 5px;
      color: black;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: bold;
      font-size: 0.9rem;
      z-index: 2;
    }

    &.pokemon-caught{
      position: relative;
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
