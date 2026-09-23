# STATUS.md — coordination doc for parallel Claude sessions

This file exists so a fresh Claude session (or a human) can get oriented in
under a minute instead of re-reading the whole diff history. **Update the
relevant section before your context runs out or before you open a PR.**

**Push after every commit, not just commit often.** A session's local
commits that never reach `origin` can be lost if the session's sandbox
resets — this happened once already on `feat/claude-a` (a favicon/meta-tag/
deploy-config batch was committed locally, not pushed, and vanished between
turns; it had to be redone). Committing isn't the safety net — pushing is.

---

## Branches

- `main` — stable, mergeable-only-after-review
- `feat/claude-a` — this session.
- `feat/claude-b` — reserved for the second session. Not created yet as of
  this writing.

## Session A — done

Built the full MECHATROX 2K26 site as a real Vite + React project (not a
single HTML file), then followed up with a scroll-driven hero animation and
a real performance pass. One concern per commit on `feat/claude-a`:

**Initial build** (merged into `main` via PR #1):
- Scaffold: Vite + React 19 + Tailwind v4
- Design system / global styles: `src/index.css`
- Content layer: `src/data/events.js` — all real copy (event names, tags,
  descriptions, college name/address, date, venue, entry fee), sourced from
  the official poster
- 3D assets: `public/models/robot.glb`, `public/models/duck.glb` (free,
  permissively-licensed models from Three.js's own example library)
- 3D layer: `src/three/Hero3D.jsx`, `src/three/EventIcons.jsx`
- Scroll: `src/hooks/useLenis.js` (Lenis + GSAP ScrollTrigger)
- Components: `src/components/*.jsx`
- Docs: `README.md`

**Follow-up round** (pushed after the merge, not yet in a new PR):
- `feat(seo)`: custom favicon (circuit-mark SVG), description + OG/Twitter
  meta tags, theme-color
- `chore(deploy)`: `vercel.json` + `netlify.toml`
- `refactor(3d)` + `feat(hero)`: **scroll-driven mech entrance**. Hero is now
  a 230vh sticky runway; a GSAP ScrollTrigger (scrub) drives the robot's
  actual `THREE.Group` position/rotation/scale from off-screen/tiny/spinning
  to its resting spot as you scroll, while the hero text fades/lifts out of
  the way. `RobotModel` now takes `onReady`/`introProgress` props so this
  can be driven from outside the R3F Canvas; idle mouse-parallax only
  re-engages once the scroll intro hits 100% progress (the two were fighting
  over `rotation.y` before this gate was added).
  - Note: an actual "Iron Man" model was requested — declined (Marvel/Disney
    IP). Built the same effect on the existing free, generic mech model
    instead.
- `perf`: lazy-load `Hero` and `Lineup` (the only two consumers of
  three.js/@react-three/fiber/drei) via `React.lazy` + `Suspense`. Reveal
  setup in `App.jsx` switched from a one-time `.reveal` DOM query to a
  `MutationObserver`, since these two now mount asynchronously.
- `chore(build)`: `vite.config.js` needed `build.rolldownOptions.output.
  codeSplitting: true` — this project's Vite (8.3.0) uses Rolldown, and
  without that flag `React.lazy` had no effect (everything still bundled
  into one file). **Result, verified**: main chunk dropped from
  ~433 KB gzip (everything) to **~124 KB gzip** for first paint; three.js/
  GLTF now loads as a separate ~258 KB gzip chunk fetched on demand. The
  "chunk larger than 500kB" build warning still appears because that GLTF
  chunk itself is inherently >500kB — this is expected and fine since it's
  async and non-blocking, not a sign the fix didn't work.

**Verified:** `npm install && npm run build` succeeds clean from a fresh
checkout of this branch after every round above.

## Known issues / not done

- **No CI** — no GitHub Actions. Deploy config exists (`vercel.json`,
  `netlify.toml`) but someone still needs to connect the repo to
  Vercel/Netlify, or add a workflow.
- **No OG *image*** — text meta tags exist, but no branded social-share
  preview image.
- **Accessibility pass not done** — no explicit `aria-label`s beyond the
  burger menu, no skip-link, contrast not audited beyond eyeballing it.
- **9 of 10 event icons are procedural geometry**, not real 3D models
  (only Circuit Debugging uses a real model — the rubber duck).
- **No tests.**
- Team size / duration / prize details intentionally omitted from event
  cards — the poster didn't specify them per-event. Add to
  `src/data/events.js` if organizers provide them.
- The `Gltf` async chunk (three.js + drei's GLTF loader, ~969 KB / ~258 KB
  gzip) is still one big chunk shared by Hero + Lineup. Could be split
  further (e.g. separate the loader from drei's other helpers) but wasn't —
  diminishing returns for a symposium microsite.

## Suggested non-overlapping split for Session B

1. **Deploy + CI** (new files only): `.github/workflows/`, plus an OG image
   + `<meta property="og:image">` in `index.html`.
2. **New real 3D models**: swap procedural icons in
   `src/three/EventIcons.jsx` for real `.glb`s as they become available.
   Isolated to that file + new files under `public/models/`.
3. **Accessibility + polish pass**: check `git diff main...feat/claude-a`
   first to see current state before editing shared component files.
4. **Extend the scroll-driven animation** to other sections (e.g. a similar
   scrub-driven reveal for the Lineup 3D preview) — touches
   `src/components/Lineup.jsx`, which Session A has finished with but not
   re-verify against your changes before merging.

Whoever picks a task: **add a line here saying what you're taking**, so the
other session doesn't duplicate it.

- (Session A took: full MVP build + scroll-mech follow-up, see above)

## Workflow reminder (from the humans)

- Before merging: `git fetch origin`, then `git log origin/main..HEAD` and
  `git diff main...feat/<other-branch>` to check for overlap/contradictions
  before opening or merging a PR.
- Commit often with clear messages — **and push right after committing**,
  don't batch (see the warning at the top of this file for why).
- Keep this file updated before you run low on context.
