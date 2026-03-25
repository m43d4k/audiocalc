import type { ToolId } from "../data/tools";

interface Props {
  id: ToolId;
  size?: number;
}

export function ToolIcon({ id, size = 22 }: Props) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (id) {
    case "note-frequency":
      return (
        <svg {...props}>
          <path d="M9 17V5l12-2v12" />
          <circle cx="6" cy="17" r="3" />
          <circle cx="18" cy="15" r="3" />
        </svg>
      );

    case "transpose":
      return (
        <svg {...props}>
          <path d="M8 3L4 7h3v10H4l4 4 4-4H9V7h3L8 3z" />
          <path d="M16 21l4-4h-3V7h3l-4-4-4 4h3v10h-3l4 4z" />
        </svg>
      );

    case "phase-delay":
      return (
        <svg {...props}>
          <path d="M2 12c.8-4.5 2.2-6.5 4-6.5 3 0 3 13 6 13s3-13 6-13c1.8 0 3.2 2 4 6.5" />
        </svg>
      );

    case "delay-reverb":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15.5 14" />
        </svg>
      );

    case "note-length-time":
      return (
        <svg {...props}>
          {/* Note head + stem */}
          <circle cx="5" cy="17" r="3" />
          <path d="M8 17V7l10-2" />
          {/* Duration bracket */}
          <path d="M3 22h18" />
          <path d="M3 20v4" />
          <path d="M21 20v4" />
        </svg>
      );

    case "samples-ms":
      return (
        <svg {...props}>
          {/* Time axis */}
          <path d="M2 12h20" />
          {/* Sample points with stems */}
          <line x1="6"  y1="12" x2="6"  y2="7"  />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="18" y1="12" x2="18" y2="8"  />
          <circle cx="6"  cy="7"  r="2" fill="currentColor" stroke="none" />
          <circle cx="12" cy="16" r="2" fill="currentColor" stroke="none" />
          <circle cx="18" cy="8"  r="2" fill="currentColor" stroke="none" />
        </svg>
      );

    case "comb-filter":
      return (
        <svg {...props}>
          {/* Frequency response with comb notches */}
          <path d="M2 6 L6 6 L7 18 L9 18 L10 6 L14 6 L15 18 L17 18 L18 6 L22 6" />
        </svg>
      );

    case "q-bandwidth":
      return (
        <svg {...props}>
          {/* Bell-curve / peak EQ shape */}
          <path d="M2 18 Q4 18 7 14 Q10 6 12 6 Q14 6 17 14 Q20 18 22 18" />
          {/* -3dB markers */}
          <line x1="8"  y1="10" x2="8"  y2="18" strokeDasharray="2 2" />
          <line x1="16" y1="10" x2="16" y2="18" strokeDasharray="2 2" />
        </svg>
      );

    case "harmonic-series":
      return (
        <svg {...props}>
          {/* Baseline */}
          <line x1="2" y1="19" x2="22" y2="19" />
          {/* Harmonic partials — spacing halves each octave, height = 1/n */}
          <line x1="4"  y1="19" x2="4"  y2="4"  />
          <line x1="8"  y1="19" x2="8"  y2="10" />
          <line x1="12" y1="19" x2="12" y2="13" />
          <line x1="15" y1="19" x2="15" y2="15" />
          <line x1="17" y1="19" x2="17" y2="16" />
          <line x1="19" y1="19" x2="19" y2="17" />
          <line x1="21" y1="19" x2="21" y2="17" />
        </svg>
      );
  }
}
