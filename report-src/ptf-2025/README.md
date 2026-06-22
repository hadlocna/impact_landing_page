# PTF 2025 Impact Report — Astro source

Astro rebuild of the Pela Terra Farmland 2025 Impact Report. The original was a
single hand-authored HTML file (a Claude Design handoff); this project recreates
the same pixel-perfect output as a component-based Astro site.

## Output / deployment

`npm run build` writes the static site straight into the repository's
`impactreports/2025/ptf/` directory (see `outDir` in `astro.config.mjs`).
Coolify serves that directory unchanged at
**impact.pelaterra.com/impactreports/2025/ptf**, so the generated output is
committed alongside this source.

After changing anything under `src/`, rebuild and commit both the source and the
regenerated files in `impactreports/2025/ptf/`.

## Structure

- `src/layouts/ReportLayout.astro` — document shell: fonts, stylesheet link,
  fixed nav chrome (progress bar, top bar, contents overlay), and the scroll
  script.
- `src/components/Divider.astro`, `Hero.astro` — reusable full-bleed primitives
  used across the numbered sections.
- `src/components/*.astro` — one component per report chapter (Cover, Contents,
  Foreword … Colophon), composed in `src/pages/index.astro`.
- `public/report-web.css`, `public/report-web.js`, `public/images/` — the
  report's styling, scroll/parallax behaviour and imagery, served verbatim with
  relative paths so the build works at the `/impactreports/2025/ptf/` sub-path
  without a configured `base`.

## Commands

```sh
npm install
npm run dev      # local preview
npm run build    # build into ../../impactreports/2025/ptf
```
