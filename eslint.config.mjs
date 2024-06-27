import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // TODO: Write custom ESlint config
      'no-useless-assignment': 'error',
    },
  },
  {
    ignores: [
      'webpack.common.js',
      'webpack.dev.js',
      'webpack.prod.js',
      'dist/',
    ],
  },
  pluginJs.configs.recommended,
];
