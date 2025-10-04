import nextConfig from '@next/eslint-plugin-next'
import prettierConfig from 'eslint-config-prettier/flat'
import reactHooks from 'eslint-plugin-react-hooks'
import neostandard from 'neostandard'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  prettierConfig,
  tseslint.configs.recommended,
  ...neostandard({
    ts: true,
    files: ['**/*.{ts,tsx}'],
    ignores: [
      ...neostandard.resolveIgnoresFromGitignore(),
      './packages/db/prisma/**/*.ts',
      'pnpm-lock.yaml',
    ],
  }),
  {
    files: ['./apps/client/**/*.{ts,tsx}'],
    ...nextConfig.configs.recommended,
    plugins: {
      'react-hooks': reactHooks,
    },
    settings: {
      next: {
        rootDir: './apps/client',
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    rules: {
      'import-x/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
          },
          pathGroups: [
            {
              pattern: '~/**',
              group: 'external',
              position: 'after',
            },
          ],
          groups: [
            ['external', 'builtin'],
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
      camelcase: 'off',
      '@stylistic/indent': 'off',
      '@stylistic/jsx-indent': 'off',
      '@stylistic/jsx-quotes': 'off',
      '@stylistic/no-tabs': 'off',
      '@stylistic/brace-style': 'off',
      '@stylistic/comma-dangle': 'off',
      '@stylistic/spaced-comment': 'off',
      '@stylistic/space-before-function-paren': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@stylistic/jsx-curly-newline': 'off',
    },
  },
)
