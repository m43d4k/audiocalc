import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ToolId } from "../data/tools";

export type Lang = "en" | "ja";

interface ToolT {
  title: string;
  description: string;
}

interface UiT {
  back: string;
  // note-frequency
  filterAll: string;
  showOctRange: string;
  nfRefFreq: string;
  colNote: string;
  colMidi: string;
  colHz: string;
  colOctLow: string;
  colOctHigh: string;
  // transpose
  transposeFrom: string;
  transposeTo: string;
  transposeUp: string;
  transposeDown: string;
  transposeInterval: string;
  transposeSt: string;
  transposePickBoth: string;
  // phase-delay
  pdPhase: string;
  pdFrequency: string;
  pdSampleRate: string;
  pdLag: string;
  pdLagAction: string;
  pdLead: string;
  pdLeadAction: string;
  // delay-reverb
  drBpm: string;
  drReverbSize: string;
  drPreDelay: string;
  drDecay: string;
  drTotal: string;
  // note-length-time
  nlNote: string;
  nlRegular: string;
  nlDotted: string;
  nlTriplet: string;
  // samples-ms
  smSamples: string;
  smMs: string;
  // comb-filter
  cfDelay: string;
  cfPolarity: string;
  cfSame: string;
  cfInverted: string;
  cfNotch: string;
  cfFrequency: string;
  cfSpacing: string;
  cfNoNotches: string;
  // harmonic-series
  hsFrequency: string;
  hsHarmonic: string;
  hsNote: string;
  hsCents: string;
  // q-bandwidth
  qbQ: string;
  qbOctaves: string;
  qbHzBw: string;
  qbCenter: string;
}

interface Translations {
  home: {
    tagline: string;
  };
  tools: Record<ToolId, ToolT>;
  ui: UiT;
}

const en: Translations = {
  home: {
    tagline: "Audio calculation tools for music production.",
  },
  tools: {
    "note-frequency": {
      title: "Note ↔ Frequency",
      description:
        "See note names, MIDI note numbers, and frequencies in Hz in one table. Filter by pitch class or toggle the ±½-octave columns.",
    },
    transpose: {
      title: "Transpose",
      description:
        "Pick two notes and see the semitone distance and interval name, both ascending and descending.",
    },
    "phase-delay": {
      title: "Phase → Delay",
      description:
        "Enter a phase difference in degrees to get the equivalent delay in milliseconds and samples.",
    },
    "delay-reverb": {
      title: "Delay & Reverb",
      description:
        "Enter a BPM to calculate pre-delay, decay, and total time for Hall, Room, and Tight reverb settings.",
    },
    "note-length-time": {
      title: "Note Value ↔ Time",
      description:
        "Enter a BPM to see note durations in milliseconds from whole notes to 64th notes, including straight, dotted, and triplet values.",
    },
    "samples-ms": {
      title: "ms ↔ Samples",
      description:
        "Convert between milliseconds and sample count at 44.1 / 48 / 88.2 / 96 / 192 kHz.",
    },
    "comb-filter": {
      title: "Comb Filter",
      description:
        "Enter a delay time to see the comb-filter notch frequencies for in-phase and out-of-phase signals.",
    },
    "harmonic-series": {
      title: "Harmonic Series",
      description:
        "Enter a fundamental frequency to see its harmonic series: harmonic frequencies, nearest notes, and deviation in cents.",
    },
    "q-bandwidth": {
      title: "Q ↔ Bandwidth",
      description:
        "Convert between EQ Q and bandwidth in octaves or Hz.",
    },
  },
  ui: {
    back: "← Tools",
    filterAll: "All",
    showOctRange: "±½ Oct",
    nfRefFreq: "Reference",
    colNote: "Note",
    colMidi: "MIDI",
    colHz: "Hz",
    colOctLow: "−½ Oct",
    colOctHigh: "+½ Oct",
    transposeFrom: "From",
    transposeTo: "To",
    transposeUp: "Up",
    transposeDown: "Down",
    transposeInterval: "Interval",
    transposeSt: "st",
    transposePickBoth: "Select a note in each row",
    pdPhase: "Phase",
    pdFrequency: "Frequency",
    pdSampleRate: "Sample Rate",
    pdLag: "lag",
    pdLagAction: "advance",
    pdLead: "lead",
    pdLeadAction: "delay",
    drBpm: "BPM",
    drReverbSize: "Reverb Size",
    drPreDelay: "Pre-Delay",
    drDecay: "Decay",
    drTotal: "Total",
    nlNote: "Note",
    nlRegular: "Regular",
    nlDotted: "Dotted",
    nlTriplet: "Triplet",
    smSamples: "Samples",
    smMs: "Milliseconds",
    cfDelay: "Delay",
    cfPolarity: "Polarity",
    cfSame: "Same",
    cfInverted: "Inverted",
    cfNotch: "Notch",
    cfFrequency: "Frequency",
    cfSpacing: "Notch spacing",
    cfNoNotches: "No notches below 20 kHz",
    hsFrequency: "Fundamental",
    hsHarmonic: "#",
    hsNote: "Note",
    hsCents: "Cents",
    qbQ: "Q",
    qbOctaves: "Octaves",
    qbHzBw: "Bandwidth",
    qbCenter: "Center Freq",
  },
};

const ja: Translations = {
  home: {
    tagline: "音楽制作のためのオーディオ計算ツール集。",
  },
  tools: {
    "note-frequency": {
      title: "ノート ↔ 周波数",
      description:
        "音名・MIDIノート番号・周波数を1つの表で確認。ピッチクラスで絞り込み、±½オクターブ列の表示切替にも対応。",
    },
    transpose: {
      title: "トランスポーズ",
      description:
        "2つの音を選ぶだけで、半音数と音程名を上行・下行の両方で表示。",
    },
    "phase-delay": {
      title: "フェーズ → ディレイ",
      description:
        "位相差（度）を入力すると、対応するディレイ時間をミリ秒とサンプル数に換算。",
    },
    "delay-reverb": {
      title: "ディレイ & リバーブ",
      description:
        "BPMを入力すると、ホール・ルーム・タイトの各設定に対するプリディレイ・ディケイ・トータル時間を計算。",
    },
    "note-length-time": {
      title: "音価 ↔ 時間",
      description:
        "BPMを入力すると、全音符から64分音符まで、通常・付点・三連符を含む各音価の長さをミリ秒で一覧表示。",
    },
    "samples-ms": {
      title: "ms ↔ サンプル数",
      description:
        "サンプル数とミリ秒を相互変換。44.1 / 48 / 88.2 / 96 / 192 kHz に対応。",
    },
    "comb-filter": {
      title: "コムフィルター",
      description:
        "ディレイ時間を入力すると、同相・逆相それぞれのコムフィルターノッチ周波数を一覧表示。",
    },
    "harmonic-series": {
      title: "倍音列",
      description:
        "基音周波数を入力すると、各倍音の周波数・最近音・セント偏差を一覧表示。",
    },
    "q-bandwidth": {
      title: "Q ↔ 帯域幅",
      description:
        "EQのQ値とオクターブ幅・Hz幅を相互変換。",
    },
  },
  ui: {
    back: "← ツール一覧",
    filterAll: "すべて",
    showOctRange: "±½ Oct",
    nfRefFreq: "基準周波数",
    colNote: "音名",
    colMidi: "MIDI",
    colHz: "Hz",
    colOctLow: "−½ Oct",
    colOctHigh: "+½ Oct",
    transposeFrom: "元の音",
    transposeTo: "移調先",
    transposeUp: "上行",
    transposeDown: "下行",
    transposeInterval: "音程",
    transposeSt: "半音",
    transposePickBoth: "上下それぞれ音を選んでください",
    pdPhase: "位相",
    pdFrequency: "周波数",
    pdSampleRate: "サンプルレート",
    pdLag: "lag",
    pdLagAction: "進める",
    pdLead: "lead",
    pdLeadAction: "遅らせる",
    drBpm: "BPM",
    drReverbSize: "リバーブサイズ",
    drPreDelay: "プリディレイ",
    drDecay: "ディケイ",
    drTotal: "トータル",
    nlNote: "音符",
    nlRegular: "通常",
    nlDotted: "付点",
    nlTriplet: "三連",
    smSamples: "サンプル数",
    smMs: "ミリ秒",
    cfDelay: "ディレイ",
    cfPolarity: "極性",
    cfSame: "同相",
    cfInverted: "逆相",
    cfNotch: "ノッチ",
    cfFrequency: "周波数",
    cfSpacing: "ノッチ間隔",
    cfNoNotches: "20 kHz以下にノッチなし",
    hsFrequency: "基音",
    hsHarmonic: "#",
    hsNote: "音名",
    hsCents: "セント",
    qbQ: "Q",
    qbOctaves: "オクターブ幅",
    qbHzBw: "帯域幅",
    qbCenter: "中心周波数",
  },
};

const DICT: Record<Lang, Translations> = { en, ja };
const STORAGE_KEY = "audiocalc-lang";

function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "en" || v === "ja") return v;
  } catch {
    /* ignore */
  }
  return "en";
}

interface LangContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <LangContext value={{ lang, t: DICT[lang], setLang }}>
      {children}
    </LangContext>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
