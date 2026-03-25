import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { TOOLS } from "../data/tools";
import type { ToolId } from "../data/tools";
import { ToolIcon } from "./ToolIcon";
import "./ToolLayout.css";

interface Props {
  id: ToolId;
  children: React.ReactNode;
}

export function ToolLayout({ id, children }: Props) {
  const { t } = useLang();
  const tool = TOOLS.find((t) => t.id === id)!;
  const { title, description } = t.tools[id];

  return (
    <main
      className="tool-layout"
      style={{ "--tool-accent": tool.accent } as React.CSSProperties}
    >
      <Link to="/" className="tool-layout__back">
        {t.ui.back}
      </Link>

      <header className="tool-layout__header">
        <div className="tool-layout__icon">
          <ToolIcon id={id} size={22} />
        </div>
        <div className="tool-layout__meta">
          <h1 className="tool-layout__title">{title}</h1>
          <p className="tool-layout__desc">{description}</p>
        </div>
      </header>

      <div className="tool-layout__content">{children}</div>
    </main>
  );
}
