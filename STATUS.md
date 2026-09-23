# STATUS.md — coordination doc for parallel Claude sessions

This file exists so a fresh Claude session (or a human) can get oriented in
under a minute instead of re-reading the whole diff history. **Update the
relevant section before your context runs out or before you open a PR.**

---

## Branches

- `main` — stable, mergeable-only-after-review
- `feat/claude-a` — this session. Built the initial full MVP (see below).
- `feat/claude-b` — reserved for the second session. Not created yet as of
  this writing — nothing has been pushed there.

## Session A — done

Built the full MECHATROX 2K26 site from scratch as a real Vite + React
project (previously it only existed as a single self-contained HTML file
with embedded assets, which is why this rebuild happened). Everything below
is committed on `feat/claude-a`, one concern per commit:

- Scaffold: Vite + React 19 + Tailwind v4 (`package.json`, `vite.config.js`, `index.html`)
- Design system / global styles: `src/index.css`
- Content layer: `src/data/events.js` — **all real copy lives here** (event
  names, tags, descriptions, college name/address, date, venue, entry fee).
  Sourced from the official poster.
- 3D assets: `public/models/robot.glb`, `public/models/duck.glb` (free,
  permissively-licensed models from Three.js's own example library)
- 3D layer: `src/three/Hero3D.jsx` (hero robot + node network),
  `src/three/EventIcons.jsx` (10 event icons, one real model + 9 procedural)
- Scroll: `src/hooks/useLenis.js` (Lenis + GSAP ScrollTrigger)
- Components: `src/components/*.jsx` — Preloader, Cursor, Navbar, Hero,
  Marquee, Lineup (interactive, swaps 3D preview live), About, EventsSection,
  Footer
- Wiring: `src/App.jsx`, `src/main.jsx`
- Docs: `README.md`

**Verified:** `npm install && npm run build` succeeds clean from a fresh
checkout of this branch (no errors, one non-blocking bundle-size warning —
see Known Issues).

## Known issues / not done

- **Bundle size**: main JS chunk is ~1.49 MB (432 KB gzip) — three.js +
  @react-three/fiber + drei + gsap add up. Not code-split. Fine for a
  symposium microsite but worth fixing if this needs to load fast on
  campus wifi.
- **No favicon/OG image specific to the event** — still using Vite's
  default favicon. No social share preview image/meta tags.
- **No CI / deploy config** — no GitHub Actions, no `vercel.json` /
  `netlify.toml`. Someone needs to either connect the repo to
  Vercel/Netlify directly or add config.
- **Accessibility pass not done** — no explicit `aria-label`s beyond the
  burger menu, no skip-link, contrast not audited beyond eyeballing it.
- **9 of 10 event icons are procedural geometry**, not real 3D models
  (only Circuit Debugging uses a real model — the rubber duck). If real
  models become available (trophy, cricket bat, gavel, etc.) they'd slot
  into `src/three/EventIcons.jsx`.
- **No tests.**
- Team size / duration / prize details are intentionally omitted from event
  cards since the poster didn't specify them per-event. Add to
  `src/data/events.js` if the organizers provide them.

## Suggested non-overlapping split for Session B

To avoid two sessions touching the same files, Session B could take any of
these — each is isolated to files Session A hasn't touched or has finished
with:

1. **Deploy + CI** (new files only): `.github/workflows/`, `vercel.json` or
   `netlify.toml`, and a `og-image` + meta tags added to `index.html`
   `<head>` (small, isolated edit).
2. **Performance**: code-split the 3D bundle (dynamic `import()` for the
   Canvas components), lazy-load `Lineup`/`Hero` 3D scenes. Touches
   `src/App.jsx` and `src/components/Hero.jsx`/`Lineup.jsx` — **coordinate
   with Session A's latest commit on those files first** (`git log -p` them)
   since this does touch shared files.
3. **New real 3D models**: swap procedural icons in
   `src/three/EventIcons.jsx` for real `.glb`s as they become available.
   Isolated to that one file + new files under `public/models/`.
4. **Accessibility + polish pass**: isolated to whichever component files
   need it — check `git diff main...feat/claude-a` first to see current
   state before editing.

Whoever picks a task: **add a line under here saying what you're taking**,
so the other session doesn't duplicate it.

- (Session A took: full MVP build, see above)
- Session B took: meta/favicon tags, deploy config, bundle code-splitting
  (items 1 and 2 above) — see below. **Not started**: accessibility pass,
  real 3D models for event icons.

## Session B — done (on `feat/claude-b`)

- `feat(meta)`: OG/Twitter meta tags, theme-color, apple-touch-icon in
  `index.html`. Note: og:image still points at `favicon.svg` as a
  placeholder — swap for a real 1200x630 PNG when one exists, most
  platforms won't render an SVG share preview.
- `chore(deploy)`: `vercel.json` + `netlify.toml`, both with SPA rewrite
  to `index.html` and long-cache immutable headers for `/assets` and
  `/models`.
- `perf`: split Hero's and Lineup's `<Canvas>` into their own files
  (`HeroCanvas.jsx`, `LineupCanvas.jsx`), lazy-loaded via `React.lazy` +
  `Suspense`. Main JS chunk: ~1.49 MB -> 344 KB; the ~966 KB three.js/GLTF
  weight now loads in its own chunk only once those sections mount.
  Also swapped `App.jsx`'s one-time `.reveal` query for a
  MutationObserver-based version, since revealed elements inside the new
  lazy chunks don't exist in the DOM on first render.
- Verified: `npm install && npm run build` succeeds clean from this branch.

### Requested but not built: Iron Man scroll-follow model

Asked to add a 3D Iron Man model that tracks scroll position. Declined to
source/build the actual Marvel character model — that's copyrighted IP,
not something to embed even via a free glTF pulled from the web. Offered
to build the same scroll-follow mechanic with the existing
`public/models/robot.glb` or a new generic mech design instead; awaiting
which direction to take before building it.

## Workflow reminder (from the humans)

- Before merging: `git fetch origin`, then `git log origin/main..HEAD` and
  `git diff main...feat/<other-branch>` to check for overlap/contradictions
  before opening or merging a PR.
- Commit often with clear messages — don't batch everything into one commit.
- Keep this file updated before you run low on context — that's what
  actually saves re-explanation time for the next session, not the token
  budget itself.
