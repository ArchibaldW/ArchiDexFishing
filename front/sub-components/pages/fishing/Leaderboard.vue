<script setup>
</script>

<template>
  <div class="container">
    <h1 class="container__title">Kikimeter - Leaderboard</h1>
    <div class="placeholder">
      <p>Le classement sera bientôt disponible ! 🏆</p>
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
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 40px;
    color: white;
  }
}

.placeholder {
  background: white;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  margin: 0 auto;

  p {
    font-size: 18px;
    color: #666666;
    font-weight: 500;
  }
}
</style>
