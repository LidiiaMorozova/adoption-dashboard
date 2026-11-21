<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {storeToRefs} from 'pinia';
import LineChart, {type LineSeries} from '@/components/charts/LineChart.vue';
import MoodFace, {type Mood} from '@/components/main/MoodFace.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import {useSymptomsStore} from '@/stores/symptoms';
import {FEVER_THRESHOLD, RATING_LABELS, type Rating, type SymptomEntry} from '@/types/covid';

const store = useSymptomsStore();
const {entries, status, error} = storeToRefs(store);

onMounted(() => {
  if (status.value !== 'success') void store.load();
});

/** Days shown in the trend charts. */
const TREND_DAYS = 14;

const now = new Date();
const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
const todayText = new Intl.DateTimeFormat('en-GB', {weekday: 'long', day: 'numeric', month: 'long'}).format(now);

const isToday = (iso: string) => new Date(iso).toDateString() === now.toDateString();
const time = new Intl.DateTimeFormat('en-GB', {hour: '2-digit', minute: '2-digit'});
const shortDay = new Intl.DateTimeFormat('en-GB', {weekday: 'short', day: 'numeric'});
const fullDate = new Intl.DateTimeFormat('en-GB', {weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'});

/** The newest check-in made today, if any; entries arrive newest first. */
const todayEntry = computed<SymptomEntry | null>(() => entries.value.find((entry) => isToday(entry.recordedAt)) ?? null);

/** The face follows the "How do you feel overall?" rating. */
function moodFor(rating: Rating): Mood {
  if (rating >= 4) return 'good';
  if (rating === 3) return 'okay';
  return 'bad';
}

const mood = computed(() => (todayEntry.value ? moodFor(todayEntry.value.wellbeing) : null));
const moodHeadline: Record<Mood, string> = {
  good: "You're feeling good today",
  okay: "You're feeling so-so today",
  bad: "You're not feeling well today",
};

/** The latest check-in of each day, oldest day first, so every point on the charts is one day. */
const trend = computed(() => {
  const seenDays = new Set<string>();
  const daily: SymptomEntry[] = [];
  for (const entry of entries.value) {
    const day = new Date(entry.recordedAt).toDateString();
    if (seenDays.has(day)) continue;
    seenDays.add(day);
    daily.push(entry);
    if (daily.length === TREND_DAYS) break;
  }
  return daily.reverse();
});
const labels = computed(() => trend.value.map((entry) => shortDay.format(new Date(entry.recordedAt))));
const titles = computed(() => trend.value.map((entry) => fullDate.format(new Date(entry.recordedAt))));

const formatTemperature = (value: number) => `${value.toFixed(1)} °C`;
const formatRating = (value: number) => `${value}/5 · ${RATING_LABELS[value as Rating] ?? ''}`;

const temperatureSeries = computed<LineSeries[]>(() => [{
  label: 'Temperature',
  data: trend.value.map((entry) => entry.temperature),
  color: '#6250D6',
  format: formatTemperature,
}]);

const temperatureRange = computed(() => {
  const values = trend.value.map((entry) => entry.temperature);
  return {
    min: Math.floor(Math.min(36, ...values) - 0.5),
    max: Math.ceil(Math.max(FEVER_THRESHOLD + 1, ...values) + 0.5),
  };
});

// Fixed categorical order, validated for color-vision deficiencies; marker shapes add a second cue.
const ratingSeries = computed<LineSeries[]>(() => [
  {label: 'Feeling', data: trend.value.map((e) => e.wellbeing), color: '#2A78D6', pointStyle: 'circle', format: formatRating},
  {label: 'Appetite', data: trend.value.map((e) => e.appetite), color: '#EB6834', pointStyle: 'rect', format: formatRating},
  {label: 'Sleep', data: trend.value.map((e) => e.sleep), color: '#1BAF7A', pointStyle: 'triangle', format: formatRating},
]);

const cardClass = 'min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6';
const ctaClass = 'inline-flex items-center rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-500';
</script>

<template>
  <section aria-labelledby="main-heading" class="mx-auto flex w-full max-w-5xl flex-col gap-5">
    <div>
      <h2 id="main-heading" class="text-2xl font-semibold">Hello!</h2>
      <p class="mt-1 text-sm text-muted">{{ greeting }}. Today is {{ todayText }}.</p>
    </div>

    <div v-if="status === 'loading' || status === 'idle'" aria-busy="true" class="flex flex-col gap-5">
      <p role="status" class="sr-only">Loading how you have been feeling…</p>
      <div class="h-40 animate-pulse rounded-2xl bg-white"/>
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div class="h-72 animate-pulse rounded-2xl bg-white"/>
        <div class="h-72 animate-pulse rounded-2xl bg-white"/>
      </div>
    </div>

    <ErrorState
        v-else-if="status === 'error'"
        title="We couldn't load your check-ins"
        :message="error ?? ''"
        @retry="store.load()"
    />

    <template v-else>
      <div :class="cardClass" class="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left" data-testid="today-mood">
        <MoodFace :mood="mood"/>
        <div class="flex flex-col items-center gap-2 sm:items-start">
          <template v-if="todayEntry && mood">
            <h3 class="text-lg font-semibold">{{ moodHeadline[mood] }}</h3>
            <p class="text-sm text-muted">
              From your check-in at {{ time.format(new Date(todayEntry.recordedAt)) }}:
              feeling {{ formatRating(todayEntry.wellbeing) }}.
            </p>
            <dl class="flex flex-wrap justify-center gap-2 text-xs sm:justify-start">
              <div class="flex gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                <dt class="text-muted">Temperature</dt>
                <dd class="font-medium">{{ formatTemperature(todayEntry.temperature) }}</dd>
              </div>
              <div class="flex gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                <dt class="text-muted">Appetite</dt>
                <dd class="font-medium">{{ formatRating(todayEntry.appetite) }}</dd>
              </div>
              <div class="flex gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                <dt class="text-muted">Sleep</dt>
                <dd class="font-medium">{{ formatRating(todayEntry.sleep) }}</dd>
              </div>
              <div v-if="todayEntry.temperature >= FEVER_THRESHOLD" class="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-800">
                <dt class="sr-only">Note</dt>
                <dd>Fever</dd>
              </div>
            </dl>
            <a href="#covid-monitoring" class="text-sm font-medium text-brand-800 underline underline-offset-2 hover:text-brand-700">
              Add another check-in
            </a>
          </template>
          <template v-else>
            <h3 class="text-lg font-semibold">How are you feeling today?</h3>
            <p class="text-sm text-muted">You haven't checked in yet today. It takes less than a minute.</p>
            <a href="#covid-monitoring" :class="ctaClass">Add today's check-in</a>
          </template>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div :class="cardClass">
          <h3 class="text-base font-semibold">Temperature</h3>
          <p class="mb-3 text-xs text-muted">°C, latest check-in of each day</p>
          <LineChart
              v-if="trend.length >= 2"
              :labels="labels"
              :titles="titles"
              :series="temperatureSeries"
              :y-min="temperatureRange.min"
              :y-max="temperatureRange.max"
              :y-step="1"
              :y-tick="(value) => `${value}°`"
              :reference-line="{value: FEVER_THRESHOLD, label: `Fever ${FEVER_THRESHOLD.toFixed(1)} °C`}"
              description="Line chart of your temperature over recent days"
          />
          <p v-else class="py-10 text-center text-sm text-muted">Check in on at least two days to see a trend.</p>
        </div>

        <div :class="cardClass">
          <h3 class="text-base font-semibold">Feeling, appetite and sleep</h3>
          <p class="mb-3 text-xs text-muted">1 (very poor) to 5 (very good), latest check-in of each day</p>
          <LineChart
              v-if="trend.length >= 2"
              :labels="labels"
              :titles="titles"
              :series="ratingSeries"
              :y-min="1"
              :y-max="5"
              :y-step="1"
              description="Line chart of your feeling, appetite and sleep ratings over recent days"
          />
          <p v-else class="py-10 text-center text-sm text-muted">Check in on at least two days to see a trend.</p>
        </div>
      </div>
    </template>
  </section>
</template>
