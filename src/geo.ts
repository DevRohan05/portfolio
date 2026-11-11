import { LAND_B64 } from "./landmask";

let mask: Uint8Array | null = null;
function getMask() {
  if (!mask) {
    const s = atob(LAND_B64);
    mask = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) mask[i] = s.charCodeAt(i);
  }
  return mask;
}

export function isLand(lat: number, lon: number) {
  const r = Math.min(179, Math.max(0, Math.floor(90 - lat)));
  const c = Math.min(359, Math.max(0, Math.floor(lon + 180)));
  const i = r * 360 + c;
  return ((getMask()[i >> 3] >> (i & 7)) & 1) === 1;
}

/** lat/lon (degrees) to a unit vector. lon 0 faces +z, lat 90 is +y. */
export function ll2v(lat: number, lon: number): [number, number, number] {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
}

const cache = new Map<number, Float32Array>();
/** Evenly spaced dots on land, as flat xyz triples on the unit sphere. */
export function landDots(step: number): Float32Array {
  const hit = cache.get(step);
  if (hit) return hit;
  const out: number[] = [];
  for (let lat = -84; lat <= 84; lat += step) {
    const lonStep = step / Math.max(0.12, Math.cos((lat * Math.PI) / 180));
    for (let lon = -180; lon < 180; lon += lonStep) {
      if (isLand(lat, lon)) out.push(...ll2v(lat, lon));
    }
  }
  const arr = new Float32Array(out);
  cache.set(step, arr);
  return arr;
}

export type LL = [number, number];
export type PlaceId = "chicoutimi" | "montreal" | "rimouski" | "gaspe" | "ottawa" | "germany";
export const PLACES: Record<PlaceId, LL> = {
  chicoutimi: [48.43, -71.07],
  montreal: [45.5, -73.57],
  rimouski: [48.45, -68.52],
  gaspe: [48.83, -64.49],
  ottawa: [45.42, -75.7],
  germany: [51.0, 10.0],
};

export const ARCS: [PlaceId, PlaceId][] = [
  ["chicoutimi", "montreal"],
  ["chicoutimi", "rimouski"],
  ["chicoutimi", "gaspe"],
  ["chicoutimi", "ottawa"],
  ["ottawa", "germany"],
];
