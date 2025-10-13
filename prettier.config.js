/** @type {import("prettier").Config} */
export default {
  // Basic formatting
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "avoid",
  endOfLine: "lf",

  // Plugin configurations
  plugins: [
    "prettier-plugin-svelte",
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],

  // Svelte specific settings
  svelteIndentScriptAndStyle: true,
  svelteAllowShorthand: true,
  svelteStrictMode: false,

  // Import sorting configuration
  importOrder: [
    "^@core/(.*)$",
    "^@server/(.*)$",
    "^@ui/(.*)$",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ["typescript", "decorators-legacy"],

  // File type overrides
  overrides: [
    {
      files: "*.svelte",
      options: {
        parser: "svelte",
      },
    },
    {
      files: ["*.json", "*.jsonc"],
      options: {
        printWidth: 120,
      },
    },
    {
      files: ["*.md", "*.mdx"],
      options: {
        printWidth: 100,
        proseWrap: "always",
      },
    },
  ],
};
