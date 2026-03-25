import { useState, useMemo } from "react";
import { ToolLayout } from "../components/ToolLayout";
import { useLang } from "../i18n";
import {
  calcCombNotches,
  combSpacingHz,
  fmtHz,
  type CombPolarity,
} from "../lib/combFilter";
import "./CombFilter.css";

const W = 400;
const H = 72;
const SAMPLES = 2000;
const MIN_HZ = 20;
const MAX_HZ = 10000;
const LOG_MIN = Math.log10(MIN_HZ);
const LOG_MAX = Math.log10(MAX_HZ);

/** Convert frequency to SVG x position (0–W) on a log scale */
function freqToX(hz: number): number {
  return ((Math.log10(hz) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * W;
}

/** Convert frequency to percentage (0–100) for CSS positioning */
function freqToPct(hz: number): number {
  return ((Math.log10(hz) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100;
}

const GRID_FREQS = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
const AXIS_LABELS = [
  { hz: 100,   label: "100" },
  { hz: 1000,  label: "1k"  },
  { hz: 10000, label: "10k Hz" },
];

function CombChart({
  delayMs,
  polarity,
}: {
  delayMs: number;
  polarity: CombPolarity;
}) {
  const τ = delayMs / 1000;

  const { fillPath, strokePath } = useMemo(() => {
    // Sample uniformly in log(f) space — index maps linearly to x
    const pts = Array.from({ length: SAMPLES + 1 }, (_, i) => {
      const f = Math.pow(10, LOG_MIN + (i / SAMPLES) * (LOG_MAX - LOG_MIN));
      const val =
        polarity === "same"
          ? Math.abs(Math.cos(Math.PI * f * τ))
          : Math.abs(Math.sin(Math.PI * f * τ));
      const x = (i / SAMPLES) * W;
      const y = H - val * H;
      return `${x.toFixed(1)},${y.toFixed(2)}`;
    });
    const top = `M ${pts.join(" L ")}`;
    return {
      strokePath: top,
      fillPath: `${top} L ${W},${H} L 0,${H} Z`,
    };
  }, [τ, polarity]);

  return (
    <div className="cf-chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="cf-chart"
        aria-hidden
      >
        {GRID_FREQS.map((hz) => {
          const x = freqToX(hz);
          return (
            <line
              key={hz}
              x1={x} y1={0}
              x2={x} y2={H}
              className="cf-chart__grid"
            />
          );
        })}
        <path d={fillPath} className="cf-chart__fill" />
        <path d={strokePath} className="cf-chart__stroke" />
      </svg>
      <div className="cf-chart-axis">
        <span className="cf-chart-axis__start">20</span>
        {AXIS_LABELS.map(({ hz, label }) => (
          <span
            key={hz}
            className="cf-chart-axis__tick"
            style={{ left: `${freqToPct(hz)}%` }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CombFilter() {
  const { t } = useLang();
  const [delayMs, setDelayMs] = useState("5.0");
  const [polarity, setPolarity] = useState<CombPolarity>("same");

  const delay = parseFloat(delayMs);
  const valid = Number.isFinite(delay) && delay > 0;

  const notches = useMemo(
    () => (valid ? calcCombNotches(delay, polarity) : []),
    [delay, polarity, valid],
  );

  const spacing = valid ? combSpacingHz(delay) : null;

  return (
    <ToolLayout id="comb-filter">
      <div className="cf-card">
        {/* Delay input */}
        <div className="cf-input-row">
          <label className="cf-label" htmlFor="cf-delay">
            {t.ui.cfDelay}
          </label>
          <div className="cf-input-wrap">
            <input
              id="cf-delay"
              className="cf-input"
              type="number"
              value={delayMs}
              min="0.01"
              step="any"
              onChange={(e) => setDelayMs(e.target.value)}
            />
            <span className="cf-unit">ms</span>
          </div>
        </div>

        {/* Polarity toggle */}
        <div className="cf-polarity-row">
          <span className="cf-label">{t.ui.cfPolarity}</span>
          <div className="cf-toggle">
            <button
              className={`cf-toggle__btn${polarity === "same" ? " cf-toggle__btn--active" : ""}`}
              onClick={() => setPolarity("same")}
            >
              {t.ui.cfSame}
            </button>
            <button
              className={`cf-toggle__btn${polarity === "inverted" ? " cf-toggle__btn--active" : ""}`}
              onClick={() => setPolarity("inverted")}
            >
              {t.ui.cfInverted}
            </button>
          </div>
        </div>

        {/* Chart */}
        {valid && <CombChart delayMs={delay} polarity={polarity} />}

        {/* Spacing */}
        {spacing !== null && (
          <div className="cf-spacing-row">
            <span className="cf-spacing__label">{t.ui.cfSpacing}</span>
            <span className="cf-spacing__value">{fmtHz(spacing)}</span>
          </div>
        )}

        {/* Notch table */}
        <div className="cf-table-wrap">
          {notches.length === 0 ? (
            <p className="cf-empty">{t.ui.cfNoNotches}</p>
          ) : (
            <table className="cf-table">
              <thead>
                <tr>
                  <th className="cf-th cf-th--n">{t.ui.cfNotch}</th>
                  <th className="cf-th cf-th--freq">{t.ui.cfFrequency}</th>
                </tr>
              </thead>
              <tbody>
                {notches.map(({ n, freqHz }) => (
                  <tr key={n} className="cf-tr">
                    <td className="cf-td cf-td--n">{n}</td>
                    <td className="cf-td cf-td--freq">{fmtHz(freqHz)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
