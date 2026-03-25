import { HashRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./i18n";
import { AppHeader } from "./components/AppHeader";
import { Home } from "./pages/Home";
import { NoteFrequency } from "./pages/NoteFrequency";
import { Transpose } from "./pages/Transpose";
import { PhaseDelay } from "./pages/PhaseDelay";
import { DelayReverb } from "./pages/DelayReverb";
import { NoteLengthTime } from "./pages/NoteLengthTime";
import { SamplesMs } from "./pages/SamplesMs";
import { CombFilter } from "./pages/CombFilter";
import { HarmonicSeries } from "./pages/HarmonicSeries";
import { QBandwidth } from "./pages/QBandwidth";

export function App() {
  return (
    <LangProvider>
      <HashRouter>
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/note-frequency" element={<NoteFrequency />} />
          <Route path="/transpose" element={<Transpose />} />
          <Route path="/phase-delay" element={<PhaseDelay />} />
          <Route path="/delay-reverb" element={<DelayReverb />} />
          <Route path="/note-length-time" element={<NoteLengthTime />} />
          <Route path="/samples-ms" element={<SamplesMs />} />
          <Route path="/comb-filter" element={<CombFilter />} />
          <Route path="/harmonic-series" element={<HarmonicSeries />} />
          <Route path="/q-bandwidth" element={<QBandwidth />} />
        </Routes>
      </HashRouter>
    </LangProvider>
  );
}
