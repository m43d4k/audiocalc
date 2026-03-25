import { useState, useMemo } from "react";
import { ToolLayout } from "../components/ToolLayout";
import { useLang } from "../i18n";
import {
  generateTones,
  REF_MIN,
  REF_MAX,
  REF_DEFAULT,
} from "../lib/noteFrequency";
import "./NoteFrequency.css";

const PITCH_CLASSES = [
  "All", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;
type PitchClass = (typeof PITCH_CLASSES)[number];

export function NoteFrequency() {
  const { t } = useLang();
  const [filter, setFilter] = useState<PitchClass>("All");
  const [showOct, setShowOct] = useState(false);
  const [ref, setRef] = useState(REF_DEFAULT);

  const tones = useMemo(() => generateTones(ref), [ref]);

  const filtered =
    filter === "All"
      ? tones
      : tones.filter((e) => e.pitchClass === filter);

  const refPercent = ((ref - REF_MIN) / (REF_MAX - REF_MIN)) * 100;

  return (
    <ToolLayout id="note-frequency">
      <div className="nf-controls">
        <div className="nf-filter" role="group" aria-label="Pitch class filter">
          {PITCH_CLASSES.map((pc) => (
            <button
              key={pc}
              className={`nf-filter__btn${filter === pc ? " nf-filter__btn--active" : ""}`}
              onClick={() => setFilter(pc)}
            >
              {pc === "All" ? t.ui.filterAll : pc}
            </button>
          ))}
        </div>

        <label className="nf-oct-label">
          <input
            type="checkbox"
            className="nf-oct-checkbox"
            checked={showOct}
            onChange={(e) => setShowOct(e.target.checked)}
          />
          <span className="nf-oct-text">{t.ui.showOctRange}</span>
        </label>
      </div>

      <div className="nf-ref">
        <span className="nf-ref__label">{t.ui.nfRefFreq}</span>
        <div className="nf-ref__slider-wrap">
          <span className="nf-ref__bound">{REF_MIN}</span>
          <input
            type="range"
            className="nf-ref__slider"
            min={REF_MIN}
            max={REF_MAX}
            step={1}
            value={ref}
            style={{ "--fill": `${refPercent}%` } as React.CSSProperties}
            onChange={(e) => setRef(parseInt(e.target.value, 10))}
          />
          <span className="nf-ref__bound">{REF_MAX}</span>
        </div>
        <span className="nf-ref__value">
          A = <strong>{ref}</strong> Hz
        </span>
        {ref !== REF_DEFAULT && (
          <button
            className="nf-ref__reset"
            onClick={() => setRef(REF_DEFAULT)}
            aria-label="Reset to 440 Hz"
          >
            ↺
          </button>
        )}
      </div>

      <div className="nf-table-wrap">
        <table className="nf-table">
          <thead>
            <tr>
              <th>{t.ui.colNote}</th>
              <th>{t.ui.colMidi}</th>
              <th>{t.ui.colHz}</th>
              {showOct && <th>{t.ui.colOctLow}</th>}
              {showOct && <th>{t.ui.colOctHigh}</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.midi}
                className={row.note.startsWith("C") && !row.note.startsWith("C#") ? "nf-table__row--c" : ""}
              >
                <td className="nf-table__note">{row.note}</td>
                <td className="nf-table__num">{row.midi}</td>
                <td className="nf-table__num">{row.freq.toFixed(3)}</td>
                {showOct && (
                  <td className="nf-table__num nf-table__num--dim">
                    {row.low.toFixed(3)}
                  </td>
                )}
                {showOct && (
                  <td className="nf-table__num nf-table__num--dim">
                    {row.high.toFixed(3)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolLayout>
  );
}
