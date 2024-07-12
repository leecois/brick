import { fileURLToPath } from 'url'

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").options} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  importOrder: [
    '<TYPES>',
    '^(react/(.*)$)|^(react$)|^(react-native(.*)$)',
    '^(next/(.*)$)|^(next$)',
    '^(expo(.*)$)|^(expo$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>^@a',
    '^@a/(.*)$',
    '',
    '<TYPES>^[.|..|~]',
    '^~/',
    '^[../]',
    '^[./]'
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '4.4.0',
  jsxSingleQuote: true,
  overrides: [
    {
      files: '*.json.hbs',
      options: {
        parser: 'json'
      }
    },
    {
      files: '*.js.hbs',
      options: {
        parser: 'babel'
      }
    }
  ],
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tailwindConfig: fileURLToPath(new URL('../../tooling/tailwind/web.ts', import.meta.url)),
  tailwindFunctions: ['cn', 'cva'],
  trailingComma: 'none'
}

export default config
