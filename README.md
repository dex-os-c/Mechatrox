# MECHATROX 2K26

Symposium website for the **Department of Mechatronics Engineering**,
Er. Perumal Manimekalai College of Engineering (PMC Tech, Autonomous).

Built as a real React project — not a single static HTML file — using:

- **Vite + React 19** — build tooling and component structure
- **Three.js + @react-three/fiber + @react-three/drei** — the 3D scenes
- **GSAP + ScrollTrigger** — entrance and scroll-reveal animation
- **Lenis** — inertia/smooth scrolling
- **Tailwind CSS v4** — utility styling on top of a custom design-token system (`src/index.css`)

## What's inside

- Hero section with a real animated **RobotExpressive** 3D model (idle animation) drifting
  in front of a procedurally generated node network
- An interactive **"Lineup"** index — hover or tap any of the 10 events and its 3D icon
  swaps live in the preview pane
- A real **rubber duck** 3D model used for Circuit Debugging (rubber-duck debugging)
- 10 event cards across two tracks, sourced from the official poster
- Smooth inertia scrolling, custom cursor, scroll-triggered reveals, a preloader that
  cannot get stuck (it force-dismisses itself after 4s no matter what)

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

## Deploying

`npm run build` produces a static `dist/` folder — drag-and-drop it onto
[Netlify Drop](https://app.netlify.com/drop), or connect the repo to
Vercel/Netlify/GitHub Pages and set the build command to `npm run build`
with output directory `dist`.

## Editing content

All event copy, dates, venue, and college details live in one place:
`src/data/events.js`. Nothing else needs to change if you're just updating
text, the date, the venue, or the entry fee.

## 3D models

`public/models/robot.glb` and `public/models/duck.glb` are pulled from
Three.js's own official example asset library (permissively licensed, used
widely across the Three.js ecosystem). If you want different models —
a real circuit board, a trophy, a cricket bat — drop a `.glb` into
`public/models/` and reference it with `useGLTF('/models/yourfile.glb')`
inside `src/three/EventIcons.jsx` or `src/three/Hero3D.jsx`.

## Structure

```
src/
  components/     Navbar, Hero, Marquee, Lineup, About, EventsSection, Footer, Preloader, Cursor
  three/          Hero3D.jsx (robot + network), EventIcons.jsx (10 event icons)
  data/           events.js — all real content in one file
  hooks/          useLenis.js — smooth scroll wiring
public/
  models/         robot.glb, duck.glb
```
