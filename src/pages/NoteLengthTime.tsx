import { useState, useMemo } from "react";
import { ToolLayout } from "../components/ToolLayout";
import { useLang } from "../i18n";
import { calcNoteLengths, fmtMs } from "../lib/noteLengthTime";
import "./NoteLengthTime.css";

export function NoteLengthTime() {
  const { t } = useLang();
  const [bpm, setBpm] = useState(120);

  const valid = Number.isFinite(bpm) && bpm > 0;
  const rows = useMemo(
    () => (valid ? calcNoteLengths(bpm) : []),
    [bpm, valid],
  );

  return (
    <ToolLayout id="note-length-time">
      <div className="nlt-bpm-wrap">
        <label className="nlt-bpm-label" htmlFor="nlt-bpm">
          {t.ui.drBpm}
        </label>
        <input
          id="nlt-bpm"
          className="nlt-bpm-input"
          type="number"
          value={bpm}
          min="1"
          max="999"
          step="1"
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v > 0) setBpm(v);
          }}
        />
      </div>

      <div className="nlt-table-wrap">
        <table className="nlt-table">
          <thead>
            <tr>
              <th>{t.ui.nlNote}</th>
              <th>
                {t.ui.nlRegular}
                <span className="nlt-th-unit">ms</span>
              </th>
              <th>
                {t.ui.nlDotted}
                <span className="nlt-th-unit">ms</span>
              </th>
              <th>
                {t.ui.nlTriplet}
                <span className="nlt-th-unit">ms</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="nlt-table__note">
                  <span className="nlt-table__label">{row.label}</span>
                  <span className="nlt-table__name">{row.name}</span>
                </td>
                <td className="nlt-table__num nlt-table__num--accent">
                  {fmtMs(row.regular)}
                </td>
                <td className="nlt-table__num">{fmtMs(row.dotted)}</td>
                <td className="nlt-table__num">{fmtMs(row.triplet)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolLayout>
  );
}
