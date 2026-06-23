import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const next = Array.isArray(nextCoreWebVitals) ? nextCoreWebVitals : [nextCoreWebVitals]

const config = [
  ...next,
  { ignores: ['.next/**', 'node_modules/**', 'out/**', 'public/**'] },
]

export default config
