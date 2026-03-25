# AudioCalc

[日本語](README-ja.md)

A collection of audio calculation tools for music production, mixing, and mastering.  
A static web app that runs entirely in the browser — no login required, no tracking.

---

## Tools

| Tool | Description |
|------|-------------|
| **Note ↔ Frequency** | Displays a table of note names, MIDI note numbers, and frequencies in Hz. Supports reference tuning adjustment (A = 432–444 Hz), pitch-class filtering, and optional ±½-octave columns |
| **Transpose** | Select two notes to instantly see the interval in semitones and its name (ascending/descending) |
| **Phase → Delay** | Enter a phase difference in degrees to convert it to the corresponding delay in milliseconds and samples, with lag/lead indication |
| **Delay & Reverb** | Enter a BPM to calculate pre-delay, decay, and total reverb times for hall, room, and tight reverb settings |
| **Note Value ↔ Time** | Enter a BPM to see durations in milliseconds for note values from whole notes to 64th notes, including dotted and triplet variants |
| **ms ↔ Samples** | Convert between milliseconds and sample counts at 44.1 / 48 / 88.2 / 96 / 192 kHz sample rates |
| **Comb Filter** | Calculate in-phase and out-of-phase comb-filter notch frequencies from a delay time, with a logarithmic frequency-response graph |
| **Harmonic Series** | Calculate the harmonic series from a fundamental frequency. Displays frequency, nearest note, and cent deviation in a table, with a spectrum-analyzer-style graph |
| **Q ↔ Bandwidth** | View the bandwidth of a bell EQ at a given Q value in octaves and Hz. Includes a bell-curve display that updates with the selected reference level (−1 to −12 dB) |

---

## Development

### Requirements

Runtime versions are managed with [mise](https://mise.jdx.dev/) (see `mise.toml`).

```text
Node.js 22 / Python 3.12
```

```bash
mise install
```

### Commands

```bash
npm run dev        # Start the Vite dev server (HMR)
npm run build      # TypeScript compile + Vite build → docs/
npm run preview    # Preview the docs/ build output
npm run typecheck  # Type check only (tsc --noEmit)
npm test           # Run Vitest in watch mode
npm run test:ui    # Launch the Vitest UI
```

### Build Output

Build output goes to `docs/` for GitHub Pages deployment.

---

## Tech Stack

- **Vite 6** + **React 19** + **TypeScript 5** (strict mode)
- **plain CSS** + CSS custom properties (design tokens) — no CSS Modules or CSS-in-JS
- **Vitest** + **@testing-library/react**
- **React Router v7**

### Source Structure

```text
src/
  styles/
    tokens.css       # CSS custom properties (design tokens)
    global.css       # Reset + base styles
  components/        # Shared UI components
  pages/             # Page components for each tool
  lib/               # Calculation logic (pure functions)
  data/
    tools.ts         # Tool metadata (ID, path, accent color)
  i18n/
    index.tsx        # EN / JA translation definitions
  App.tsx
  main.tsx
```

Calculation logic is implemented as pure functions in `src/lib/`. React components are responsible for presentation only.

### Conventions

- **MIDI convention**: C3 = MIDI 60 (Yamaha / DAW standard), MIDI 69 = A3 = 440 Hz
- Indentation: 2 spaces for HTML / JS / TS, 4 spaces for CSS
- Line endings: LF
- Encoding: UTF-8
