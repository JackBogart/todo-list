import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // TODO: Write custom ESlint config
      'no-useless-assignment': 'error',
    },
  },
  pluginJs.configs.recommended,
];
