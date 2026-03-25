export function samplesToMs(samples: number, sampleRate: number): number {
  return (samples / sampleRate) * 1000;
}

export function msToSamples(ms: number, sampleRate: number): number {
  return (ms / 1000) * sampleRate;
}
