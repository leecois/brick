import ts from 'typescript-eslint'
import tailwind from 'eslint-plugin-tailwindcss'
import * as sortKeysCustomOrder from 'eslint-plugin-sort-keys-custom-order'

export default [
  {
    ignores: [
      '**/.*',
      '**/apps/nextjs/src/app/profile/page.tsx',
      '**/apps/nextjs/src/column/*.tsx',
      '**/db/src/client.ts',
      '**/dist/*',
      '**/env.ts',
      '**/packages/ui/src/chart.tsx',
      '**/packages/ui/src/command.tsx',
      '**/packages/ui/src/use-toast.ts',
      '**/tailwind/web.ts',
      '**/translate.js',
      '**/trpc/react.tsx'
    ]
  },
  {
    plugins: { 'sort-keys-custom-order': sortKeysCustomOrder },
    rules: {
      'sort-keys-custom-order/export-object-keys': 'error',
      'sort-keys-custom-order/import-object-keys': 'error',
      'sort-keys-custom-order/object-keys': 'error',
      'sort-keys-custom-order/type-keys': 'error'
    }
  },
  ...ts.configs.stylistic,
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        callees: ['classnames', 'clsx', 'ctl', 'cn'],
        config: './tooling/tailwind/web.ts',
        whitelist: ['toaster', 'notranslate', 'fi', 'fi-', 'fis']
      }
    }
  }
]
