import { useEffect, useRef, type CSSProperties } from "react";
import Scene from "./Scene";
import { items, ui, type Item, type Lang } from "./data";

export default function Modal({ item, lang, onClose, onOpen }: { item: Item; lang: Lang; onClose: () => void; onOpen: (id: string) => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Focus the dialog, not a button, so a trailing Enter keypress can't click Close.
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    backdropRef.current?.scrollTo({ top: 0 });
  }, [item.id]);

  const related = items.filter((i) => i.row === item.row && i.id !== item.id).slice(0, 3);

  return (
    <div className="modal-backdrop" ref={backdropRef} onMouseDown={onClose}>
      <div className="modal" ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={item.title[lang]} style={{ "--h": item.hue } as CSSProperties} onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={ui.modal.close[lang]}>✕</button>
        <div className="modal-top">
          <div className="thumb big"><Scene item={item} active /></div>
          <div className="modal-head">
            <p className="eyebrow">{item.badge[lang]}</p>
            <h2>{item.title[lang]}</h2>
            <p className="meta-line">
              <span className={`pill s-${item.status}`}>{ui.status[item.status][lang]}</span>
              {item.period && <span>{item.period[lang]}</span>}
            </p>
            <p className="syn">{item.synopsis[lang]}</p>
            {item.href && <a className="pill-btn" href={item.href} target="_blank" rel="noopener noreferrer">{ui.modal.repo[lang]} ↗</a>}
          </div>
        </div>

        <div className="modal-body">
          <div>
            <h3>{ui.modal.highlights[lang]}</h3>
            <ol className="episodes">
              {item.highlights.map((h, i) => (
                <li key={h.en}><span className="ep-n">{String(i + 1).padStart(2, "0")}</span><span>{h[lang]}</span></li>
              ))}
            </ol>
          </div>
          <aside>
            <h3>{ui.modal.stack[lang]}</h3>
            <ul className="tags">{item.stack.map((t) => <li key={t}>{t}</li>)}</ul>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="modal-more">
            <h3>{ui.modal.more[lang]}</h3>
            <ul className="mini-grid">
              {related.map((r) => (
                <li key={r.id}>
                  <button className="mini" style={{ "--h": r.hue } as CSSProperties} onClick={() => onOpen(r.id)}>
                    <span className="thumb"><Scene item={r} active={false} /></span>
                    <span className="mini-t"><strong>{r.title[lang]}</strong><small>{r.tagline[lang]}</small></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
