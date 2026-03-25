import { noteNameFromMidi } from "./noteFrequency";

export interface Harmonic {
  n: number;
  freqHz: number;
  noteName: string;
  /** Deviation from nearest equal-tempered note, in cents (-50 to +50) */
  cents: number;
}

export function calcHarmonics(fundamentalHz: number, count = 16): Harmonic[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const freqHz = n * fundamentalHz;
    const midiFloat = 69 + 12 * Math.log2(freqHz / 440);
    const midiNearest = Math.round(midiFloat);
    const cents = Math.round((midiFloat - midiNearest) * 100);
    return { n, freqHz, noteName: noteNameFromMidi(midiNearest), cents };
  });
}

export function fmtFreq(hz: number): string {
  if (hz >= 10000) return `${(hz / 1000).toFixed(1)} kHz`;
  if (hz >= 1000) return `${(hz / 1000).toFixed(2)} kHz`;
  if (hz >= 100) return `${hz.toFixed(1)} Hz`;
  return `${hz.toFixed(2)} Hz`;
}
