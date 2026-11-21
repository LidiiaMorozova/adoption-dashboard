<script setup lang="ts">
import type {ComponentPublicInstance} from 'vue';
import GrayButton from './common/GrayButton.vue';
import type {TabDefinition} from '@/navigation';

const props = defineProps<{
  tabs: TabDefinition[];
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [id: string];
}>();

type ButtonInstance = ComponentPublicInstance & {focus: () => void};
const buttons: (ButtonInstance | null)[] = [];

const setButton = (el: Element | ComponentPublicInstance | null, index: number) => {
  buttons[index] = el as ButtonInstance | null;
};

// Arrow keys move between tabs and activate them, following the WAI-ARIA tabs pattern.
function onKeydown(event: KeyboardEvent, index: number) {
  const last = props.tabs.length - 1;
  const targets: Record<string, number> = {
    ArrowRight: index === last ? 0 : index + 1,
    ArrowLeft: index === 0 ? last : index - 1,
    Home: 0,
    End: last,
  };
  const next = targets[event.key];
  const tab = next === undefined ? undefined : props.tabs[next];
  if (next === undefined || !tab) return;

  event.preventDefault();
  emit('update:modelValue', tab.id);
  buttons[next]?.focus();
}
</script>

<template>
  <div
      role="tablist"
      aria-label="Sections"
      class="-mx-4 flex flex-nowrap overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
  >
    <GrayButton
        v-for="(tab, index) in tabs"
        :id="`tab-${tab.id}`"
        :key="tab.id"
        :ref="(el) => setButton(el, index)"
        :label="tab.label"
        :active="tab.id === modelValue"
        role="tab"
        :aria-selected="tab.id === modelValue"
        :aria-controls="`panel-${tab.id}`"
        :tabindex="tab.id === modelValue ? 0 : -1"
        @click="emit('update:modelValue', tab.id)"
        @keydown="onKeydown($event, index)"
    />
  </div>
</template>
