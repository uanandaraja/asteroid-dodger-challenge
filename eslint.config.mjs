import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Rules that cause infinite fix loops with AI-generated code:
      // Agent writes natural apostrophes in JSX text → unfixable cycle
      "react/no-unescaped-entities": "off",
      // Anonymous arrow components always trigger this (e.g. const Foo = () => ...)
      "react/display-name": "off",
      // Agent can't reliably use next/image vs <img> without looping
      "@next/next/no-img-element": "off",
      // Accessibility rules require semantic context the agent lacks
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/aria-props": "off",
      "jsx-a11y/aria-proptypes": "off",
      "jsx-a11y/aria-unsupported-elements": "off",
      "jsx-a11y/role-has-required-aria-props": "off",
      "jsx-a11y/role-supports-aria-props": "off",
    },
  },
]);

export default eslintConfig;
