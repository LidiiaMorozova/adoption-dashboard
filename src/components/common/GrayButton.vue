<script setup lang="ts">
import {ref} from 'vue';

withDefaults(defineProps<{
  label: string;
  active?: boolean;
}>(), {
  active: false,
});

defineEmits<{
  click: [];
}>();

const button = ref<HTMLButtonElement | null>(null);

defineExpose({
  focus: () => button.value?.focus(),
});
</script>

<template>
  <button
      ref="button"
      type="button"
      class="tab-button"
      :class="{ 'tab-button--active': active }"
      @click="$emit('click')"
  >
    {{ label }}
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
  background-color: var(--color-button-bg);
  color: var(--color-button-text);

  font-family: var(--font-family);
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
  white-space: nowrap;

  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px 10px 10px 0;
}

.tab-button:hover,
.tab-button--active {
  background-color: var(--color-button-active-bg);
  color: var(--color-button-active-text);
}

.tab-button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
