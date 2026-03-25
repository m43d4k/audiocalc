/**
 * Exact conversion between EQ filter Q and bandwidth.
 *
 * Derivation: for a peak/notch filter with center f₀,
 * lower/upper -3dB points f₁ f₂ satisfy:
 *   Q = f₀ / (f₂ − f₁)  and  f₀ = √(f₁·f₂)
 *
 * → ratio r = f₂/f₁, then Q = √r / (r − 1)
 */

/** Q → bandwidth in octaves (exact) */
export function qToOctaves(q: number): number {
  const k = 1 / (2 * q);
  return 2 * Math.log2(k + Math.sqrt(k * k + 1));
}

/** Octave bandwidth → Q (exact) */
export function octavesToQ(oct: number): number {
  const r = Math.pow(2, oct);
  return Math.sqrt(r) / (r - 1);
}

/** Q + center frequency → bandwidth in Hz */
export function qToHz(q: number, centerHz: number): number {
  return centerHz / q;
}

/** Hz bandwidth + center frequency → Q */
export function hzToQ(bwHz: number, centerHz: number): number {
  return centerHz / bwHz;
}

export function fmtQ(q: number): string {
  return q < 10 ? q.toFixed(3) : q.toFixed(2);
}

export function fmtOct(oct: number): string {
  return oct.toFixed(3);
}

export function fmtHz(hz: number): string {
  if (hz >= 1000) return `${(hz / 1000).toFixed(2)} kHz`;
  return `${hz.toFixed(1)} Hz`;
}
