import { useLang, type Lang } from "../i18n";
import "./LangSwitcher.css";

const LANGS: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ja", label: "日本語" },
];

export function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      {LANGS.map(({ value, label }) => (
        <button
          key={value}
          className="lang-switcher__btn"
          aria-pressed={lang === value}
          onClick={() => setLang(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
