<script setup>
import { fisherService } from '~/_services';

const ready = ref(false)
const achievements = ref([])
const sortBy = ref('number') // 'number' ou 'percentage'

const sortOptions = [
  { title: 'Par numéro', value: 'number' },
  { title: 'Par pourcentage de réussite', value: 'percentage' }
]

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} à ${hours}:${minutes}`;
};

const sortedAchievements = computed(() => {
  const sorted = [...achievements.value];
  
  if (sortBy.value === 'percentage') {
    return sorted.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  }
  
  return sorted.sort((a, b) => a.number - b.number);
});

onBeforeMount(async () => {
  achievements.value = await fisherService.getUserAchievements();
  ready.value = true
});
</script>

<template>
  <div class="container">
    <h1 class="container__title">Tes Succès</h1>
    
    <div class="filters" v-if="ready">
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
    </div>
    
    <div class="achievements-list" v-if="ready">
      <div 
        v-for="achievement in sortedAchievements" 
        :key="achievement.number"
        class="achievement-row"
        :class="[{ 'achievement-row--acquired': achievement.unlocked }, `achievement-row--tier--${achievement.tier}`]"
      >
        <div class="achievement-row__title">
          #{{ achievement.number }} - {{ achievement.unlocked ? achievement.name : '???' }}
        </div>

        <div class="achievement-row__description">
          {{ achievement.unlocked ? achievement.description : '???' }}
        </div>

        <div class="achievement-row__meta">
          <div class="achievement-row__date" v-if="achievement.unlocked">
            Obtenu le {{ formatDate(achievement.date) }}
          </div>
          <div class="achievement-row__value">
            {{ achievement.unlocked ? achievement.value : '???' }} pts
          </div>
          <div class="achievement-row__percentage">
             {{ achievement.percentage || 0 }}% 👥
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 20px;
  background: transparent;
  min-height: 100vh;

  &__title {
    width: fit-content;
    margin: auto;
    font-size: 36px;
    font-weight: 800;
    color: white;
    margin-bottom: 20px;
    letter-spacing: 1px;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
}

.filters {
  display: flex;
  gap: 15px;
  justify-content: right;
  margin-bottom: 20px;
  flex-wrap: wrap;
  border-radius: 12px;
  backdrop-filter: blur(10px);

  .sort-select {
    max-width: fit-content;
    min-width: 150px;
    color: white;
  }
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 auto;
}

.achievement-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  border-left: 4px solid #666;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &--acquired {
    border-left-width: 6px;

    @each $tier, $color in $tier-colors {
      &.achievement-row--tier--#{$tier} {
        border: 1px solid $color;
        border-left: 4px solid $color;
        
        .achievement-row__title, .achievement-row__value, .achievement-row__description, .achievement-row__date {
          color: $color;
        }
      }
    }
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: white;
    min-width: 500px;
    letter-spacing: 0.5px;
  }

  &__description {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    flex-grow: 1;
    line-height: 1.4;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 20px;
    min-width: 180px;
    justify-content: flex-end;
  }
  
  &__date {
    font-size: 12px;
    color: white;
    border-radius: 6px;
    white-space: nowrap;
  }

  &__value {
    font-size: 12px;
    font-weight: 700;
    color: white;
    border-radius: 6px;
    white-space: nowrap;
    text-align: right;
    min-width: 50px;
  }

  &__percentage {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
    text-align: right;
    min-width: 50px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    &__title {
      width: 100%;
    }

    &__meta {
      width: 100%;
      justify-content: space-between;
    }
  }
}

:deep(.v-select) {
  .v-field {
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
  }

  .v-field__input {
    color: white;
  }

  .v-field__control {
    color: white;
  }
}
</style>
