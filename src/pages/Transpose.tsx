import { useState } from "react";
import { ToolLayout } from "../components/ToolLayout";
import { useLang } from "../i18n";
import { NOTES, calcTranspose, type Note } from "../lib/transpose";
import "./Transpose.css";

export function Transpose() {
  const { t } = useLang();
  const [from, setFrom] = useState<Note | null>(null);
  const [to, setTo] = useState<Note | null>(null);

  const result = from && to ? calcTranspose(from, to) : null;

  return (
    <ToolLayout id="transpose">
      <div className="tp-section">
        <p className="tp-section__label">{t.ui.transposeFrom}</p>
        <div className="tp-notes" role="group" aria-label={t.ui.transposeFrom}>
          {NOTES.map((note) => (
            <button
              key={note}
              className={`tp-note${from === note ? " tp-note--active" : ""}`}
              onClick={() => setFrom(note)}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      <div className="tp-section">
        <p className="tp-section__label">{t.ui.transposeTo}</p>
        <div className="tp-notes" role="group" aria-label={t.ui.transposeTo}>
          {NOTES.map((note) => (
            <button
              key={note}
              className={`tp-note${to === note ? " tp-note--active" : ""}`}
              onClick={() => setTo(note)}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      <div className="tp-result">
        {result ? (
          <>
            <div className="tp-result__row">
              <span className="tp-result__dir">↑</span>
              <span className="tp-result__num">+{result.up}</span>
              <span className="tp-result__unit">{t.ui.transposeSt}</span>
              <span className="tp-result__interval">{result.upInterval}</span>
            </div>
            <div className="tp-result__divider" />
            <div className="tp-result__row">
              <span className="tp-result__dir">↓</span>
              <span className="tp-result__num">−{result.down}</span>
              <span className="tp-result__unit">{t.ui.transposeSt}</span>
              <span className="tp-result__interval">{result.downInterval}</span>
            </div>
          </>
        ) : (
          <p className="tp-result__hint">{t.ui.transposePickBoth}</p>
        )}
      </div>
    </ToolLayout>
  );
}
