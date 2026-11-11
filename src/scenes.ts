import type { Art } from "./data";
import { PLACES, landDots, ll2v } from "./geo";

type Ctx = CanvasRenderingContext2D;
/** Every scene draws into a 320x180 logical canvas. `t` is seconds, `h` is the accent hue. */
export type Draw = (c: Ctx, t: number, h: number) => void;

const TAU = Math.PI * 2;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const seg = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const hs = (h: number, l: number, a = 1, s = 88, dh = 0) => `hsl(${h + dh} ${s}% ${l}% / ${a})`;
const ink = (a: number) => `rgba(236,240,250,${a})`;
const MONO = '600 7px ui-monospace, "SF Mono", Menlo, Consolas, monospace';

function rr(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, Math.max(0, w), h, r);
}
function label(c: Ctx, s: string, x: number, y: number, color: string, align: CanvasTextAlign = "left", font = MONO) {
  c.font = font;
  c.fillStyle = color;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillText(s, x, y);
}
function dot(c: Ctx, x: number, y: number, r: number, color: string, glow = 0) {
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.fillStyle = color;
  if (glow) {
    c.shadowColor = color;
    c.shadowBlur = glow;
  }
  c.fill();
  c.shadowBlur = 0;
}
function tick(c: Ctx, x: number, y: number, s: number, color: string, lw = 2) {
  c.strokeStyle = color;
  c.lineWidth = lw;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.beginPath();
  c.moveTo(x - s, y);
  c.lineTo(x - s * 0.3, y + s * 0.7);
  c.lineTo(x + s, y - s * 0.7);
  c.stroke();
}
function panel(c: Ctx, x: number, y: number, w: number, h: number, r: number, stroke = 0.14, fill = 0.05) {
  rr(c, x, y, w, h, r);
  c.fillStyle = ink(fill);
  c.fill();
  c.strokeStyle = ink(stroke);
  c.lineWidth = 1;
  c.stroke();
}
function cartIcon(c: Ctx, x: number, y: number, color: string) {
  c.strokeStyle = color;
  c.lineWidth = 1.5;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(x + 3.5, y);
  c.lineTo(x + 7, y + 11);
  c.lineTo(x + 19, y + 11);
  c.lineTo(x + 22, y + 3.5);
  c.lineTo(x + 4.6, y + 3.5);
  c.stroke();
  dot(c, x + 9.5, y + 15, 1.7, color);
  dot(c, x + 17.5, y + 15, 1.7, color);
}
function cursor(c: Ctx, x: number, y: number, color: string, name: string) {
  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(x, y + 14);
  c.lineTo(x + 4, y + 10.5);
  c.lineTo(x + 7.5, y + 17);
  c.lineTo(x + 10, y + 15.8);
  c.lineTo(x + 6.8, y + 9.5);
  c.lineTo(x + 11.5, y + 9.2);
  c.closePath();
  c.fillStyle = color;
  c.shadowColor = color;
  c.shadowBlur = 8;
  c.fill();
  c.shadowBlur = 0;
  rr(c, x + 11, y + 14, 16, 11, 5.5);
  c.fill();
  label(c, name, x + 19, y + 19.7, "#06070a", "center", '700 7px ui-monospace, Menlo, monospace');
}

// ───────────────────────── PSVOX: voice becomes a report
const wave: Draw = (c, t, h) => {
  const T = 7;
  const u = (t % T) / T;
  const out = 1 - seg(u, 0.93, 1);
  label(c, "DICTATION", 18, 26, ink(0.45));
  for (let i = 0; i < 24; i++) {
    const env = 0.25 + 0.75 * Math.sin((Math.PI * (i + 1)) / 25);
    const amp = Math.abs(Math.sin(t * 3.4 + i * 0.62) * Math.cos(t * 1.1 + i * 0.27));
    const bh = 6 + 58 * env * amp;
    rr(c, 18 + i * 5.8, 96 - bh / 2, 3.2, bh, 1.6);
    c.fillStyle = hs(h, 70, 0.3 + 0.7 * env);
    c.fill();
  }
  for (let k = 0; k < 3; k++) {
    c.strokeStyle = hs(h, 72, 0.2 + 0.8 * Math.max(0, Math.sin(t * 4 - k * 0.9)));
    c.lineWidth = 2;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(164 + k * 9, 84);
    c.lineTo(169 + k * 9, 90);
    c.lineTo(164 + k * 9, 96);
    c.stroke();
  }
  panel(c, 198, 20, 108, 140, 10);
  label(c, "REPORT", 210, 35, ink(0.45));
  rr(c, 210, 45, 30, 4, 2);
  c.fillStyle = hs(h, 70, 0.9);
  c.fill();
  c.globalAlpha = out;
  [86, 78, 86, 62, 82, 74, 52, 80].forEach((w, i) => {
    const p = ease(seg(u, 0.06 + i * 0.09, 0.17 + i * 0.09 + 0.05));
    rr(c, 210, 60 + i * 11.5, w * p, 4.5, 2.2);
    c.fillStyle = ink(0.5);
    c.fill();
  });
  const done = seg(u, 0.84, 0.92);
  if (done > 0) {
    c.globalAlpha = done * out;
    dot(c, 286, 144, 9, hs(h, 62, 1, 75, 70));
    tick(c, 286, 144, 4, "#04120a");
  }
  c.globalAlpha = 1;
};

// ───────────────────────── PSWEB: JWT-gated server interface
const flow: Draw = (c, t, h) => {
  const T = 6.5;
  const u = (t % T) / T;
  const A = hs(h, 70);
  // the old way: direct DB calls, crossed out
  c.setLineDash([3, 4]);
  c.strokeStyle = ink(0.16);
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(46, 60);
  c.quadraticCurveTo(160, 0, 274, 60);
  c.stroke();
  c.setLineDash([]);
  label(c, "DIRECT DB", 160, 14, ink(0.28), "center");
  c.strokeStyle = hs(0, 66, 0.75, 85);
  c.lineWidth = 1.6;
  c.beginPath();
  c.moveTo(154, 26);
  c.lineTo(166, 38);
  c.moveTo(166, 26);
  c.lineTo(154, 38);
  c.stroke();
  // lanes
  c.strokeStyle = ink(0.12);
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(78, 96);
  c.lineTo(128, 96);
  c.moveTo(192, 96);
  c.lineTo(242, 96);
  c.stroke();
  // client
  panel(c, 14, 66, 64, 60, 10);
  rr(c, 26, 78, 40, 28, 4);
  c.strokeStyle = ink(0.35);
  c.stroke();
  [0, 1, 2].forEach((i) => dot(c, 31 + i * 5, 83, 1.2, ink(0.4)));
  label(c, "CLIENT", 46, 118, ink(0.5), "center");
  // gateway
  const val = seg(u, 0.22, 0.3) * (1 - seg(u, 0.5, 0.58));
  rr(c, 128, 56, 64, 80, 14);
  c.fillStyle = hs(h, 60, 0.05 + 0.12 * val);
  c.fill();
  c.strokeStyle = val > 0 ? hs(h, 70, 0.4 + 0.5 * val) : ink(0.16);
  c.lineWidth = 1.2;
  c.stroke();
  c.beginPath();
  c.moveTo(160, 74);
  c.lineTo(175, 80);
  c.lineTo(175, 94);
  c.quadraticCurveTo(175, 106, 160, 112);
  c.quadraticCurveTo(145, 106, 145, 94);
  c.lineTo(145, 80);
  c.closePath();
  c.strokeStyle = hs(h, 72, 0.55 + 0.45 * val);
  c.lineWidth = 1.6;
  c.stroke();
  if (val > 0.3) tick(c, 160, 94, 5, hs(h, 75, val), 2);
  label(c, "SERVER API", 160, 126, ink(0.5), "center");
  // database
  c.strokeStyle = ink(0.4);
  c.lineWidth = 1.2;
  c.beginPath();
  c.ellipse(274, 78, 20, 7, 0, 0, TAU);
  c.moveTo(254, 78);
  c.lineTo(254, 104);
  c.moveTo(294, 78);
  c.lineTo(294, 104);
  c.moveTo(254, 104);
  c.ellipse(274, 104, 20, 7, 0, Math.PI, 0, true);
  c.moveTo(254, 91);
  c.ellipse(274, 91, 20, 7, 0, Math.PI, 0, true);
  c.stroke();
  label(c, "ORACLE", 274, 124, ink(0.5), "center");
  // packet
  let x = -1;
  let txt = "JWT";
  if (u < 0.22) x = lerp(78, 128, ease(seg(u, 0, 0.22)));
  else if (u > 0.34 && u < 0.56) {
    x = lerp(192, 242, ease(seg(u, 0.34, 0.56)));
    txt = "SQL";
  } else if (u > 0.66 && u < 0.78) {
    x = lerp(242, 192, ease(seg(u, 0.66, 0.78)));
    txt = "ROWS";
  } else if (u > 0.78 && u < 0.94) {
    x = lerp(128, 78, ease(seg(u, 0.78, 0.94)));
    txt = "OK";
  }
  if (x > 0) {
    rr(c, x - 12, 90, 24, 12, 6);
    c.fillStyle = A;
    c.shadowColor = A;
    c.shadowBlur = 10;
    c.fill();
    c.shadowBlur = 0;
    label(c, txt, x, 96.5, "#06100e", "center", '700 6.5px ui-monospace, Menlo, monospace');
  }
};

// ───────────────────────── Ollama: tokens in, cost down
const neural: Draw = (c, t, h) => {
  const u = (t % 6) / 6;
  label(c, "TOKENS", 16, 26, ink(0.45));
  for (let i = 0; i < 9; i++) {
    const p = (t * 0.33 + i / 9) % 1;
    const w = 8 + ((i * 7) % 3) * 6;
    rr(c, 14 + p * 104, 56 + ((i * 37) % 5) * 12, w, 6, 3);
    c.fillStyle = hs(h, 70, 0.15 + 0.75 * Math.sin(Math.PI * p));
    c.fill();
  }
  const cx = 160;
  const cy = 94;
  const pts: [number, number][] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * TAU) / 8 + t * 0.35;
    const r = 30 + 4 * Math.sin(t * 2 + i);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.9]);
  }
  c.lineWidth = 1;
  pts.forEach(([x, y], i) => {
    const [nx, ny] = pts[(i + 1) % 8];
    const [fx, fy] = pts[(i + 3) % 8];
    c.strokeStyle = hs(h, 70, 0.22);
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(nx, ny);
    c.moveTo(x, y);
    c.lineTo(fx, fy);
    c.stroke();
    c.strokeStyle = hs(h, 70, 0.3);
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(cx, cy);
    c.stroke();
  });
  pts.forEach(([x, y], i) => dot(c, x, y, 2.2, hs(h, 72, 0.5 + 0.5 * Math.sin(t * 3 + i)), 6));
  dot(c, cx, cy, 8 + Math.sin(t * 3) * 1.2, hs(h, 66, 0.95), 18);
  label(c, "LOCAL MODEL", cx, 142, ink(0.45), "center");
  [0, 1, 2, 3].forEach((i) => {
    const p = ease(seg((t * 0.45) % 1, i * 0.12, i * 0.12 + 0.3));
    rr(c, 204, 70 + i * 11, [40, 34, 44, 26][i] * p, 4.5, 2.2);
    c.fillStyle = ink(0.5);
    c.fill();
  });
  label(c, "COST", 277, 26, ink(0.45), "center");
  const after = 62 - 36 * ease(seg(u, 0.15, 0.6));
  rr(c, 254, 150 - 62, 12, 62, 3);
  c.fillStyle = ink(0.14);
  c.fill();
  rr(c, 288, 150 - after, 12, after, 3);
  c.fillStyle = hs(h, 70, 0.9);
  c.fill();
  label(c, "BEFORE", 260, 160, ink(0.35), "center", '600 5.5px ui-monospace, Menlo, monospace');
  label(c, "AFTER", 294, 160, ink(0.35), "center", '600 5.5px ui-monospace, Menlo, monospace');
};

// ───────────────────────── Recognosco: API requests and responses
const bridge: Draw = (c, t, h) => {
  panel(c, 16, 66, 84, 56, 12);
  label(c, "{ }", 58, 90, hs(h, 72), "center", '700 16px ui-monospace, Menlo, monospace');
  label(c, "C# LIBRARY", 58, 112, ink(0.5), "center");
  panel(c, 220, 66, 84, 56, 12);
  c.strokeStyle = hs(h, 72, 0.9);
  c.lineWidth = 1.6;
  rr(c, 250, 76, 24, 20, 2);
  c.stroke();
  c.beginPath();
  c.moveTo(262, 76);
  c.lineTo(262, 96);
  c.stroke();
  label(c, "DICTIONARY API", 262, 112, ink(0.5), "center");
  // apps that use the library
  [0, 1, 2].forEach((i) => {
    const x = 20 + i * 28;
    rr(c, x, 22, 24, 14, 5);
    c.fillStyle = ink(0.07);
    c.fill();
    label(c, "APP", x + 12, 29.5, ink(0.45), "center", '600 6px ui-monospace, Menlo, monospace');
    c.strokeStyle = ink(0.14);
    c.beginPath();
    c.moveTo(x + 12, 36);
    c.lineTo(58, 66);
    c.stroke();
  });
  c.strokeStyle = ink(0.12);
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(100, 84);
  c.lineTo(220, 84);
  c.moveTo(100, 104);
  c.lineTo(220, 104);
  c.stroke();
  label(c, "REQUEST", 160, 76, ink(0.35), "center", '600 6px ui-monospace, Menlo, monospace');
  label(c, "RESPONSE", 160, 114, ink(0.35), "center", '600 6px ui-monospace, Menlo, monospace');
  for (let i = 0; i < 3; i++) {
    const p = (t * 0.36 + i / 3) % 1;
    const q = (t * 0.36 + i / 3 + 0.5) % 1;
    rr(c, lerp(104, 208, p), 81, 12, 6, 3);
    c.fillStyle = hs(h, 72, 0.95);
    c.shadowColor = hs(h, 72);
    c.shadowBlur = 8;
    c.fill();
    c.shadowBlur = 0;
    rr(c, lerp(208, 104, q), 101, 12, 6, 3);
    c.fillStyle = hs(h, 72, 0.55, 85, 50);
    c.fill();
  }
  label(c, "HOST APP STAYS FAST", 160, 150, ink(0.3), "center");
};

// ───────────────────────── Spring tests: every method gets a check
const checks: Draw = (c, t, h) => {
  const u = (t % 8) / 8;
  const out = 1 - seg(u, 0.93, 1);
  label(c, "DB TESTS", 24, 15, ink(0.45));
  const widths = [118, 88, 140, 100, 112, 80];
  for (let i = 0; i < 6; i++) {
    const y = 26 + i * 21;
    const start = 0.04 + i * 0.12;
    const end = start + 0.1;
    panel(c, 24, y, 272, 17, 6, 0.08, 0.035);
    rr(c, 52, y + 6.5, widths[i], 4, 2);
    c.fillStyle = ink(0.32);
    c.fill();
    const cx = 38;
    const cy = y + 8.5;
    if (u < start) {
      c.beginPath();
      c.arc(cx, cy, 4.5, 0, TAU);
      c.strokeStyle = ink(0.2);
      c.lineWidth = 1.2;
      c.stroke();
    } else if (u < end) {
      c.beginPath();
      c.arc(cx, cy, 4.5, t * 8, t * 8 + 4.2);
      c.strokeStyle = hs(h, 72);
      c.lineWidth = 1.6;
      c.stroke();
    } else {
      c.globalAlpha = out;
      dot(c, cx, cy, 5, hs(h, 62, 1, 75, 70));
      tick(c, cx, cy, 2.4, "#04120a", 1.6);
      label(c, "PASS", 288, cy, hs(h, 66, 0.8, 75, 70), "right");
      c.globalAlpha = 1;
    }
  }
  rr(c, 24, 160, 272, 4, 2);
  c.fillStyle = ink(0.08);
  c.fill();
  rr(c, 24, 160, 272 * cl((u - 0.04) / 0.72), 4, 2);
  c.fillStyle = hs(h, 70);
  c.fill();
};

// ───────────────────────── Unreality: people connected over distance
const DOTS = landDots(3.6);
const globe: Draw = (c, t, h) => {
  const cx = 160;
  const cy = 92;
  const R = 76;
  const rot = t * 0.28 - 0.9;
  const g = c.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 1.55);
  g.addColorStop(0, hs(h, 60, 0.2));
  g.addColorStop(1, hs(h, 60, 0));
  c.fillStyle = g;
  c.fillRect(0, 0, 320, 180);
  c.beginPath();
  c.arc(cx, cy, R, 0, TAU);
  c.fillStyle = ink(0.03);
  c.fill();
  c.strokeStyle = ink(0.14);
  c.lineWidth = 1;
  c.stroke();
  const cr = Math.cos(rot);
  const sr = Math.sin(rot);
  for (let i = 0; i < DOTS.length; i += 3) {
    const x = DOTS[i] * cr + DOTS[i + 2] * sr;
    const z = -DOTS[i] * sr + DOTS[i + 2] * cr;
    if (z < 0.02) continue;
    c.fillStyle = ink(0.2 + 0.6 * z);
    c.fillRect(cx + x * R - 0.8, cy - DOTS[i + 1] * R - 0.8, 1.7, 1.7);
  }
  const proj = (lat: number, lon: number, lift = 1) => {
    const [vx, vy, vz] = ll2v(lat, lon);
    return { x: cx + (vx * cr + vz * sr) * R * lift, y: cy - vy * R * lift, z: -vx * sr + vz * cr };
  };
  const pairs: [[number, number], [number, number]][] = [
    [PLACES.chicoutimi, PLACES.germany],
    [PLACES.ottawa, [-15, -48]],
    [PLACES.germany, [20, 78]],
  ];
  pairs.forEach(([a, b], k) => {
    const pa = proj(a[0], a[1]);
    const pb = proj(b[0], b[1]);
    if (pa.z < 0.05 || pb.z < 0.05) return;
    const mid = proj((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 1.42);
    c.strokeStyle = hs(h, 72, 0.5);
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(pa.x, pa.y);
    c.quadraticCurveTo(mid.x, mid.y, pb.x, pb.y);
    c.stroke();
    const p = (t * 0.3 + k * 0.33) % 1;
    const x = (1 - p) * (1 - p) * pa.x + 2 * (1 - p) * p * mid.x + p * p * pb.x;
    const y = (1 - p) * (1 - p) * pa.y + 2 * (1 - p) * p * mid.y + p * p * pb.y;
    dot(c, x, y, 2.2, hs(h, 85), 10);
    dot(c, pa.x, pa.y, 2.4, hs(h, 80), 8);
    dot(c, pb.x, pb.y, 2.4, hs(h, 80), 8);
  });
  c.strokeStyle = ink(0.1);
  c.beginPath();
  c.ellipse(cx, cy, R * 1.45, R * 0.36, -0.4, 0, TAU);
  c.stroke();
  const sa = t * 0.7;
  const sx = Math.cos(sa) * R * 1.45;
  const sy = Math.sin(sa) * R * 0.36;
  dot(c, cx + sx * Math.cos(-0.4) - sy * Math.sin(-0.4), cy + sx * Math.sin(-0.4) + sy * Math.cos(-0.4), 2.4, hs(h, 85, 0.9, 85, 40), 8);
};

// ───────────────────────── Imagem: a code editor being typed
const CODE: [number, number][][] = [
  [[6, 1], [1, -1], [11, 2], [1, -1], [1, 0]],
  [[2, -1], [6, 1], [1, -1], [8, 3], [2, 0], [7, 2], [2, 0]],
  [[4, -1], [3, 1], [1, -1], [4, 2], [3, 0], [9, 3], [2, 0]],
  [[4, -1], [6, 1], [1, -1], [5, 0], [8, 2], [3, 0]],
  [[4, -1], [2, 0], [10, 3], [5, 0]],
  [[2, -1], [1, 0]],
  [[2, -1], [6, 1], [1, -1], [9, 3], [2, 0], [4, 2], [2, 0]],
  [[4, -1], [8, 0], [3, 3], [1, 0]],
  [[2, -1], [1, 0]],
];
const TOTAL = CODE.flat().reduce((n, [len]) => n + len, 0);
const editor: Draw = (c, t, h) => {
  panel(c, 22, 14, 276, 152, 10, 0.16, 0.05);
  [0, 1, 2].forEach((i) => dot(c, 36 + i * 9, 26, 2.4, ink(0.25)));
  label(c, "Dictation.cs", 160, 26, ink(0.4), "center");
  c.strokeStyle = ink(0.08);
  c.beginPath();
  c.moveTo(22, 36);
  c.lineTo(298, 36);
  c.stroke();
  const shown = Math.floor((t * 22) % (TOTAL + 40));
  const colors = [ink(0.5), hs(h, 72), hs(h, 74, 1, 80, 45), hs(h, 70, 1, 80, 120)];
  let n = 0;
  let curX = 52;
  let curY = 48;
  CODE.forEach((line, i) => {
    const y = 49 + i * 13.5;
    label(c, String(i + 1), 40, y, ink(0.2), "right");
    let x = 52;
    line.forEach(([len, col]) => {
      const vis = Math.max(0, Math.min(len, shown - n));
      if (col >= 0 && vis > 0) {
        rr(c, x, y - 2.5, vis * 4.6 - 1, 5, 2);
        c.fillStyle = colors[col];
        c.fill();
      }
      if (vis > 0 || (n <= shown && shown < n + len)) {
        curX = x + vis * 4.6;
        curY = y;
      }
      x += len * 4.6;
      n += len;
    });
  });
  if (Math.floor(t * 2.4) % 2 === 0) {
    c.fillStyle = hs(h, 80);
    c.fillRect(curX, curY - 5, 1.6, 10);
  }
};

// ───────────────────────── Labourly: Zoom + Google integration
const sync: Draw = (c, t, h) => {
  panel(c, 24, 46, 78, 78, 14);
  rr(c, 40, 70, 34, 26, 6);
  c.strokeStyle = hs(h, 72, 0.9);
  c.lineWidth = 1.6;
  c.stroke();
  c.beginPath();
  c.moveTo(74, 80);
  c.lineTo(88, 72);
  c.lineTo(88, 94);
  c.lineTo(74, 86);
  c.closePath();
  c.fillStyle = hs(h, 72, 0.9);
  c.fill();
  label(c, "ZOOM", 63, 112, ink(0.5), "center");
  panel(c, 218, 46, 78, 78, 14);
  rr(c, 236, 62, 42, 38, 5);
  c.strokeStyle = hs(h, 72, 0.9, 85, 50);
  c.stroke();
  c.beginPath();
  c.moveTo(236, 74);
  c.lineTo(278, 74);
  c.stroke();
  for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) dot(c, 245 + k * 12, 83 + r * 10, 1.6, ink(r === 0 && k === 1 ? 0.9 : 0.35));
  label(c, "GOOGLE", 257, 112, ink(0.5), "center");
  [0, Math.PI].forEach((o) => {
    const a = t * 2 + o;
    c.strokeStyle = hs(h, 72, 0.9);
    c.lineWidth = 2;
    c.lineCap = "round";
    c.beginPath();
    c.arc(160, 85, 18, a, a + 2.2);
    c.stroke();
    const ex = 160 + Math.cos(a + 2.2) * 18;
    const ey = 85 + Math.sin(a + 2.2) * 18;
    dot(c, ex, ey, 3, hs(h, 80), 8);
  });
  const p = (t * 0.28) % 1;
  rr(c, 24, 148, 272, 4, 2);
  c.fillStyle = ink(0.08);
  c.fill();
  rr(c, 24, 148, 272 * p, 4, 2);
  c.fillStyle = hs(h, 70);
  c.fill();
  rr(c, 24 + 250 * p, 140, 22, 11, 3);
  c.fillStyle = hs(h, 70, 0.95);
  c.fill();
  label(c, "SYNC", 160, 20, ink(0.4), "center");
};

// ───────────────────────── Hotel: availability and booking
const calendar: Draw = (c, t, h) => {
  const u = (t % 7) / 7;
  label(c, "AVAILABILITY", 34, 18, ink(0.45));
  const occupied = new Set([2, 6, 8, 15, 16, 19, 23, 24]);
  const n = Math.floor(ease(seg(u, 0.12, 0.55)) * 5.999);
  for (let i = 0; i < 28; i++) {
    const col = i % 7;
    const row = Math.floor(i / 7);
    const x = 34 + col * 36;
    const y = 30 + row * 31;
    const sel = row === 1 && col >= 1 && col <= 1 + n && u > 0.12;
    rr(c, x, y, 32, 26, 6);
    c.fillStyle = sel ? hs(h, 66, 0.4) : occupied.has(i) ? ink(0.02) : ink(0.06);
    c.fill();
    c.strokeStyle = sel ? hs(h, 72, 0.9) : ink(0.08);
    c.lineWidth = sel ? 1.3 : 1;
    c.stroke();
    if (occupied.has(i)) {
      c.strokeStyle = ink(0.12);
      c.beginPath();
      c.moveTo(x + 9, y + 8);
      c.lineTo(x + 23, y + 18);
      c.stroke();
    }
  }
  const done = seg(u, 0.62, 0.72) * (1 - seg(u, 0.92, 1));
  if (done > 0) {
    c.globalAlpha = done;
    rr(c, 130, 52, 110, 20, 10);
    c.fillStyle = hs(h, 62, 1, 75, 70);
    c.fill();
    tick(c, 148, 62, 3.6, "#04120a", 1.8);
    label(c, "CONFIRMED", 160, 62.5, "#04120a", "left", '700 7.5px ui-monospace, Menlo, monospace');
    c.globalAlpha = 1;
  }
};

// ───────────────────────── Forum: conversation
const chat: Draw = (c, t, h) => {
  const u = (t % 8) / 8;
  const out = 1 - seg(u, 0.94, 1);
  const msgs = [
    { right: false, w: 128 },
    { right: true, w: 100 },
    { right: false, w: 148 },
    { right: true, w: 76 },
  ];
  msgs.forEach((m, i) => {
    const p = ease(seg(u, i * 0.17, i * 0.17 + 0.1));
    if (p <= 0) return;
    const y = 22 + i * 34 + (1 - p) * 8;
    const x = m.right ? 296 - m.w - 26 : 50;
    c.globalAlpha = p * out;
    dot(c, m.right ? 290 : 30, y + 12, 9, hs(h, 62, 0.9, 80, m.right ? 60 : 0));
    rr(c, x, y, m.w, 26, 10);
    c.fillStyle = m.right ? hs(h, 60, 0.28) : ink(0.08);
    c.fill();
    c.strokeStyle = m.right ? hs(h, 72, 0.5) : ink(0.12);
    c.stroke();
    rr(c, x + 10, y + 8, m.w - 28, 3.5, 1.7);
    c.fillStyle = ink(0.5);
    c.fill();
    rr(c, x + 10, y + 15, (m.w - 28) * 0.6, 3.5, 1.7);
    c.fillStyle = ink(0.3);
    c.fill();
  });
  c.globalAlpha = 1;
  if (u > 0.7 && u < 0.93) {
    rr(c, 50, 152, 40, 18, 9);
    c.fillStyle = ink(0.08);
    c.fill();
    [0, 1, 2].forEach((i) => dot(c, 62 + i * 10, 161 - Math.max(0, Math.sin(t * 7 - i)) * 2.5, 2, ink(0.6)));
  }
};

// ───────────────────────── Mobile apps: cart and tax
const phone: Draw = (c, t, h) => {
  const T = 6;
  const u = (t % T) / T;
  panel(c, 112, 8, 96, 166, 16, 0.26, 0.05);
  rr(c, 148, 13, 24, 4, 2);
  c.fillStyle = ink(0.2);
  c.fill();
  const k = Math.floor(u * 3);
  const local = (u * 3) % 1;
  const count = k + (local > 0.6 ? 1 : 0);
  for (let i = 0; i < 3; i++) {
    const y = 48 + i * 30;
    rr(c, 122, y, 76, 25, 7);
    c.fillStyle = ink(0.05);
    c.fill();
    rr(c, 127, y + 4, 17, 17, 5);
    c.fillStyle = hs(h, 62, 0.75, 85, i * 40);
    c.fill();
    rr(c, 150, y + 7, 26, 3.5, 1.7);
    c.fillStyle = ink(0.5);
    c.fill();
    rr(c, 150, y + 14, 16, 3, 1.5);
    c.fillStyle = ink(0.28);
    c.fill();
    const press = i === k && local > 0.2 && local < 0.45;
    dot(c, 187, y + 12.5, 6, press ? hs(h, 80) : ink(0.12));
    label(c, "+", 187, y + 12.8, press ? "#06100e" : ink(0.7), "center", '700 9px ui-monospace, Menlo, monospace');
    if (i === k && local > 0.35 && local < 0.65) {
      const p = ease(seg(local, 0.35, 0.65));
      const x = lerp(187, 190, p);
      const yy = lerp(y + 12.5, 28, p) - Math.sin(p * Math.PI) * 14;
      dot(c, x, yy, 3.2, hs(h, 82), 10);
    }
  }
  cartIcon(c, 122, 22, ink(0.7));
  label(c, "CART", 156, 30, ink(0.5), "left");
  dot(c, 190, 29, 7.5 + (local > 0.6 && local < 0.75 ? 1.2 : 0), hs(h, 70));
  label(c, String(count), 190, 29.5, "#06100e", "center", '700 8px ui-monospace, Menlo, monospace');
  rr(c, 122, 142, 76, 24, 8);
  c.fillStyle = hs(h, 60, 0.18);
  c.fill();
  c.strokeStyle = hs(h, 72, 0.5);
  c.stroke();
  label(c, "% TAX", 130, 154, ink(0.6));
  rr(c, 160, 151, 30 * (count / 3 || 0.1), 5, 2.5);
  c.fillStyle = hs(h, 74);
  c.fill();
};

// ───────────────────────── Shop: catalogue and checkout
const shop: Draw = (c, t, h) => {
  const sel = Math.floor(t * 0.9) % 6;
  const phase = (t * 0.9) % 1;
  label(c, "CATALOGUE", 26, 16, ink(0.45));
  for (let i = 0; i < 6; i++) {
    const x = 26 + (i % 3) * 92;
    const y = 28 + Math.floor(i / 3) * 74;
    const on = i === sel;
    rr(c, x, y, 84, 66, 10);
    c.fillStyle = on ? hs(h, 60, 0.14) : ink(0.045);
    c.fill();
    c.strokeStyle = on ? hs(h, 72, 0.8) : ink(0.1);
    c.lineWidth = on ? 1.4 : 1;
    c.stroke();
    rr(c, x + 8, y + 8, 68, 28, 6);
    c.fillStyle = hs(h, 58, 0.5, 80, (i * 28) % 120);
    c.fill();
    rr(c, x + 8, y + 42, 38, 3.5, 1.7);
    c.fillStyle = ink(0.5);
    c.fill();
    rr(c, x + 8, y + 51, 22, 3, 1.5);
    c.fillStyle = ink(0.28);
    c.fill();
    rr(c, x + 52, y + 46, 24, 14, 7);
    c.fillStyle = on && phase > 0.3 && phase < 0.7 ? hs(h, 78) : ink(0.12);
    c.fill();
  }
  cartIcon(c, 268, 6, ink(0.7));
  dot(c, 300, 9, 6.5 + (phase > 0.5 && phase < 0.7 ? 1.3 : 0), hs(h, 72));
  label(c, String((sel + 1) % 7), 300, 9.5, "#06100e", "center", '700 7.5px ui-monospace, Menlo, monospace');
};

// ───────────────────────── RAG: ask documents, stream an answer
const rag: Draw = (c, t, h) => {
  const u = (t % 7) / 7;
  const out = 1 - seg(u, 0.94, 1);
  [10, 5, 0].forEach((o, i) => {
    panel(c, 20 + o, 22 + o * 0.6, 84, 120, 8, 0.1 + i * 0.03, 0.03 + i * 0.01);
  });
  const scan = ease(seg(u, 0.05, 0.5));
  const sy = 34 + scan * 96;
  for (let i = 0; i < 9; i++) {
    const y = 34 + i * 11;
    const near = Math.exp(-Math.pow((y - sy) / 14, 2));
    rr(c, 30, y, 64 - (i % 3) * 12, 4, 2);
    c.fillStyle = near > 0.3 ? hs(h, 72, 0.4 + 0.6 * near) : ink(0.2);
    c.fill();
  }
  if (u < 0.55) {
    c.fillStyle = hs(h, 72, 0.35);
    c.fillRect(24, sy - 1, 76, 2);
  }
  const link = seg(u, 0.3, 0.6);
  c.strokeStyle = hs(h, 72, 0.5 * link);
  c.lineWidth = 1.2;
  c.beginPath();
  c.moveTo(104, 80);
  c.bezierCurveTo(140, 80, 140, 92, 176, 92);
  c.stroke();
  panel(c, 176, 34, 126, 108, 10, 0.16, 0.05);
  rr(c, 176, 14, 60, 14, 7);
  c.fillStyle = hs(h, 60, 0.2);
  c.fill();
  label(c, "ASK", 206, 21.5, hs(h, 78), "center");
  c.globalAlpha = out;
  [100, 92, 100, 70, 96, 54].forEach((w, i) => {
    const p = ease(seg(u, 0.4 + i * 0.075, 0.5 + i * 0.075));
    rr(c, 188, 46 + i * 11.5, w * p, 4.5, 2.2);
    c.fillStyle = ink(0.55);
    c.fill();
  });
  if (u > 0.4 && u < 0.92 && Math.floor(t * 3) % 2 === 0) {
    c.fillStyle = hs(h, 80);
    c.fillRect(188 + 54 * ease(seg(u, 0.78, 0.88)) + 2, 108, 5, 8);
  }
  ["SRC 1", "SRC 2"].forEach((s, i) => {
    rr(c, 188 + i * 46, 122, 40, 12, 6);
    c.fillStyle = hs(h, 60, 0.18);
    c.fill();
    label(c, s, 208 + i * 46, 128.5, hs(h, 78), "center", '600 6px ui-monospace, Menlo, monospace');
  });
  c.globalAlpha = 1;
};

// ───────────────────────── Live board: shared cursors
const board: Draw = (c, t, h) => {
  c.fillStyle = ink(0.07);
  for (let x = 12; x < 320; x += 16) for (let y = 10; y < 180; y += 16) c.fillRect(x, y, 1.2, 1.2);
  const bx = 176 + 44 * Math.sin(t * 0.6);
  const by = 98 + 22 * Math.cos(t * 0.8);
  const notes: [number, number, number, number][] = [
    [34, 30, 0, 0],
    [bx - 28, by - 22, 45, 1],
    [230, 34, 100, 0],
  ];
  notes.forEach(([x, y, dh, lift], i) => {
    rr(c, x, y, 64, 50, 7);
    c.fillStyle = hs(h, 58, 0.3, 80, dh);
    c.shadowColor = hs(h, 60, 0.4, 80, dh);
    c.shadowBlur = lift ? 18 : 0;
    c.fill();
    c.shadowBlur = 0;
    c.strokeStyle = hs(h, 72, lift ? 0.9 : 0.45, 80, dh);
    c.lineWidth = lift ? 1.5 : 1;
    c.stroke();
    rr(c, x + 9, y + 11, 38 + (i % 2) * 8, 4, 2);
    c.fillStyle = ink(0.55);
    c.fill();
    rr(c, x + 9, y + 21, 28, 3.5, 1.7);
    c.fillStyle = ink(0.32);
    c.fill();
  });
  cursor(c, 90 + 80 * Math.cos(t * 0.7), 70 + 55 * Math.sin(t * 0.9), hs(h, 78, 1, 85, 130), "A");
  cursor(c, bx, by, hs(h, 78), "B");
};

// ───────────────────────── Observability: metrics and a latency chart
const metrics: Draw = (c, t, h) => {
  const tiles = ["REQ/S", "P95", "ERRORS"];
  tiles.forEach((s, i) => {
    const x = 16 + i * 98;
    panel(c, x, 12, 92, 46, 9, 0.12, 0.045);
    label(c, s, x + 10, 24, ink(0.45));
    rr(c, x + 10, 34, 34 + 10 * Math.sin(t * 1.4 + i * 2), 6, 3);
    c.fillStyle = i === 2 ? hs(h, 62, 0.9, 80, 120) : hs(h, 72, 0.9);
    c.fill();
    c.strokeStyle = ink(0.35);
    c.lineWidth = 1;
    c.beginPath();
    for (let k = 0; k <= 16; k++) {
      const yy = 48 - 5 * (0.5 + 0.5 * Math.sin(t * 2 + k * 0.6 + i));
      if (k === 0) c.moveTo(x + 52 + k * 2, yy);
      else c.lineTo(x + 52 + k * 2, yy);
    }
    c.stroke();
  });
  panel(c, 16, 66, 288, 100, 10, 0.12, 0.04);
  c.strokeStyle = ink(0.06);
  for (let k = 1; k < 4; k++) {
    c.beginPath();
    c.moveTo(16, 66 + k * 25);
    c.lineTo(304, 66 + k * 25);
    c.stroke();
  }
  c.setLineDash([3, 4]);
  c.strokeStyle = hs(h, 62, 0.5, 85, 130);
  c.beginPath();
  c.moveTo(16, 90);
  c.lineTo(304, 90);
  c.stroke();
  c.setLineDash([]);
  label(c, "SLO", 296, 84, hs(h, 62, 0.7, 85, 130), "right", '600 6px ui-monospace, Menlo, monospace');
  const f = (x: number) => 0.5 + 0.17 * Math.sin(x * 0.05 + t * 1.4) + 0.09 * Math.sin(x * 0.14 - t * 2.1) + 0.2 * Math.exp(-Math.pow(((x - t * 40) % 288 - 144) / 12, 2));
  c.beginPath();
  c.moveTo(16, 160);
  for (let x = 0; x <= 288; x += 3) c.lineTo(16 + x, 160 - f(x) * 74);
  c.lineTo(304, 160);
  c.closePath();
  const g = c.createLinearGradient(0, 70, 0, 160);
  g.addColorStop(0, hs(h, 70, 0.32));
  g.addColorStop(1, hs(h, 70, 0));
  c.fillStyle = g;
  c.fill();
  c.beginPath();
  for (let x = 0; x <= 288; x += 3) {
    const y = 160 - f(x) * 74;
    if (x === 0) c.moveTo(16 + x, y);
    else c.lineTo(16 + x, y);
  }
  c.strokeStyle = hs(h, 72);
  c.lineWidth = 1.6;
  c.stroke();
  dot(c, 304, 160 - f(288) * 74, 3, hs(h, 85), 10);
};

export const SCENES: Record<Art, Draw> = { wave, flow, neural, bridge, checks, globe, editor, sync, calendar, chat, phone, shop, rag, board, metrics };

/** Time (seconds) at which each scene looks best as a still frame. */
export const POSTER: Record<Art, number> = {
  wave: 3.6, flow: 2.0, neural: 1.4, bridge: 1.1, checks: 4.9, globe: 2.2, editor: 4.8, sync: 1.6,
  calendar: 3.4, chat: 5.1, phone: 2.8, shop: 2.3, rag: 4.4, board: 1.9, metrics: 2.4,
};
