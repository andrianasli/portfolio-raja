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

const GITHUB_USERNAME = "andrianasli";

export default function ContactPage() {
  const [ref, inView] = useInView();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(GITHUB_USERNAME);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <span>03</span>
          <span className="divider-line" />
          Contact
        </div>

        <div style={{ maxWidth: 640 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              marginBottom: 40,
            }}
          >
            Mari
            <br />
            <em style={{ fontWeight: 400, opacity: 0.65 }}>terhubung</em>
          </h1>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.85,
              opacity: 0.5,
              marginBottom: 48,
              maxWidth: 380,
            }}
          >
            Tertarik berkolaborasi atau sekadar ingin berkenalan? Jangan ragu
            untuk menghubungi saya!
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 64 }}>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="btn-filled"
            >
              GitHub ↗
            </a>
            <button className="btn-outline" onClick={handleCopy}>
              {copied ? "Tersalin! ✓" : "Salin Username"}
            </button>
          </div>

          {/* Info tambahan */}
          <div style={{ borderTop: "1px solid rgba(240,240,240,0.07)", paddingTop: 40 }}>
            {[
              { label: "GitHub", value: `@${GITHUB_USERNAME}` },
              { label: "Universitas", value: "UIN Sultan Syarif Kasim Riau" },
              { label: "Status", value: "Open for collaboration" },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(240,240,240,0.06)",
                  opacity: 0,
                  animation: inView
                    ? `fadeUp 0.5s ${i * 0.1 + 0.3}s cubic-bezier(.22,1,.36,1) forwards`
                    : "none",
                }}
              >
                <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.35 }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 13, opacity: 0.75 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
