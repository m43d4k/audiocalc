export type CombPolarity = "same" | "inverted";

export interface CombNotch {
  n: number;
  freqHz: number;
}

/**
 * same polarity     — notches at (2n−1)/(2τ): floor bounce, early reflections
 * inverted polarity — notches at n/τ: out-of-phase summing
 */
export function calcCombNotches(
  delayMs: number,
  polarity: CombPolarity,
  maxHz = 20000,
  maxRows = 14,
): CombNotch[] {
  const τs = delayMs / 1000;
  const results: CombNotch[] = [];

  for (let n = 1; results.length < maxRows; n++) {
    const freqHz =
      polarity === "same" ? (2 * n - 1) / (2 * τs) : n / τs;
    if (freqHz > maxHz) break;
    results.push({ n, freqHz });
  }

  return results;
}

/** Spacing between consecutive notches (identical for both polarities) */
export function combSpacingHz(delayMs: number): number {
  return 1000 / delayMs;
}

export function fmtHz(hz: number): string {
  if (hz >= 10000) return `${(hz / 1000).toFixed(1)} kHz`;
  if (hz >= 1000) return `${(hz / 1000).toFixed(2)} kHz`;
  if (hz >= 100) return `${Math.round(hz)} Hz`;
  return `${hz.toFixed(1)} Hz`;
}
