import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import { fixupConfigRules } from '@eslint/compat'

const next = Array.isArray(nextCoreWebVitals) ? nextCoreWebVitals : [nextCoreWebVitals]

// Strip the legacy babel parser bundled with next and let ESLint use its standard parser with JSX
const sanitizedNext = next.map((cfg) => {
  if (!cfg.languageOptions) return cfg
  const { parser: _unused, parserOptions, ...langRest } = cfg.languageOptions
  return {
    ...cfg,
    languageOptions: {
      ...langRest,
      parserOptions: {
        ...parserOptions,
        ecmaFeatures: {
          ...parserOptions?.ecmaFeatures,
          jsx: true,
        },
      },
    },
  }
})

const config = [
  ...fixupConfigRules(sanitizedNext),
  { ignores: ['.next/**', 'node_modules/**', 'out/**', 'public/**'] },
]

export default config
