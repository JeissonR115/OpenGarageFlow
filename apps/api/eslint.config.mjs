import { defineConfig } from 'eslint/config';
import globals from 'globals';
import baseConfig from '../../eslint.config.mjs';

export default defineConfig([
  ...baseConfig,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
