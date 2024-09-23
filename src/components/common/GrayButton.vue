<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  }
});

defineEmits(['click']);
</script>

<template>
  <button class="tab-button" @click="$emit('click')">
    {{ props.label }}
  </button>
</template>

<style scoped>
.tab-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  height: 52px;
  border-radius: 40px;
  background-color: #E8E8E8;
  color: #484848;

  font-weight: 400;
  font-size: 13px;
  line-height: 20px;

  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px 10px 10px 0;
}

.tab-button:hover {
  background-color: #484848;
  color: #ffffff;
}
</style>