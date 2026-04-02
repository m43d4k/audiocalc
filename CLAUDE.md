# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AudioCalc** — Audio calculators for music production, mixing, and mastering. A static web project (no build step, no framework).

The `_legacy/` directory holds the previous iteration of these tools (gitignored). New tools are built directly in the project root.

## Development

### Runtime

Managed by `mise.toml`: Node 22 / Python 3.12.

```
mise install
```

### Commands

```bash
npm run dev        # Vite dev server (HMR)
npm run build      # tsc -b && vite build → dist/
npm run preview    # preview the dist/ build
npm run typecheck  # tsc --noEmit
npm test           # vitest (watch mode)
npm run test:ui    # vitest UI
```

### Python

Always use `uv`, never call `python` or `pip` directly:

```bash
uv run python script.py
uv add <package>
uv remove <package>
uv pip install <package>
```

## Architecture

### Stack

Vite + React 19 + TypeScript + plain CSS + Vitest. No CSS modules, no CSS-in-JS — plain `.css` files with CSS custom properties.

### Build Output

`dist/` — Vite デフォルトの出力先。`vite build` で生成される。

### Source Structure

```
src/
  styles/
    tokens.css       # CSS custom properties (design tokens) — import this first
    global.css       # reset + base styles (imports tokens.css)
  components/        # shared UI components
  tools/             # individual calculator tools
  test/
    setup.ts         # @testing-library/jest-dom setup
  vite-env.d.ts
  App.tsx
  main.tsx
```

### Design Tokens (`src/styles/tokens.css`)

All values (colors, spacing, typography, radius, etc.) live as CSS custom properties on `:root`. Use these variables instead of raw values. Key groups:

- `--color-*` — dark theme palette; accent is `--color-accent` (#00d4ff)
- `--space-*` — 4px grid (1 = 4px, 2 = 8px … 16 = 64px)
- `--text-*` — font sizes; `--weight-*` — weights
- `--font-sans` / `--font-mono` — font stacks

### Legacy Tools (reference implementations in `_legacy/`)

| Directory | Purpose |
|-----------|---------|
| `note-frequency/` | Note↔Frequency table; loads data from `tones.json` via `fetch()`, pitch-class filter buttons, ±½ Oct toggle |
| `transpose/` | Semitone + interval name between two notes |
| `phase-delay/` | Phase shift (°) → delay/advance in ms and samples; handles full-width digit input |
| `delay-reverb/` | BPM → pre-delay / decay / total reverb timing table |

### Conventions

- **MIDI convention**: C3 = MIDI 60 (not C4)
- Calculator logic is pure functions (no side effects); React components only handle display
- Test files: `*.test.ts` / `*.test.tsx` alongside the source file

## Code Style

From `.editorconfig`:
- HTML / JS / TS: 2-space indent
- CSS: 4-space indent
- LF line endings, UTF-8, trailing newline required
