import { useState, useMemo } from "react";
import { ToolLayout } from "../components/ToolLayout";
import { useLang } from "../i18n";
import { calcHarmonics, fmtFreq, type Harmonic } from "../lib/harmonics";
import "./HarmonicSeries.css";

const COUNTS = [8, 16, 24, 32] as const;

// ── Chart ─────────────────────────────────────────────

const W = 400;
const H = 80;
const MIN_HZ = 20;
const MAX_HZ = 20000;
const LOG_MIN = Math.log10(MIN_HZ);
const LOG_MAX = Math.log10(MAX_HZ);

function freqToX(hz: number): number {
  return ((Math.log10(hz) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * W;
}

function freqToPct(hz: number): number {
  return ((Math.log10(hz) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100;
}

const GRID_FREQS = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const AXIS_LABELS = [
  { hz: 100,   label: "100"     },
  { hz: 1000,  label: "1k"      },
  { hz: 10000, label: "10k"     },
  { hz: 20000, label: "20k Hz"  },
];

function HarmonicChart({ harmonics }: { harmonics: Harmonic[] }) {
  const bars = useMemo(
    () =>
      harmonics
        .filter(({ freqHz }) => freqHz >= MIN_HZ && freqHz <= MAX_HZ)
        .map(({ n, freqHz }) => ({
          n,
          x: freqToX(freqHz),
          barH: (1 / n) * H,
        })),
    [harmonics],
  );

  return (
    <div className="hs-chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="hs-chart"
        aria-hidden
      >
        {GRID_FREQS.map((hz) => (
          <line
            key={hz}
            x1={freqToX(hz)} y1={0}
            x2={freqToX(hz)} y2={H}
            className="hs-chart__grid"
          />
        ))}
        {bars.map(({ n, x, barH }) => (
          <line
            key={n}
            x1={x} y1={H}
            x2={x} y2={H - barH}
            className="hs-chart__bar"
          />
        ))}
      </svg>
      <div className="hs-chart-axis">
        <span className="hs-chart-axis__start">20</span>
        {AXIS_LABELS.map(({ hz, label }) => (
          <span
            key={hz}
            className="hs-chart-axis__tick"
            style={{ left: `${freqToPct(hz)}%` }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────

export function HarmonicSeries() {
  const { t } = useLang();
  const [freqStr, setFreqStr] = useState("110");
  const [count, setCount] = useState(16);

  const fundamental = parseFloat(freqStr);
  const valid = Number.isFinite(fundamental) && fundamental > 0;

  const harmonics = useMemo(
    () => (valid ? calcHarmonics(fundamental, count) : []),
    [fundamental, count, valid],
  );

  return (
    <ToolLayout id="harmonic-series">
      <div className="hs-controls">
        <div className="hs-field">
          <label className="hs-label" htmlFor="hs-freq">
            {t.ui.hsFrequency}
          </label>
          <div className="hs-input-wrap">
            <input
              id="hs-freq"
              className="hs-input"
              type="number"
              value={freqStr}
              min="1"
              step="any"
              onChange={(e) => setFreqStr(e.target.value)}
            />
            <span className="hs-unit">Hz</span>
          </div>
        </div>

        <div className="hs-count-group">
          {COUNTS.map((c) => (
            <button
              key={c}
              className={`hs-count-btn${count === c ? " hs-count-btn--active" : ""}`}
              onClick={() => setCount(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {valid && <HarmonicChart harmonics={harmonics} />}

      {valid && (
        <div className="hs-table-wrap">
          <table className="hs-table">
            <thead>
              <tr>
                <th className="hs-th hs-th--n">{t.ui.hsHarmonic}</th>
                <th className="hs-th hs-th--freq">{t.ui.hsFrequency}</th>
                <th className="hs-th hs-th--note">{t.ui.hsNote}</th>
                <th className="hs-th hs-th--cents">{t.ui.hsCents}</th>
              </tr>
            </thead>
            <tbody>
              {harmonics.map(({ n, freqHz, noteName, cents }) => (
                <tr key={n} className="hs-tr">
                  <td className="hs-td hs-td--n">{n}</td>
                  <td className="hs-td hs-td--freq">{fmtFreq(freqHz)}</td>
                  <td className="hs-td hs-td--note">{noteName}</td>
                  <td
                    className="hs-td hs-td--cents"
                    data-tune={
                      Math.abs(cents) <= 5
                        ? "good"
                        : Math.abs(cents) <= 20
                          ? "mid"
                          : "off"
                    }
                  >
                    {cents > 0 ? `+${cents}` : cents}¢
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ToolLayout>
  );
}
