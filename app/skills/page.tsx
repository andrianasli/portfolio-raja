"use client";
import { useRef, useState, useEffect } from "react";

function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null!);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const SKILLS = [
  { name: "React / Next.js", level: 80, category: "Frontend" },
  { name: "Mobile Development", level: 75, category: "Mobile" },
  { name: "JavaScript", level: 78, category: "Language" },
  { name: "TypeScript", level: 60, category: "Language" },
  { name: "Git & GitHub", level: 82, category: "Tools" },
  { name: "UI Design", level: 70, category: "Design" },
  { name: "Java (Android)", level: 72, category: "Mobile" },
  { name: "MySQL", level: 65, category: "Database" },
  { name: "Problem Solving", level: 85, category: "Soft Skill" },
];

export default function SkillsPage() {
  const [ref, inView] = useInView();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "140px 24px 100px",
        position: "relative",
        zIndex: 1,
        
      }}
    >
      <div style={{ height: 1, background: "rgba(240,240,240,0.08)", marginBottom: 80 }} />

      <div ref={ref} className={`section-reveal ${inView ? "visible" : ""}`}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.25em",
            opacity: 0.4,
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          <span>01</span>
          <span className="divider-line" />
          Skills & Tools
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "start" }}>
          {/* Left */}
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 900,
                lineHeight: 1.0,
                marginBottom: 28,
              }}
            >
              Apa yang
              <br />
              <em style={{ fontWeight: 400, opacity: 0.7 }}>saya kuasai</em>
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.85, opacity: 0.5, maxWidth: 340 }}>
              Fokus pada pengembangan aplikasi mobile dan web modern menggunakan
              teknologi terkini.
            </p>
          </div>

          {/* Right — skill bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {SKILLS.map((skill, i) => (
              <div
                key={skill.name}
                style={{
                  opacity: 0,
                  animation: inView
                    ? `fadeUp 0.5s ${i * 0.07}s cubic-bezier(.22,1,.36,1) forwards`
                    : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 12, letterSpacing: "0.1em" }}>{skill.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        opacity: 0.35,
                        border: "1px solid rgba(240,240,240,0.15)",
                        padding: "2px 8px",
                      }}
                    >
                      {skill.category}
                    </span>
                    <span style={{ fontSize: 11, opacity: 0.4 }}>{skill.level}%</span>
                  </div>
                </div>
                <div
                  style={{
                    height: 1,
                    background: "rgba(240,240,240,0.08)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: inView ? `${skill.level}%` : "0%",
                      background: "#f0f0f0",
                      transition: `width 1s ${i * 0.07 + 0.3}s cubic-bezier(.22,1,.36,1)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
