<script setup lang="ts">
import {computed} from 'vue';

export type Mood = 'good' | 'okay' | 'bad';

const props = defineProps<{
  mood: Mood | null;
}>();

const faces = {
  good: {fill: '#DFF5DF', stroke: '#0A7A0A', mouth: 'M22 39 Q32 49 42 39', label: 'Smiling face'},
  okay: {fill: '#FDF0D2', stroke: '#9A6500', mouth: 'M22 42 L42 42', label: 'Neutral face'},
  bad: {fill: '#FBE3E3', stroke: '#B42F2F', mouth: 'M22 45 Q32 35 42 45', label: 'Sad face'},
} as const;

const face = computed(() => (props.mood ? faces[props.mood] : null));
</script>

<template>
  <svg
      viewBox="0 0 64 64"
      class="size-24 shrink-0"
      role="img"
      :aria-label="face ? face.label : 'No check-in yet today'"
      :data-mood="mood ?? 'none'"
  >
    <template v-if="face">
      <circle cx="32" cy="32" r="29" :fill="face.fill" :stroke="face.stroke" stroke-width="3"/>
      <circle cx="23" cy="26" r="3.2" :fill="face.stroke"/>
      <circle cx="41" cy="26" r="3.2" :fill="face.stroke"/>
      <path :d="face.mouth" fill="none" :stroke="face.stroke" stroke-width="3.5" stroke-linecap="round"/>
    </template>
    <template v-else>
      <circle cx="32" cy="32" r="29" fill="#F3F3F3" stroke="#898781" stroke-width="3" stroke-dasharray="6 5"/>
      <text x="32" y="41" text-anchor="middle" font-size="26" font-weight="600" fill="#5F6670">?</text>
    </template>
  </svg>
</template>
