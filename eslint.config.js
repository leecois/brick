import ts from 'typescript-eslint'
import tailwind from 'eslint-plugin-tailwindcss'

export default [
  {
    ignores: [
      '**/.*',
      '**/env.ts',
      '**/trpc/react.tsx',
      '**/*.js',
      '**/column/*.tsx',
      '**/app/table.tsx',
      '**/components/globe.tsx',
      '**/tailwind/web.ts'
    ]
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
