export interface PhaseDelayResult {
  ms: number;
  samples: number;
  sign: "lag" | "lead" | "zero";
}

export function calcPhaseDelay(
  phiDeg: number,
  freqHz: number,
  sampleRate: number,
): PhaseDelayResult {
  const ms = -(phiDeg / 360) * (1000 / freqHz);
  const samples = -(phiDeg / 360) * (sampleRate / freqHz);
  const sign: PhaseDelayResult["sign"] =
    ms > 0 ? "lag" : ms < 0 ? "lead" : "zero";
  return { ms, samples, sign };
}
