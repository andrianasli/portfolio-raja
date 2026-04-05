"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Pokemon", href: "/pokemon" },
  { label: "Anime", href: "/anime" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: scrollY > 40 ? "1px solid rgba(240,240,240,0.08)" : "none",
        background: scrollY > 40 ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrollY > 40 ? "blur(12px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Link href="/" style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", opacity: 0.6, textDecoration: "none", color: "#f0f0f0" }}>
        RAM<span style={{ color: "rgba(240,240,240,0.25)", margin: "0 6px" }}>◆</span>Dev
      </Link>

      <div className="desktop-nav" style={{ display: "flex", gap: 28 }}>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? "active" : ""}`}>
            {link.label}
          </Link>
        ))}
      </div>

      <a href="https://github.com/andrianasli" target="_blank" rel="noreferrer" className="github-link"
        style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(240,240,240,0.5)", textDecoration: "none", transition: "color 0.2s" }}
        onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#f0f0f0")}
        onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(240,240,240,0.5)")}>
        GitHub ↗
      </a>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}
        style={{ background: "none", border: "none", color: "#f0f0f0", fontSize: 20, cursor: "pointer", display: "none", padding: 4, fontFamily: "inherit" }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(10,10,10,0.97)", borderBottom: "1px solid rgba(240,240,240,0.08)", padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <a href="https://github.com/andrianasli" target="_blank" rel="noreferrer" style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(240,240,240,0.5)", textDecoration: "none" }}>
            GitHub ↗
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .github-link { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
