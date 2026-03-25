import { useState } from "react";
import { ToolLayout } from "../components/ToolLayout";
import { useLang } from "../i18n";
import { samplesToMs, msToSamples } from "../lib/samplesMs";
import "./SamplesMs.css";

const SAMPLE_RATES = [44100, 48000, 88200, 96000, 192000] as const;

export function SamplesMs() {
  const { t } = useLang();
  const [sampleRate, setSampleRate] = useState(48000);
  const [samples, setSamples] = useState("480");
  const [ms, setMs] = useState("10.000");

  function handleSamplesChange(val: string) {
    setSamples(val);
    const s = parseFloat(val);
    if (Number.isFinite(s) && s >= 0) {
      setMs(samplesToMs(s, sampleRate).toFixed(3));
    }
  }

  function handleMsChange(val: string) {
    setMs(val);
    const m = parseFloat(val);
    if (Number.isFinite(m) && m >= 0) {
      setSamples(String(Math.round(msToSamples(m, sampleRate))));
    }
  }

  function handleSampleRateChange(rate: number) {
    setSampleRate(rate);
    const m = parseFloat(ms);
    if (Number.isFinite(m) && m >= 0) {
      setSamples(String(Math.round(msToSamples(m, rate))));
    }
  }

  return (
    <ToolLayout id="samples-ms">
      <div className="sm-card">
        <div className="sm-sr-row">
          <label className="sm-sr-label" htmlFor="sm-sr">
            {t.ui.pdSampleRate}
          </label>
          <select
            id="sm-sr"
            className="sm-sr-select"
            value={sampleRate}
            onChange={(e) => handleSampleRateChange(parseInt(e.target.value, 10))}
          >
            {SAMPLE_RATES.map((r) => (
              <option key={r} value={r}>
                {r.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div className="sm-converter">
          <div className="sm-field">
            <label className="sm-field__label" htmlFor="sm-ms">
              {t.ui.smMs}
            </label>
            <input
              id="sm-ms"
              className="sm-field__input"
              type="number"
              value={ms}
              min="0"
              step="any"
              onChange={(e) => handleMsChange(e.target.value)}
            />
            <span className="sm-field__unit">ms</span>
          </div>

          <div className="sm-divider" aria-hidden="true">↕</div>

          <div className="sm-field">
            <label className="sm-field__label" htmlFor="sm-samples">
              {t.ui.smSamples}
            </label>
            <input
              id="sm-samples"
              className="sm-field__input"
              type="number"
              value={samples}
              min="0"
              step="1"
              onChange={(e) => handleSamplesChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
