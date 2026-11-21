<template>
  <div class="card">
    <slot/>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  max-width: 100%;
  background-color: var(--color-card-bg);
}
</style>
