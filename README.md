# deliberate-site

Marketing site for [Deliberate](https://github.com/angad729/deliberate) — engineering discipline for AI harnesses.

Live at **[deliberate.work](https://deliberate.work)**.

---

## What this is

Astro static site that documents the Deliberate skill library. Hosted on Cloudflare Pages.

The skill content itself lives in a separate repo ([angad729/deliberate](https://github.com/angad729/deliberate)) and is pulled in here as a git submodule at `content/deliberate/`. This keeps the skills repo small and clean for `npx skills add` consumers while letting the site render skill markdown directly.

---

## Local development

```
git clone --recurse-submodules https://github.com/angad729/deliberate-site.git
cd deliberate-site
npm install
npm run dev
```

Dev server at `http://localhost:4321`.

If you already cloned without submodules:

```
git submodule update --init --recursive
```

---

## Updating to latest skill content

When the `deliberate` repo ships new skills or edits, bump the submodule pointer:

```
cd content/deliberate
git pull origin main
cd ../..
git add content/deliberate
git commit -m "Bump deliberate submodule"
git push
```

Cloudflare Pages will rebuild with the new content.

---

## Structure

```
.
├── content/deliberate/       # submodule → angad729/deliberate
│   └── skills/<name>/SKILL.md
├── src/
│   ├── pages/                # Astro route files
│   ├── components/           # Header, Footer
│   ├── layouts/              # Layout.astro
│   ├── lib/skills.ts         # skill metadata (categories, taglines)
│   ├── content.config.ts     # points at submodule
│   └── styles/global.css
├── public/favicon.svg
└── astro.config.mjs
```

---

## Deployment

Auto-deploys to Cloudflare Pages on every push to `main`.

- **Framework preset:** Astro
- **Build command:** `npm install && npm run build`
- **Build output directory:** `dist`
- **Environment variables:** `NODE_VERSION=22`
- **Submodules:** enabled (Cloudflare Pages clones them automatically for public HTTPS submodules)

---

## License

Apache 2.0. Same as the skills repo.
