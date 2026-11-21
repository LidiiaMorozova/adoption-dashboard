import {onBeforeUnmount, onMounted, ref} from 'vue';

export interface TabDefinition {
  id: string;
  label: string;
}

export const TABS: TabDefinition[] = [
  {id: 'me', label: 'Me'},
  {id: 'adoption-dashboard', label: 'Adoption dashboard'},
  {id: 'covid-monitoring', label: 'Covid monitoring'},
  {id: 'appointments', label: 'Book appointment'},
  {id: 'kiosk-usage', label: 'Kiosk usage'},
];

export const DEFAULT_TAB = 'me';

const tabFromHash = (): string => {
  const id = window.location.hash.replace(/^#\/?/, '');
  return TABS.some((tab) => tab.id === id) ? id : DEFAULT_TAB;
};

/** The active tab, kept in the URL hash so tabs can be linked to and survive a reload. */
export function useHashTab() {
  const activeTab = ref(tabFromHash());

  const sync = () => {
    activeTab.value = tabFromHash();
  };

  const setActiveTab = (id: string) => {
    activeTab.value = id;
    if (window.location.hash !== `#${id}`) {
      window.location.hash = id;
    }
  };

  onMounted(() => window.addEventListener('hashchange', sync));
  onBeforeUnmount(() => window.removeEventListener('hashchange', sync));

  return {activeTab, setActiveTab};
}
