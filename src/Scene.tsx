import { useEffect, useMemo, useRef, useState } from "react";
import { POSTER, SCENES } from "./scenes";
import type { Item } from "./data";

/** A live thumbnail: draws a small animated diagram of what the project does.
 *  Shows a hand-picked still frame at rest and animates while `active` (hover/focus/open),
 *  or while visible on touch devices. Respects reduced motion. Optional screenshot override. */
export default function Scene({ item, active }: { item: Item; active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(POSTER[item.art]);
  const [visible, setVisible] = useState(false);
  const touch = useMemo(() => window.matchMedia("(hover: none)").matches, []);
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const run = (active || touch) && visible && !reduce;
  const { art, hue, image } = item;

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setVisible(true);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || image) return;
    const draw = SCENES[art];
    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (!w || !h) return;
      const pw = Math.round(w * dpr);
      if (cv.width !== pw) {
        cv.width = pw;
        cv.height = Math.round(h * dpr);
      }
      const s = Math.min(cv.width / 320, cv.height / 180);
      ctx.setTransform(s, 0, 0, s, (cv.width - 320 * s) / 2, (cv.height - 180 * s) / 2);
      ctx.clearRect(0, 0, 320, 180);
      draw(ctx, timeRef.current, hue);
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(cv);
    let raf = 0;
    let last = 0;
    if (run) {
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        timeRef.current += last ? Math.min(0.05, (now - last) / 1000) : 0;
        last = now;
        paint();
      };
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [art, hue, run, image]);

  if (image) return <img className="scene" src={image} alt="" loading="lazy" />;
  return <canvas ref={ref} className="scene" aria-hidden="true" />;
}
