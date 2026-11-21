<script setup lang="ts">
import {computed} from 'vue';
import TabNav from '@/components/TabNav.vue';
import PlaceholderPanel from '@/components/PlaceholderPanel.vue';
import AdoptionDashboard from '@/pages/AdoptionDashboard.vue';
import AppointmentBooking from '@/pages/AppointmentBooking.vue';
import CovidMonitoring from '@/pages/CovidMonitoring.vue';
import MainOverview from '@/pages/MainOverview.vue';
import {TABS, useHashTab} from '@/navigation';

const {activeTab, setActiveTab} = useHashTab();
const activeLabel = computed(() => TABS.find((tab) => tab.id === activeTab.value)?.label ?? '');
</script>

<template>
  <div class="w-full max-w-[1390px] min-w-0 px-4 py-5 md:px-5">
    <header class="mb-5">
      <h1 class="sr-only">BeWell Adoption Dashboard</h1>
      <TabNav :tabs="TABS" :model-value="activeTab" @update:model-value="setActiveTab"/>
    </header>

    <main
        :id="`panel-${activeTab}`"
        role="tabpanel"
        :aria-labelledby="`tab-${activeTab}`"
    >
      <MainOverview v-if="activeTab === 'me'"/>
      <AdoptionDashboard v-else-if="activeTab === 'adoption-dashboard'"/>
      <AppointmentBooking v-else-if="activeTab === 'appointments'"/>
      <CovidMonitoring v-else-if="activeTab === 'covid-monitoring'"/>
      <PlaceholderPanel v-else :title="activeLabel"/>
    </main>
  </div>
</template>
