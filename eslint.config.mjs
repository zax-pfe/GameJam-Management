import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // User images come from Supabase Storage and are already resized client-side
      // before upload; plain <img> keeps the app portable (Cloudflare Workers).
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".open-next/**", ".wrangler/**"]),
]);

export default eslintConfig;
