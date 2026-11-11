# Rohan Rajput — Portfolio (v4)

Editorial, big-type portfolio. Vite + React + TypeScript, no heavy 3D. Hover a project to see a live animated preview; click for the case study. EN/FR, Ctrl/Cmd+K palette.

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build && npm run preview

## Customise
- Content: `src/data.ts` (projects, toolkit, EN/FR strings; `ui4` holds the page copy).
- Hero photo: drop a transparent-background cut-out at `public/me.png` (about 1200px tall). It appears behind the scrolling name automatically.
- Real screenshot for a project: add `image: "/shots/name.png"` to the item.
- CV: replace `public/Rohan_Rajput_CV.pdf`.

## Live viewers ("3 online now · 1,284 views")
Real and anonymous: a random per-tab id is kept for ~45 s plus one running total. No IPs, no cookies. It needs a tiny backend, so it stays hidden in `npm run dev`.
1. Push the repo to GitHub and import it in Vercel (the `api/views.ts` function deploys automatically).
2. In the Vercel project: Storage / Marketplace → add **Upstash Redis** (free tier), connect it to the project.
3. Redeploy. The badge appears in the hero and footer.
