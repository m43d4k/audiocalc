export interface ReverbRow {
  id: string;
  name: string;
  note: string;
  pre: number;
  decay: number;
  total: number;
}

const PRESETS = [
  { id: "hall",       name: "Hall",       note: "2 Bars",   beats: 8, ratio: 1 / 64  },
  { id: "large-room", name: "Large Room", note: "1 Bar",    beats: 4, ratio: 1 / 64  },
  { id: "small-room", name: "Small Room", note: "1/2 Note", beats: 2, ratio: 1 / 64  },
  { id: "tight",      name: "Tight",      note: "1/4 Note", beats: 1, ratio: 1 / 128 },
] as const;

export function calcReverbTimes(bpm: number): ReverbRow[] {
  const beatMs = 60000 / bpm;
  return PRESETS.map((p) => {
    const total = beatMs * p.beats;
    const pre = total * p.ratio;
    const decay = total - pre;
    return { id: p.id, name: p.name, note: p.note, pre, decay, total };
  });
}
