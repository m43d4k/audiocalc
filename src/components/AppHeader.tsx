import { LangSwitcher } from "./LangSwitcher";
import "./AppHeader.css";

export function AppHeader() {
  return (
    <header className="app-header">
      <LangSwitcher />
    </header>
  );
}
