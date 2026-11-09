import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import globals from 'globals';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

const root = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: ['**/node_modules/**', 'local-archive/**', 'test-results/**', 'playwright-report/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { ecmaVersion: 'latest', globals: globals.node },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'no-empty': 'error',
      'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.spec.{js,mjs,cjs}', '**/fixtures.{js,mjs,cjs}'],
    plugins: { playwright },
    rules: {
      'playwright/no-focused-test': 'error',
      'playwright/missing-playwright-await': ['error', { includePageLocatorMethods: true }],
      'playwright/no-conditional-expect': 'error',
      'playwright/valid-expect': 'error',
    },
  },
  {
    files: ['.agents/skills/qa-playwright-api-authoring/examples/orders/*.mjs'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: './jsconfig.eslint.json', tsconfigRootDir: root },
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: { '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: false }] },
  },
  // Formatting belongs to Prettier, after correctness rules.
  prettier,
];
