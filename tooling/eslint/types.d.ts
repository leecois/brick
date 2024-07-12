/**
 * Since the ecosystem hasn't fully migrated to ESLint's new FlatConfig system yet,
 * we "need" to type some of the plugins manually :(
 */

declare module '@eslint/js' {
  // Why the hell doesn't eslint themselves export their types?
  import type { Linter } from 'eslint'

  export const configs: {
    readonly all: { readonly rules: Readonly<Linter.RulesRecord> }
    readonly recommended: { readonly rules: Readonly<Linter.RulesRecord> }
  }
}

declare module 'eslint-plugin-import' {
  import type { Linter, Rule } from 'eslint'

  export const configs: {
    recommended: { rules: Linter.RulesRecord }
  }
  export const rules: Record<string, Rule.RuleModule>
}

declare module 'eslint-plugin-react' {
  import type { Linter, Rule } from 'eslint'

  export const configs: {
    all: { rules: Linter.RulesRecord }
    'jsx-runtime': { rules: Linter.RulesRecord }
    recommended: { rules: Linter.RulesRecord }
  }
  export const rules: Record<string, Rule.RuleModule>
}

declare module 'eslint-plugin-react-hooks' {
  import type { Linter, Rule } from 'eslint'

  export const configs: {
    recommended: {
      rules: {
        'exhaustive-deps': Linter.RuleEntry
        'rules-of-hooks': Linter.RuleEntry
      }
    }
  }
  export const rules: Record<string, Rule.RuleModule>
}

declare module '@next/eslint-plugin-next' {
  import type { Linter, Rule } from 'eslint'

  export const configs: {
    'core-web-vitals': { rules: Linter.RulesRecord }
    recommended: { rules: Linter.RulesRecord }
  }
  export const rules: Record<string, Rule.RuleModule>
}

declare module 'eslint-plugin-turbo' {
  import type { Linter, Rule } from 'eslint'

  export const configs: {
    recommended: { rules: Linter.RulesRecord }
  }
  export const rules: Record<string, Rule.RuleModule>
}
