/// <reference types="./types.d.ts" />

import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'

/**
 * All packages that leverage t3-env should use this rule
 */
export const restrictEnvAccess = tseslint.config({
  files: ['**/*.js', '**/*.ts', '**/*.tsx'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        importNames: ['env'],
        message: "Use `import { env } from '~/env'` instead to ensure validated types.",
        name: 'process'
      }
    ],
    'no-restricted-properties': [
      'error',
      {
        message: "Use `import { env } from '~/env'` instead to ensure validated types.",
        object: 'process',
        property: 'env'
      }
    ]
  }
})

export default tseslint.config(
  {
    // Globally ignored files
    ignores: ['**/*.config.*']
  },
  {
    extends: [
      eslint.configs.recommended,
      eslint.configs.all,
      ...tseslint.configs.all,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked
    ],
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    plugins: {
      import: importPlugin,
      turbo: turboPlugin
    },
    rules: {
      ...turboPlugin.configs.recommended.rules,
      '@typescript-eslint/consistent-return': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { fixStyle: 'separate-type-imports', prefer: 'type-imports' }
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-misused-promises': [2, { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        { allowConstantLoopConditions: true }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/promise-function-async': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      camelcase: 'off',
      complexity: ['error', 70],
      'id-length': 'off',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-statements': ['error', 15],
      'new-cap': 'off',
      'no-console': 'off',
      'no-duplicate-imports': 'off',
      'no-nested-ternary': 'off',
      'no-ternary': 'off',
      'no-undefined': 'off',
      'no-underscore-dangle': 'off',
      'no-useless-assignment': 'off',
      'no-void': 'off',
      'one-var': 'warn',
      'sort-imports': 'off',
      'sort-vars': 'warn'
    }
  },
  {
    languageOptions: { parserOptions: { projectService: true } },
    linterOptions: { reportUnusedDisableDirectives: true }
  }
)
