# Pela Terra II — 2025 Impact Report

Static, self-contained web page. No build step, no framework, no runtime
dependencies — just `index.html` + `images/`. Deploy to any static host.

## Contents
```
site/
├── index.html      # the full report (single page)
├── images/         # 41 images, one version each — every file is referenced
└── README.md
```

## Deploy
Serve the `site/` folder as static files. Examples:

- **GitHub Pages** — push `site/` contents to the repo root (or `/docs`), enable
  Pages on that branch/folder. Done.
- **Netlify / Vercel / Cloudflare Pages** — set the publish directory to `site/`,
  no build command.
- **Existing site** — copy `index.html` and `images/` into the target directory.
  Keep `images/` as a sibling of `index.html` (paths are relative).

## Notes
- Fonts (Playfair Display, Libre Franklin, JetBrains Mono) load from Google Fonts
  over the network. To self-host, download them into `images/`’s sibling and
  swap the `<link>` in the `<head>`.
- The thin scroll progress bar at the top is driven by a tiny inline script at
  the end of `<body>`.
- A few editorial placeholder notes (e.g. “to be confirmed”, “[…to be completed]”)
  are still visible in the text. Search `index.html` for `to be confirmed`,
  `to be completed`, and `Map · land-use plan` to finalize or remove before
  going fully public.
