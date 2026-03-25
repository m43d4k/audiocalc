export type ToolId =
  | "note-frequency"
  | "transpose"
  | "phase-delay"
  | "delay-reverb"
  | "note-length-time"
  | "samples-ms"
  | "comb-filter"
  | "harmonic-series"
  | "q-bandwidth";

export interface ToolMeta {
  id: ToolId;
  path: string;
  accent: string;
}

export const TOOLS: ToolMeta[] = [
  { id: "note-frequency",   path: "/note-frequency",   accent: "#00d4ff" },
  { id: "transpose",        path: "/transpose",        accent: "#a78bfa" },
  { id: "phase-delay",      path: "/phase-delay",      accent: "#34d399" },
  { id: "delay-reverb",     path: "/delay-reverb",     accent: "#fb923c" },
  { id: "note-length-time", path: "/note-length-time", accent: "#f472b6" },
  { id: "samples-ms",       path: "/samples-ms",       accent: "#fbbf24" },
  { id: "comb-filter",      path: "/comb-filter",      accent: "#ef4444" },
  { id: "harmonic-series",  path: "/harmonic-series",  accent: "#60a5fa" },
  { id: "q-bandwidth",      path: "/q-bandwidth",      accent: "#2dd4bf" },
];
