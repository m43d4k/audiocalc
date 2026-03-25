import { Link } from "react-router-dom";
import type { ToolMeta } from "../data/tools";
import { ToolIcon } from "./ToolIcon";
import "./ToolCard.css";

interface Props {
  tool: ToolMeta;
  title: string;
  description: string;
}

export function ToolCard({ tool, title, description }: Props) {
  return (
    <Link
      to={tool.path}
      className="tool-card"
      style={{ "--tool-accent": tool.accent } as React.CSSProperties}
    >
      <div className="tool-card__header">
        <div className="tool-card__icon">
          <ToolIcon id={tool.id} size={20} />
        </div>
        <h2 className="tool-card__title">{title}</h2>
      </div>
      <p className="tool-card__desc">{description}</p>
      <span className="tool-card__arrow" aria-hidden="true">→</span>
    </Link>
  );
}
