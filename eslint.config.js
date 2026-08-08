export default [
  { ignores: ["dist", "node_modules", "public", "src/**/*.ts", "src/**/*.tsx", "tests/**/*.ts"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {},
  },
];
