import { useState } from "react";
import { ToolLayout } from "../components/ToolLayout";
import { useLang } from "../i18n";
import { calcReverbTimes } from "../lib/delayReverb";
import "./DelayReverb.css";

export function DelayReverb() {
  const { t } = useLang();
  const [bpm, setBpm] = useState(120);

  const valid = Number.isFinite(bpm) && bpm > 0;
  const rows = valid ? calcReverbTimes(bpm) : [];

  return (
    <ToolLayout id="delay-reverb">
      <div className="dr-bpm-wrap">
        <label className="dr-bpm-label" htmlFor="dr-bpm">
          {t.ui.drBpm}
        </label>
        <input
          id="dr-bpm"
          className="dr-bpm-input"
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

      <div className="dr-table-wrap">
        <table className="dr-table">
          <thead>
            <tr>
              <th>{t.ui.drReverbSize}</th>
              <th>{t.ui.drPreDelay}<span className="dr-th-unit">ms</span></th>
              <th>{t.ui.drDecay}<span className="dr-th-unit">ms</span></th>
              <th>{t.ui.drTotal}<span className="dr-th-unit">ms</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="dr-table__name">
                  <span className="dr-table__name-main">{row.name}</span>
                  <span className="dr-table__name-note">{row.note}</span>
                </td>
                <td className="dr-table__num">{row.pre.toFixed(2)}</td>
                <td className="dr-table__num">{row.decay.toFixed(2)}</td>
                <td className="dr-table__num dr-table__num--total">
                  {row.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolLayout>
  );
}
