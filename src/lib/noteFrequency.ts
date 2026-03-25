export const PITCH_NAMES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;

export const REF_MIN = 432;
export const REF_MAX = 444;
export const REF_DEFAULT = 440;

/** MIDI ノート番号 n から音名を生成（C-2 = 0 規約） */
export function noteNameFromMidi(n: number): string {
  const pc = PITCH_NAMES[n % 12];
  const octave = Math.floor(n / 12) - 2;
  return `${pc}${octave}`;
}

export interface ToneEntry {
  note: string;
  midi: number;
  freq: number;
  low: number;
  high: number;
  pitchClass: string;
}

/** 基準周波数 refHz（MIDI 69 = A）で 128 ノートの周波数テーブルを生成 */
export function generateTones(refHz: number): ToneEntry[] {
  return Array.from({ length: 128 }, (_, n) => {
    const freq = refHz * Math.pow(2, (n - 69) / 12);
    return {
      note: noteNameFromMidi(n),
      midi: n,
      freq,
      low: freq * Math.pow(2, -0.5),
      high: freq * Math.pow(2, 0.5),
      pitchClass: PITCH_NAMES[n % 12],
    };
  });
}
