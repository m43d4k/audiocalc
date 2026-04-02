let _ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!_ctx || _ctx.state === "closed") {
    _ctx = new AudioContext();
  }
  return _ctx;
}

export interface AudioPlayer {
  stop: () => void;
  setFrequency: (hz: number) => void;
}

/** サイン波を再生し、stop / setFrequency を持つオブジェクトを返す。 */
export function playFrequency(hz: number): AudioPlayer {
  const ctx = getCtx();
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = hz;

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.01);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);

  let stopped = false;

  return {
    stop() {
      if (stopped) return;
      stopped = true;
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.02);
      osc.stop(t + 0.02);
    },
    setFrequency(newHz: number) {
      if (stopped) return;
      osc.frequency.setTargetAtTime(newHz, ctx.currentTime, 0.02);
    },
  };
}
