import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        React: 'writable'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin
    },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactPlugin.configs.all.rules,
      ...hooksPlugin.configs.recommended.rules,
      'react/button-has-type': 'off',
      'react/forbid-component-props': 'off',
      'react/function-component-definition': 'off',
      'react/hook-use-state': 'off',
      'react/jsx-child-element-spacing': 'off',
      'react/jsx-closing-bracket-location': 'off',
      'react/jsx-curly-newline': 'off',
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'react/jsx-handler-names': 'off',
      'react/jsx-indent': 'off',
      'react/jsx-indent-props': 'off',
      'react/jsx-max-depth': 'off',
      'react/jsx-max-props-per-line': 'off',
      'react/jsx-newline': 'off',
      'react/jsx-no-bind': 'off',
      'react/jsx-no-constructed-context-values': 'off',
      'react/jsx-no-literals': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-pascal-case': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/no-array-index-key': 'off',
      'react/no-multi-comp': 'off',
      'react/no-unstable-nested-components': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off'
    }
  }
]
