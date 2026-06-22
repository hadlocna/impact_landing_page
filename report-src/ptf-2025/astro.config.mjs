import { defineConfig } from 'astro/config';

// The report is served as static files from impact.pelaterra.com/impactreports/2025/ptf.
// Build straight into that directory so Coolify serves the generated output unchanged.
// CSS / JS / images live in public/ and are referenced with relative paths, so the
// output works at the /impactreports/2025/ptf/ sub-path without a configured `base`.
export default defineConfig({
  outDir: '../../impactreports/2025/ptf',
  build: {
    // keep generated assets out of the way; the report's own assets sit at the root
    assets: '_astro',
  },
});
