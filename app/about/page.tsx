"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

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

const FACTS = [
  { label: "Universitas", value: "UIN Sultan Syarif Kasim Riau" },
  { label: "Jurusan", value: "Teknik Informatika" },
  { label: "Semester", value: "4" },
  { label: "Fokus", value: "Mobile & Web Development" },
  { label: "Lokasi", value: "Riau, Indonesia" },
];

export default function AboutPage() {
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
          <span>00</span>
          <span className="divider-line" />
          About Me
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
                marginBottom: 40,
              }}
            >
              Tentang
              <br />
              <em style={{ fontWeight: 400, opacity: 0.7 }}>Saya</em>
            </h1>

            <p style={{ fontSize: 14, lineHeight: 1.9, opacity: 0.6, marginBottom: 24, maxWidth: 420 }}>
              Saya adalah mahasiswa Teknik Informatika semester 4 yang passionate
              dalam dunia pengembangan software, khususnya di bidang mobile dan web.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.9, opacity: 0.6, marginBottom: 40, maxWidth: 420 }}>
              Saya senang membangun aplikasi yang tidak hanya fungsional, tetapi
              juga memiliki tampilan yang estetis dan pengalaman pengguna yang baik.
            </p>

            <Link href="/projects" className="btn-filled">
              Lihat Proyek Saya
            </Link>
          </div>

          {/* Right — facts */}
          <div>
            {FACTS.map((fact, i) => (
              <div
                key={fact.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 0",
                  borderBottom: "1px solid rgba(240,240,240,0.07)",
                  opacity: 0,
                  animation: inView
                    ? `fadeUp 0.5s ${i * 0.08 + 0.2}s cubic-bezier(.22,1,.36,1) forwards`
                    : "none",
                }}
              >
                <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.35 }}>
                  {fact.label}
                </span>
                <span style={{ fontSize: 13, letterSpacing: "0.05em", opacity: 0.85 }}>
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
