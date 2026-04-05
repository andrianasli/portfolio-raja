"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

function useInView(threshold = 0.1): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null!);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonSprite {
  front_default: string | null;
}

interface PokemonBasic {
  id: number;
  name: string;
  sprites: PokemonSprite;
  types: { type: { name: string } }[];
}

const TYPE_COLORS: Record<string, string> = {
  fire: "#e74c3c", water: "#3498db", grass: "#2ecc71",
  electric: "#f1c40f", psychic: "#9b59b6", ice: "#74b9ff",
  dragon: "#6c5ce7", dark: "#2d3436", fairy: "#fd79a8",
  normal: "#636e72", fighting: "#d35400", flying: "#74b9ff",
  poison: "#8e44ad", ground: "#d4ac0d", rock: "#7f8c8d",
  bug: "#27ae60", ghost: "#6c3483", steel: "#95a5a6",
};

export default function PokemonPage() {
  const [ref, inView] = useInView();
  const [pokemonList, setPokemonList] = useState<PokemonBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const LIMIT = 24;

  useEffect(() => {
    async function fetchPokemon() {
      try {
        setLoading(true);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`);
        if (!res.ok) throw new Error("Gagal mengambil data Pokemon");
        const data = await res.json();

        const details: PokemonBasic[] = await Promise.all(
          data.results.map(async (p: PokemonListItem) => {
            const r = await fetch(p.url);
            return r.json();
          })
        );
        setPokemonList(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetchPokemon();
  }, [offset]);

  const filtered = pokemonList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    String(p.id).includes(search)
  );

  return (
    <main style={{ minHeight: "100vh", padding: "140px 24px 100px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ height: 1, background: "rgba(240,240,240,0.08)", marginBottom: 80 }} />

        <div ref={ref} className={`section-reveal ${inView ? "visible" : ""}`}>
          {/* Header */}
          <div style={{ fontSize: 11, letterSpacing: "0.25em", opacity: 0.4, marginBottom: 24, textTransform: "uppercase" }}>
            <span>04</span>
            <span className="divider-line" />
            Pokédex
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 24 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.0 }}>
              Pokémon
              <br />
              <em style={{ fontWeight: 400, opacity: 0.7 }}>Explorer</em>
            </h1>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", opacity: 0.35, textTransform: "uppercase" }}>
              Data via PokéAPI · Publik · Tanpa Auth
            </div>
          </div>

          {/* Search */}
          <div style={{ marginBottom: 40 }}>
            <input
              type="text"
              placeholder="Cari nama atau nomor Pokémon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", maxWidth: 400,
                background: "transparent",
                border: "1px solid rgba(240,240,240,0.2)",
                color: "#f0f0f0",
                padding: "12px 16px",
                fontSize: 12, letterSpacing: "0.08em",
                fontFamily: "'DM Mono', monospace",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(240,240,240,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(240,240,240,0.2)")}
            />
          </div>

          {/* Status */}
          <div style={{ fontSize: 10, letterSpacing: "0.18em", opacity: 0.3, textTransform: "uppercase", marginBottom: 32, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: loading ? "#888" : "#4ade80", animation: loading ? "pulse 1.2s infinite" : "none" }} />
            {loading ? "Memuat data dari PokéAPI..." : error ? `Error: ${error}` : `Menampilkan ${filtered.length} Pokémon`}
          </div>

          {/* Grid */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 1, background: "rgba(240,240,240,0.07)" }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ background: "#0a0a0a", height: 180, animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          )}

          {!loading && !error && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 1, background: "rgba(240,240,240,0.07)" }}>
                {filtered.map((pokemon, i) => (
                  <Link
                    key={pokemon.id}
                    href={`/pokemon/${pokemon.name}`}
                    className="pokemon-card"
                    style={{ opacity: 0, animation: inView ? `fadeUp 0.4s ${i * 0.03}s cubic-bezier(.22,1,.36,1) forwards` : "none" }}
                  >
                    {/* Sprite */}
                    <div style={{ textAlign: "center", marginBottom: 12 }}>
                      {pokemon.sprites.front_default ? (
                        <img
                          src={pokemon.sprites.front_default}
                          alt={pokemon.name}
                          style={{ width: 80, height: 80, imageRendering: "pixelated" }}
                        />
                      ) : (
                        <div style={{ width: 80, height: 80, margin: "0 auto", border: "1px solid rgba(240,240,240,0.1)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3, fontSize: 24 }}>?</div>
                      )}
                    </div>

                    {/* Number */}
                    <div style={{ fontSize: 9, letterSpacing: "0.2em", opacity: 0.3, textAlign: "center", marginBottom: 4 }}>
                      #{String(pokemon.id).padStart(3, "0")}
                    </div>

                    {/* Name */}
                    <div style={{ fontSize: 13, fontFamily: "'Playfair Display', serif", fontWeight: 700, textAlign: "center", marginBottom: 10, textTransform: "capitalize" }}>
                      {pokemon.name}
                    </div>

                    {/* Types */}
                    <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                      {pokemon.types.map(({ type }) => (
                        <span key={type.name} style={{
                          fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase",
                          padding: "2px 8px",
                          background: `${TYPE_COLORS[type.name] ?? "#636e72"}22`,
                          border: `1px solid ${TYPE_COLORS[type.name] ?? "#636e72"}66`,
                          color: TYPE_COLORS[type.name] ?? "#636e72",
                        }}>
                          {type.name}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: 9, letterSpacing: "0.12em", opacity: 0.25, textAlign: "center", marginTop: 12 }}>
                      Lihat detail →
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {!search && (
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 48 }}>
                  <button
                    onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                    disabled={offset === 0}
                    className="btn-outline"
                    style={{ opacity: offset === 0 ? 0.3 : 1, cursor: offset === 0 ? "default" : "pointer" }}
                  >
                    ← Prev
                  </button>
                  <span style={{ fontSize: 11, opacity: 0.4, alignSelf: "center", letterSpacing: "0.1em" }}>
                    #{offset + 1} – #{offset + LIMIT}
                  </span>
                  <button onClick={() => setOffset(offset + LIMIT)} className="btn-outline" style={{ cursor: "pointer" }}>
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
