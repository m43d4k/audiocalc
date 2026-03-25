import { useState, useMemo } from "react";
import { ToolLayout } from "../components/ToolLayout";
import { useLang } from "../i18n";
import {
  qToOctaves,
  octavesToQ,
  qToHz,
  hzToQ,
  fmtQ,
  fmtOct,
} from "../lib/qBandwidth";
import "./QBandwidth.css";

// ── Chart ─────────────────────────────────────────────

const W = 400;
const H = 80;
const MIN_HZ = 20;
const MAX_HZ = 20000;
const LOG_MIN = Math.log10(MIN_HZ);
const LOG_MAX = Math.log10(MAX_HZ);
const SAMPLES = 400;

function freqToX(hz: number): number {
  return ((Math.log10(hz) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * W;
}

function freqToPct(hz: number): number {
  return ((Math.log10(hz) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100;
}

const GRID_FREQS = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const AXIS_LABELS = [
  { hz: 100,   label: "100"    },
  { hz: 1000,  label: "1k"     },
  { hz: 10000, label: "10k"    },
  { hz: 20000, label: "20k Hz" },
];

const DB_OPTIONS = [-1, -3, -6, -10, -12] as const;
type DbOption = (typeof DB_OPTIONS)[number];

/**
 * Bandwidth scale factor relative to -3 dB BW, for a Gaussian on log-freq axis.
 * BW_N = BW_3dB × √(|N| × log₂10 / 10)
 */
function bwScaleAt(dbRef: number): number {
  return Math.sqrt(Math.abs(dbRef) * Math.log2(10) / 10);
}

function QChart({
  q,
  f0,
  dbRef,
}: {
  q: number;
  f0: number;
  dbRef: DbOption;
}) {
  const bwOct3dB = qToOctaves(q);

  const { fillPath, strokePath } = useMemo(() => {
    const pts = Array.from({ length: SAMPLES + 1 }, (_, i) => {
      const f = Math.pow(10, LOG_MIN + (i / SAMPLES) * (LOG_MAX - LOG_MIN));
      const logRatio = Math.log2(f / f0);
      const amp = Math.exp(-0.5 * Math.LN2 * (logRatio / (bwOct3dB / 2)) ** 2);
      const x = (i / SAMPLES) * W;
      const y = H - amp * H;
      return `${x.toFixed(1)},${y.toFixed(2)}`;
    });
    const top = `M ${pts.join(" L ")}`;
    return {
      strokePath: top,
      fillPath: `${top} L ${W},${H} L 0,${H} Z`,
    };
  }, [f0, bwOct3dB]);

  const refAmp = Math.pow(10, dbRef / 20);
  const yRef = H - refAmp * H;

  const scale = bwScaleAt(dbRef);
  const bwRef = bwOct3dB * scale;
  const f1 = f0 * Math.pow(2, -bwRef / 2);
  const f2 = f0 * Math.pow(2, +bwRef / 2);

  return (
    <div className="qb-chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="qb-chart"
        aria-hidden
      >
        {GRID_FREQS.map((hz) => (
          <line
            key={hz}
            x1={freqToX(hz)} y1={0}
            x2={freqToX(hz)} y2={H}
            className="qb-chart__grid"
          />
        ))}
        <line x1={0} y1={yRef} x2={W} y2={yRef} className="qb-chart__hline" />
        {f1 >= MIN_HZ && (
          <line
            x1={freqToX(Math.min(f1, MAX_HZ))} y1={0}
            x2={freqToX(Math.min(f1, MAX_HZ))} y2={H}
            className="qb-chart__marker"
          />
        )}
        {f2 <= MAX_HZ && (
          <line
            x1={freqToX(Math.max(f2, MIN_HZ))} y1={0}
            x2={freqToX(Math.max(f2, MIN_HZ))} y2={H}
            className="qb-chart__marker"
          />
        )}
        <path d={fillPath} className="qb-chart__fill" />
        <path d={strokePath} className="qb-chart__stroke" />
      </svg>
      <div className="qb-chart-axis">
        <span className="qb-chart-axis__start">20</span>
        {AXIS_LABELS.map(({ hz, label }) => (
          <span
            key={hz}
            className="qb-chart-axis__tick"
            style={{ left: `${freqToPct(hz)}%` }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────

/** Display octave BW at the given dB reference (not -3 dB) */
function displayOct(q: number, dbRef: DbOption): string {
  return fmtOct(qToOctaves(q) * bwScaleAt(dbRef));
}

/** Display Hz BW at the given dB reference */
function displayHz(q: number, f0: number, dbRef: DbOption): string {
  return (qToHz(q, f0) * bwScaleAt(dbRef)).toFixed(1);
}

function initState(q: number, f0: number, dbRef: DbOption) {
  return { q: fmtQ(q), oct: displayOct(q, dbRef), hz: displayHz(q, f0, dbRef) };
}

// ── Page ──────────────────────────────────────────────

const DEFAULT_Q = Math.SQRT2;
const DEFAULT_F0 = 1000;
const DEFAULT_DB: DbOption = -3;

export function QBandwidth() {
  const { t } = useLang();
  const [f0, setF0] = useState(DEFAULT_F0);
  const [dbRef, setDbRef] = useState<DbOption>(DEFAULT_DB);
  const [fields, setFields] = useState(() =>
    initState(DEFAULT_Q, DEFAULT_F0, DEFAULT_DB),
  );

  const qParsed = parseFloat(fields.q);
  const chartValid = Number.isFinite(qParsed) && qParsed > 0 && f0 > 0;

  function fromQ(val: string) {
    const q = parseFloat(val);
    if (!Number.isFinite(q) || q <= 0) return setFields((f) => ({ ...f, q: val }));
    setFields({ q: val, oct: displayOct(q, dbRef), hz: displayHz(q, f0, dbRef) });
  }

  function fromOct(val: string) {
    const octDisplay = parseFloat(val);
    if (!Number.isFinite(octDisplay) || octDisplay <= 0)
      return setFields((f) => ({ ...f, oct: val }));
    // Convert displayed BW (at dbRef) back to -3 dB BW, then to Q
    const q = octavesToQ(octDisplay / bwScaleAt(dbRef));
    setFields({ q: fmtQ(q), oct: val, hz: displayHz(q, f0, dbRef) });
  }

  function fromHz(val: string) {
    const hzDisplay = parseFloat(val);
    if (!Number.isFinite(hzDisplay) || hzDisplay <= 0)
      return setFields((f) => ({ ...f, hz: val }));
    // Convert displayed Hz BW (at dbRef) back to -3 dB Hz BW, then to Q
    const q = hzToQ(hzDisplay / bwScaleAt(dbRef), f0);
    setFields({ q: fmtQ(q), oct: displayOct(q, dbRef), hz: val });
  }

  function handleF0Change(val: string) {
    const newF0 = parseFloat(val);
    if (!Number.isFinite(newF0) || newF0 <= 0) return;
    setF0(newF0);
    const q = parseFloat(fields.q);
    if (Number.isFinite(q) && q > 0) {
      setFields((f) => ({ ...f, hz: displayHz(q, newF0, dbRef) }));
    }
  }

  function handleDbRefChange(db: DbOption) {
    setDbRef(db);
    const q = parseFloat(fields.q);
    if (Number.isFinite(q) && q > 0) {
      setFields((f) => ({ ...f, oct: displayOct(q, db), hz: displayHz(q, f0, db) }));
    }
  }

  return (
    <ToolLayout id="q-bandwidth">
      <div className="qb-card">
        <div className="qb-top-row">
          <div className="qb-center-row">
            <label className="qb-label" htmlFor="qb-f0">
              {t.ui.qbCenter}
            </label>
            <div className="qb-f0-wrap">
              <input
                id="qb-f0"
                className="qb-f0-input"
                type="number"
                defaultValue={DEFAULT_F0}
                min="1"
                step="any"
                onChange={(e) => handleF0Change(e.target.value)}
              />
              <span className="qb-f0-unit">Hz</span>
            </div>
          </div>

          <div className="qb-dbref-row">
            <span className="qb-label">dB</span>
            <div className="qb-dbref-toggle">
              {DB_OPTIONS.map((db) => (
                <button
                  key={db}
                  className={`qb-dbref-btn${dbRef === db ? " qb-dbref-btn--active" : ""}`}
                  onClick={() => handleDbRefChange(db)}
                >
                  {db}
                </button>
              ))}
            </div>
          </div>
        </div>

        {chartValid && <QChart q={qParsed} f0={f0} dbRef={dbRef} />}

        <div className="qb-converter">
          <div className="qb-field">
            <label className="qb-field__label" htmlFor="qb-q">
              {t.ui.qbQ}
            </label>
            <input
              id="qb-q"
              className="qb-field__input"
              type="number"
              value={fields.q}
              min="0.001"
              step="any"
              onChange={(e) => fromQ(e.target.value)}
            />
          </div>

          <div className="qb-divider" aria-hidden="true">↕</div>

          <div className="qb-field">
            <label className="qb-field__label" htmlFor="qb-oct">
              {t.ui.qbOctaves}
              <span className="qb-field__db">{dbRef} dB</span>
            </label>
            <div className="qb-field__input-wrap">
              <input
                id="qb-oct"
                className="qb-field__input"
                type="number"
                value={fields.oct}
                min="0.001"
                step="any"
                onChange={(e) => fromOct(e.target.value)}
              />
              <span className="qb-field__unit">oct</span>
            </div>
          </div>

          <div className="qb-divider" aria-hidden="true">↕</div>

          <div className="qb-field">
            <label className="qb-field__label" htmlFor="qb-hz">
              {t.ui.qbHzBw}
              <span className="qb-field__db">{dbRef} dB</span>
            </label>
            <div className="qb-field__input-wrap">
              <input
                id="qb-hz"
                className="qb-field__input"
                type="number"
                value={fields.hz}
                min="0.001"
                step="any"
                onChange={(e) => fromHz(e.target.value)}
              />
              <span className="qb-field__unit">Hz</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
