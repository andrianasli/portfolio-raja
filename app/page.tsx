"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function useInView(threshold = 0.1): [React.RefObject<HTMLDivElement>, boolean] {
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

export default function Home() {
  const [heroRef, heroInView] = useInView(0.1);

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 24px 80px",
        position: "relative",
        zIndex: 1,
        
      }}
    >
      {/* Top-right meta */}
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 48,
          fontSize: 10,
          letterSpacing: "0.2em",
          opacity: 0.28,
          lineHeight: 2.4,
          textAlign: "right",
          textTransform: "uppercase",
        }}
      >
        <div>Mahasiswa</div>
        <div>Teknik Informatika</div>
        <div>React / Next.js</div>
        <div>Mobile Dev</div>
      </div>

      {/* Rotating SVG */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 48,
          width: 96,
          height: 96,
          opacity: 0.22,
        }}
      >
        <svg viewBox="0 0 100 100" className="rotating-text" width="96" height="96">
          <defs>
            <path
              id="circ"
              d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            />
          </defs>
          <text fontSize="8.5" fill="#f0f0f0" letterSpacing="3">
            <textPath href="#circ">DEVELOPER · STUDENT · CREATOR ·</textPath>
          </text>
        </svg>
      </div>

      <div ref={heroRef}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.25em",
            opacity: 0.4,
            marginBottom: 20,
            textTransform: "uppercase",
            animation: heroInView ? "fadeUp 0.7s ease both" : "none",
          }}
        >
          <span>00</span>
          <span className="divider-line" />
          Halo, saya
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(4rem, 10vw, 9rem)",
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            animation: heroInView
              ? "fadeUp 0.9s 0.05s cubic-bezier(.22,1,.36,1) both"
              : "none",
          }}
        >
          Raja Adrian
          <br />
          <em style={{ fontWeight: 400, fontSize: "0.85em", opacity: 0.8 }}>
            Maulana
          </em>
        </h1>

        <div
          style={{
            marginTop: 52,
            display: "flex",
            alignItems: "center",
            gap: 40,
            flexWrap: "wrap",
            animation: heroInView
              ? "fadeUp 0.9s 0.18s cubic-bezier(.22,1,.36,1) both"
              : "none",
          }}
        >
          <p
            style={{
              maxWidth: 400,
              fontSize: 14,
              lineHeight: 1.85,
              opacity: 0.55,
            }}
          >
            Mahasiswa Teknik Informatika yang passionate dalam membangun
            aplikasi mobile dan web yang fungsional &amp; estetis.
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <Link href="/projects" className="btn-filled">
              Lihat Proyek
            </Link>
            <Link href="/contact" className="btn-outline">
              Kontak Saya
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          h1 { font-size: clamp(3rem, 12vw, 5rem) !important; }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 48,
          fontSize: 9,
          letterSpacing: "0.25em",
          opacity: 0.25,
          writingMode: "vertical-rl",
          textTransform: "uppercase",
        }}
      >
        Scroll down
      </div>
    </section>
  );
}
