export interface NoteRow {
  label: string;   // "1/4"
  name: string;    // "Quarter"
  regular: number; // ms
  dotted: number;  // ms × 1.5
  triplet: number; // ms × 2/3
}

const NOTE_DEFS = [
  { label: "1/1",  name: "Whole",   beats: 4      },
  { label: "1/2",  name: "Half",    beats: 2      },
  { label: "1/4",  name: "Quarter", beats: 1      },
  { label: "1/8",  name: "8th",     beats: 0.5    },
  { label: "1/16", name: "16th",    beats: 0.25   },
  { label: "1/32", name: "32nd",    beats: 0.125  },
  { label: "1/64", name: "64th",    beats: 0.0625 },
] as const;

export function calcNoteLengths(bpm: number): NoteRow[] {
  const beatMs = 60000 / bpm;
  return NOTE_DEFS.map((def) => {
    const regular = beatMs * def.beats;
    return {
      label: def.label,
      name: def.name,
      regular,
      dotted: regular * 1.5,
      triplet: regular * (2 / 3),
    };
  });
}

/** 値の大きさに応じた小数桁数で ms を文字列化 */
export function fmtMs(ms: number): string {
  if (ms >= 1000) return ms.toFixed(1);
  if (ms >= 100)  return ms.toFixed(2);
  return ms.toFixed(3);
}
