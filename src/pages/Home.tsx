import { TOOLS } from "../data/tools";
import { useLang } from "../i18n";
import { ToolCard } from "../components/ToolCard";
import "./Home.css";

export function Home() {
  const { t } = useLang();

  return (
    <main className="home">
      <section className="home__hero">
        <p className="home__eyebrow">{t.home.eyebrow}</p>
        <h1 className="home__title">AudioCalc</h1>
        <p className="home__tagline">
          {t.home.tagline.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </section>

      <section className="home__tools" aria-label="Tools">
        <div className="home__grid">
          {TOOLS.map((tool) => {
            const { title, description } = t.tools[tool.id];
            return (
              <ToolCard
                key={tool.id}
                tool={tool}
                title={title}
                description={description}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
