import pluginVue from 'eslint-plugin-vue';
import {defineConfigWithVueTs, vueTsConfigs} from '@vue/eslint-config-typescript';

export default defineConfigWithVueTs(
  {
    name: 'app/ignores',
    ignores: ['dist/**', 'server/**', 'playwright-report/**', 'test-results/**', 'node_modules/**'],
  },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    name: 'app/rules',
    rules: {
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
    },
  },
);
