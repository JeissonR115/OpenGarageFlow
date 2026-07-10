module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
  env: {
    node: true,
    es2024: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};
