import { defineConfig } from 'astro/config';

// The report is served as static files from impact.pelaterra.com/impactreports/2025/ptf.
// Build straight into that directory so Coolify serves the generated output unchanged.
// CSS / JS / images live in public/ and are referenced with root-absolute paths so
// the output still works when the page is opened without a trailing slash.
export default defineConfig({
  outDir: '../../impactreports/2025/ptf',
  build: {
    // keep generated assets out of the way; the report's own assets sit at the root
    assets: '_astro',
  },
});
