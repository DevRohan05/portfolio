import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import CommandPalette, { type Cmd } from "./CommandPalette";
import Modal from "./Modal";
import Scene from "./Scene";
import { LINKS, byId, items, toolkit, ui, ui4, type Item, type Lang } from "./data";

const coarse = () => window.matchMedia("(hover: none)").matches;
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "fr") return saved;
  } catch { /* storage unavailable */ }
  return navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
}

/** Greeting preloader, once per session. */
function Preloader({ onDone }: { onDone: () => void }) {
  const words = ["Hello", "Namaste", "Bonjour", "Hola"];
  const [i, setI] = useState(0);
  const [leave, setLeave] = useState(false);
  useEffect(() => {
    const step = window.setTimeout(() => (i < words.length - 1 ? setI(i + 1) : setLeave(true)), i === 0 ? 800 : 480);
    return () => window.clearTimeout(step);
  }, [i, words.length]);
  useEffect(() => {
    if (!leave) return;
    const t = window.setTimeout(onDone, 900);
    return () => window.clearTimeout(t);
  }, [leave, onDone]);
  return (
    <div className={`pre ${leave ? "leave" : ""}`} role="presentation">
      <p key={i}><span className="dot" />{words[i]}</p>
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0h100v0C70 10 30 10 0 0z" /></svg>
    </div>
  );
}


type Live = { online: number; total: number } | null;

/** Anonymous live viewer count. Needs the /api/views function (see README); hidden if it isn't there. */
function useLive(): Live {
  const [live, setLive] = useState<Live>(null);
  useEffect(() => {
    let id = "";
    try {
      id = sessionStorage.getItem("vid") || "";
      if (!id) { id = Math.random().toString(36).slice(2, 12); sessionStorage.setItem("vid", id); }
    } catch { id = Math.random().toString(36).slice(2, 12); }
    let hit = true;
    try { hit = sessionStorage.getItem("hit") !== "1"; } catch { /* ignore */ }
    let dead = false;
    const beat = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const r = await fetch("/api/views", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, hit }) });
        if (!r.ok) return;
        const j = await r.json();
        if (typeof j.online === "number" && typeof j.total === "number" && !dead) {
          setLive({ online: j.online, total: j.total });
          if (hit) { hit = false; try { sessionStorage.setItem("hit", "1"); } catch { /* ignore */ } }
        }
      } catch { /* no backend (local dev): stay hidden */ }
    };
    beat();
    const t = window.setInterval(beat, 25000);
    return () => { dead = true; window.clearInterval(t); };
  }, []);
  return live;
}

function LiveChip({ live, lang }: { live: Live; lang: Lang }) {
  if (!live) return null;
  const n = new Intl.NumberFormat(lang === "fr" ? "fr-CA" : "en-CA");
  return (
    <p className="live" aria-live="polite">
      <i className="pulse" aria-hidden="true" />
      <b>{n.format(Math.max(1, live.online))}</b> {ui4.live.online[lang]}
      <span aria-hidden="true">·</span>
      <b>{n.format(live.total)}</b> {ui4.live.views[lang]}
    </p>
  );
}

function Hero({ lang, live }: { lang: Lang; live: Live }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const still = reduceMotion();
    let x = 0;
    let last = 0;
    let lastY = window.scrollY;
    let boost = 0;
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(50, now - last) : 16;
      last = now;
      const y = window.scrollY;
      boost = boost * 0.9 + (y - lastY) * 0.4;
      lastY = y;
      if (y > window.innerHeight * 1.2) return;
      x -= still ? 0 : dt * 0.045 + boost * 0.35;
      const w = el.scrollWidth / 2;
      if (w > 0) x = ((x % w) - w) % w;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const name = Array.from({ length: 8 }, (_, k) => <span key={k}>Rohan Rajput<i aria-hidden="true">—</i></span>);

  return (
    <section className="hero" id="top">
      <img ref={photoRef} className="hero-photo" src="/me.png" alt="" onError={(e) => (e.currentTarget.style.display = "none")} />
      <div className="hero-live"><LiveChip live={live} lang={lang} /></div>
      <div className="hero-role">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M6 6l12 12M18 8v10H8" /></svg>
        <p>{ui4.hero.role[lang]}<br /><small>{ui4.hero.sub[lang]}</small></p>
      </div>
      <svg className="ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs><path id="rc" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" /></defs>
        <text><textPath href="#rc" textLength="486" lengthAdjust="spacing">{ui4.hero.ring[lang]}</textPath></text>
      </svg>
      <div className="where">
        <span>{ui4.hero.where[lang]}</span>
        <i aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>
        </i>
      </div>
      <h1 className="marquee" aria-label="Rohan Rajput"><span className="track" ref={trackRef}>{name}</span></h1>
    </section>
  );
}

function WorkRow({ item, lang, onOpen, onHover }: { item: Item; lang: Lang; onOpen: (id: string) => void; onHover: (it: Item | null) => void }) {
  return (
    <li>
      <button
        className="work-row"
        onClick={() => onOpen(item.id)}
        onPointerEnter={(e) => e.pointerType === "mouse" && onHover(item)}
        onPointerLeave={() => onHover(null)}
        onFocus={() => onHover(item)}
        onBlur={() => onHover(null)}
        style={{ "--h": item.hue } as CSSProperties}
      >
        <span className="n">{item.period ? item.period[lang] : ui.status[item.status][lang]}</span>
        <span className="t">{item.title[lang]}</span>
        <span className="d">
          {item.status === "soon" && <em>{ui4.planned[lang]}</em>}
          {item.row === "experience" ? item.tagline[lang] : item.stack.slice(0, 2).join(" · ")}
        </span>
        <span className="row-thumb thumb" aria-hidden="true"><Scene item={item} active={false} /></span>
      </button>
    </li>
  );
}

/** Floating live preview that trails the cursor while a work row is hovered. */
function Preview({ item }: { item: Item | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, on: false });
  const [shown, setShown] = useState<Item | null>(null);

  useEffect(() => {
    if (item) setShown(item);
  }, [item]);

  useEffect(() => {
    if (coarse()) return;
    const p = pos.current;
    const onMove = (e: PointerEvent) => {
      p.tx = e.clientX;
      p.ty = e.clientY;
      if (!p.on) { p.x = p.tx; p.y = p.ty; p.on = true; }
    };
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      p.x += (p.tx - p.x) * 0.16;
      p.y += (p.ty - p.y) * 0.16;
      const tilt = Math.max(-8, Math.min(8, (p.tx - p.x) * 0.12));
      if (ref.current) ref.current.style.transform = `translate3d(${p.x}px,${p.y}px,0) translate(-50%,-50%) rotate(${tilt}deg)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className={`preview ${item ? "on" : ""}`} ref={ref} aria-hidden="true">
      <div className="thumb" style={{ "--h": (shown ?? items[0]).hue } as CSSProperties}>
        {shown && <Scene key={shown.id} item={shown} active={!!item} />}
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [pre, setPre] = useState(() => {
    try { return sessionStorage.getItem("pre") !== "1" && !reduceMotion(); } catch { return false; }
  });
  const [openId, setOpenId] = useState<string | null>(null);
  const [hover, setHover] = useState<Item | null>(null);
  const [more, setMore] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [clock, setClock] = useState("");
  const live = useLive();
  const isMac = useMemo(() => /Mac|iPhone|iPad/.test(navigator.platform), []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("lang", lang); } catch { /* ignore */ }
  }, [lang]);

  useEffect(() => {
    const tick = () =>
      setClock(new Intl.DateTimeFormat(lang === "fr" ? "fr-CA" : "en-CA", { hour: "2-digit", minute: "2-digit", timeZone: "America/Toronto" }).format(new Date()));
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, [lang]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  const open = useCallback((id: string) => { setHover(null); setOpenId(id); }, []);
  const close = useCallback(() => setOpenId(null), []);
  const flash = useCallback((msg: string) => { setToast(msg); window.setTimeout(() => setToast(""), 1800); }, []);
  const go = useCallback((id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" }), []);
  const flipLang = () => setLang((l) => (l === "en" ? "fr" : "en"));
  const donePre = useCallback(() => { try { sessionStorage.setItem("pre", "1"); } catch { /* ignore */ } setPre(false); }, []);

  const commands: Cmd[] = useMemo(
    () => [
      { id: "n-work", label: ui4.nav.work[lang], run: () => go("work") },
      { id: "n-about", label: ui4.nav.about[lang], run: () => go("about") },
      { id: "n-contact", label: ui4.nav.contact[lang], run: () => go("contact") },
      ...items.map((it) => ({ id: `o-${it.id}`, label: `${ui.palette.open[lang]}: ${it.title[lang]}`, run: () => open(it.id) })),
      { id: "cv", label: ui4.intro.cv[lang], run: () => window.open(LINKS.cv, "_blank") },
      { id: "gh", label: "GitHub", run: () => window.open(LINKS.github, "_blank", "noopener") },
      { id: "li", label: "LinkedIn", run: () => window.open(LINKS.linkedin, "_blank", "noopener") },
      { id: "copy", label: ui.palette.copy[lang], run: () => { navigator.clipboard?.writeText(LINKS.email).then(() => flash(ui.palette.copied[lang])); } },
      { id: "lang", label: ui.palette.toggle[lang], run: () => setLang((l) => (l === "en" ? "fr" : "en")) },
    ],
    [lang, go, open, flash],
  );

  const featured = ["psvox", "psweb", "ollama", "recognosco", "unreality"].map((id) => byId[id]);
  const rest = items.filter((i) => i.row === "projects" && i.id !== "unreality");
  const soon = items.filter((i) => i.row === "soon");
  const exp = items.filter((i) => i.row === "experience");
  const current = openId ? byId[openId] : null;
  const mailto = `mailto:${LINKS.email}?subject=${encodeURIComponent(ui.contact.subject[lang])}`;

  const list = (arr: Item[]) => (
    <ul className="work-list">
      {arr.map((it) => <WorkRow key={it.id} item={it} lang={lang} onOpen={open} onHover={setHover} />)}
    </ul>
  );

  return (
    <>
      {pre && <Preloader onDone={donePre} />}
      <a className="skip" href="#work">Skip to content</a>

      <header className="bar">
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>© Rohan Rajput</a>
        <nav aria-label="Primary">
          <a href="#work">{ui4.nav.work[lang]}</a>
          <a href="#about">{ui4.nav.about[lang]}</a>
          <a href="#contact">{ui4.nav.contact[lang]}</a>
          <a href={LINKS.cv} download className="cvlink">CV ↓</a>
          <button onClick={() => setPaletteOpen(true)} aria-label={ui.palette.placeholder[lang]} className="k">{isMac ? "⌘" : "Ctrl"} K</button>
          <button onClick={flipLang} aria-label={ui.palette.toggle[lang]}>{lang === "en" ? "FR" : "EN"}</button>
        </nav>
      </header>

      <main>
        <Hero lang={lang} live={live} />

        <section className="intro" id="about">
          <div className="wrap two">
            <h2 className="lead reveal">{ui4.intro.lead[lang]}</h2>
            <div className="reveal">
              <p>{ui4.intro.p[lang]}</p>
              <a className="cv-btn" href={LINKS.cv} download>
                <span className="cv-ico" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg></span>
                <span className="cv-txt"><strong>{ui4.intro.cv[lang]}</strong><small>PDF · {ui4.intro.cvSub[lang]}</small></span>
              </a>
            </div>
          </div>
        </section>

        <section className="work" id="work">
          <div className="wrap"><p className="kicker">{ui4.sections.exp[lang]}</p></div>
          {list(exp)}
          <div className="wrap"><p className="kicker">{ui4.sections.work[lang]}</p></div>
          {list(featured)}
          {more && list(rest)}
          <div className="more">
            <button className="pill-btn" onClick={() => setMore((m) => !m)} aria-expanded={more}>
              {more ? ui4.sections.less[lang] : ui4.sections.more[lang]} <sup>{rest.length}</sup>
            </button>
          </div>
          <div className="wrap"><p className="kicker">{ui4.sections.soon[lang]}</p></div>
          {list(soon)}
        </section>

        <section className="tools">
          <div className="wrap">
            <p className="kicker">{ui4.sections.tools[lang]}</p>
            <div className="tool-grid">
              {toolkit.map((t) => (
                <div key={t.id} className="tool reveal">
                  <h3>{t.title[lang]}</h3>
                  <ul>{t.items.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg">
          <div className="wrap two">
            <p className="kicker">{ui4.sections.about[lang]}</p>
            <ul className="edu reveal">
              {ui.about.edu.map((e) => (
                <li key={e.s}><strong>{e.t[lang]}</strong><span>{e.s}</span></li>
              ))}
              <li><strong>EN / FR</strong><span>{ui.about.lang[lang]}</span></li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="foot" id="contact" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--fx", `${e.clientX - r.left}px`); e.currentTarget.style.setProperty("--fy", `${e.clientY - r.top}px`); }}>
        <div className="curve" aria-hidden="true" />
        <div className="glow" aria-hidden="true" />
        <div className="wrap">
          <p className="status"><i className="pulse" aria-hidden="true" />{ui4.contact.note[lang]}</p>
          <h2 className="reveal">
            <span>{ui4.contact.l1[lang]}</span>
            <span className="l2">{ui4.contact.l2[lang]}<i className="blob" aria-hidden="true"><b>RR</b></i></span>
          </h2>

          <div className="mail-row">
            <a className="mail" href={mailto}><span>{LINKS.email}</span><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg></a>
            <button className="copy" onClick={() => { navigator.clipboard?.writeText(LINKS.email).then(() => flash(ui.palette.copied[lang])); }}>{ui4.contact.copy[lang]}</button>
          </div>

          <ul className="social">
            <li><a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><em>↗</em></a></li>
            <li><a href={LINKS.github} target="_blank" rel="noopener noreferrer"><span>GitHub</span><em>↗</em></a></li>
            <li><a href={LINKS.cv} download><span>{ui4.intro.cv[lang]}</span><em>↓</em></a></li>
            <li><a href={mailto}><span>{ui4.contact.cta[lang]}</span><em>→</em></a></li>
          </ul>

          <div className="foot-base">
            <span>{ui4.credits[lang]}</span>
            <LiveChip live={live} lang={lang} />
            <span>{ui4.contact.local[lang]} · Ottawa {clock}</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{ui4.contact.top[lang]} ↑</button>
          </div>
        </div>
      </footer>

      <Preview item={hover} />
      {current && <Modal item={current} lang={lang} onClose={close} onOpen={open} />}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} placeholder={ui.palette.placeholder[lang]} empty={ui.palette.empty[lang]} />
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
