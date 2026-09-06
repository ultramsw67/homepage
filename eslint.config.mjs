export default [
  { ignores: ['node_modules/**', 'dist/**', '.firebase/**', 'lib/**', 'rss/**', 'test-results/**', 'playwright-report/**', 'tmp/**'] },
  { files: ['**/*.{js,jsx,mjs}'], languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } }, rules: { 'no-debugger': 'error', 'no-dupe-args': 'error', 'no-dupe-keys': 'error', 'constructor-super': 'error', 'valid-typeof': 'error' } },
];
