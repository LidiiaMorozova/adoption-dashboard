<script setup>
import {defineProps} from 'vue';

const props = defineProps({
  icon: Object,
  title: String,
});
</script>

<template>
  <div class="card-header">
    <component :is="props.icon" class="card-icon"/>
    <span class="card-header-title">{{ props.title }}</span>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-icon {
  width: 20px;
  height: 20px;
  margin: 0 5px;
  color: #00BFA5;
}

.card-header-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>