export const NOTES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;
export type Note = (typeof NOTES)[number];

const DEGREE_MAP: Record<number, string> = {
  0: "P1", 1: "m2", 2: "M2", 3: "m3", 4: "M3", 5: "P4",
  6: "Tritone", 7: "P5", 8: "m6", 9: "M6", 10: "m7", 11: "M7", 12: "P8",
};

export interface TransposeResult {
  up: number;
  down: number;
  upInterval: string;
  downInterval: string;
}

export function calcTranspose(from: Note, to: Note): TransposeResult {
  const fromIdx = NOTES.indexOf(from);
  const toIdx = NOTES.indexOf(to);
  const up = (toIdx - fromIdx + 12) % 12;
  const down = (fromIdx - toIdx + 12) % 12;
  return {
    up,
    down,
    upInterval: DEGREE_MAP[up] ?? "—",
    downInterval: DEGREE_MAP[down] ?? "—",
  };
}
