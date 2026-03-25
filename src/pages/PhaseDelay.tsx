import { useState } from "react";
import { ToolLayout } from "../components/ToolLayout";
import { useLang } from "../i18n";
import { calcPhaseDelay } from "../lib/phaseDelay";
import "./PhaseDelay.css";

export function PhaseDelay() {
  const { t } = useLang();
  const [phi, setPhi] = useState(90);
  const [freq, setFreq] = useState(1000);
  const [sampleRate, setSampleRate] = useState(48000);

  const valid =
    Number.isFinite(phi) &&
    Number.isFinite(freq) && freq > 0 &&
    Number.isFinite(sampleRate) && sampleRate > 0;

  const result = valid ? calcPhaseDelay(phi, freq, sampleRate) : null;

  return (
    <ToolLayout id="phase-delay">
      <div className="pd-card">
        <div className="pd-form">
          <label className="pd-label" htmlFor="pd-phi">
            {t.ui.pdPhase}
            <span className="pd-unit">°</span>
          </label>
          <input
            id="pd-phi"
            className="pd-input"
            type="number"
            value={phi}
            step="any"
            onChange={(e) => setPhi(parseFloat(e.target.value))}
          />

          <label className="pd-label" htmlFor="pd-freq">
            {t.ui.pdFrequency}
            <span className="pd-unit">Hz</span>
          </label>
          <input
            id="pd-freq"
            className="pd-input"
            type="number"
            value={freq}
            min="0.001"
            step="any"
            onChange={(e) => setFreq(parseFloat(e.target.value))}
          />

          <label className="pd-label" htmlFor="pd-sr">
            {t.ui.pdSampleRate}
            <span className="pd-unit">Hz</span>
          </label>
          <select
            id="pd-sr"
            className="pd-input pd-select"
            value={sampleRate}
            onChange={(e) => setSampleRate(parseInt(e.target.value, 10))}
          >
            <option value={44100}>44 100</option>
            <option value={48000}>48 000</option>
            <option value={88200}>88 200</option>
            <option value={96000}>96 000</option>
            <option value={192000}>192 000</option>
          </select>
        </div>
      </div>

      <div className="pd-result">
        {result ? (
          <>
            <div className="pd-result__primary">
              <span className="pd-result__value">{result.ms.toFixed(3)}</span>
              <span className="pd-result__unit">ms</span>
            </div>
            <div className="pd-result__secondary">
              {result.samples.toFixed(2)}
              <span className="pd-result__unit-sm">samples</span>
            </div>
            {result.sign !== "zero" && (
              <div className="pd-result__state">
                <span className={`pd-result__badge pd-result__badge--${result.sign}`}>
                  {result.sign === "lag" ? t.ui.pdLag : t.ui.pdLead}
                </span>
                <span className="pd-result__arrow">→</span>
                <span className="pd-result__action">
                  {result.sign === "lag" ? t.ui.pdLagAction : t.ui.pdLeadAction}
                </span>
              </div>
            )}
          </>
        ) : (
          <p className="pd-result__invalid">—</p>
        )}
      </div>
    </ToolLayout>
  );
}
