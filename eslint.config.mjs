import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-perf-check/**",
    ".next-cloudflare/**",
    ".open-next/**",
    ".wrangler/**",
    ".next-check/**",
    ".next-build-check/**",
    ".npm-cache/**",
    "studio/node_modules/**",
    "studio/dist/**",
    "studio/.sanity/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
