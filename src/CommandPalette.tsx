import { useEffect, useMemo, useRef, useState } from "react";

export type Cmd = { id: string; label: string; hint?: string; run: () => void };

export default function CommandPalette({
  open,
  onClose,
  commands,
  placeholder,
  empty,
}: {
  open: boolean;
  onClose: () => void;
  commands: Cmd[];
  placeholder: string;
  empty: string;
}) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? commands.filter((c) => c.label.toLowerCase().includes(s)) : commands;
  }, [q, commands]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setIdx(0), [q]);

  if (!open) return null;

  const exec = (c?: Cmd) => {
    if (!c) return;
    onClose();
    c.run();
  };

  return (
    <div className="palette-backdrop" onMouseDown={onClose} role="presentation">
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          else if (e.key === "ArrowDown") {
            e.preventDefault();
            setIdx((i) => Math.min(i + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setIdx((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") exec(results[idx]);
        }}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          spellCheck={false}
        />
        <ul>
          {results.length === 0 && <li className="palette-empty">{empty}</li>}
          {results.map((c, i) => (
            <li key={c.id}>
              <button
                className={i === idx ? "active" : ""}
                onMouseEnter={() => setIdx(i)}
                onClick={() => exec(c)}
              >
                <span>{c.label}</span>
                {c.hint && <kbd>{c.hint}</kbd>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
