"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  fire: "#e74c3c", water: "#3498db", grass: "#2ecc71",
  electric: "#f1c40f", psychic: "#9b59b6", ice: "#74b9ff",
  dragon: "#6c5ce7", dark: "#2d3436", fairy: "#fd79a8",
  normal: "#636e72", fighting: "#d35400", flying: "#74b9ff",
  poison: "#8e44ad", ground: "#d4ac0d", rock: "#7f8c8d",
  bug: "#27ae60", ghost: "#6c3483", steel: "#95a5a6",
};

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    other: { "official-artwork": { front_default: string | null } };
  };
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  moves: { move: { name: string } }[];
}

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const name = params.name as string;

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;
    async function fetch_() {
      try {
        setLoading(true);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) throw new Error("Pokémon tidak ditemukan");
        setPokemon(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [name]);

  const mainType = pokemon?.types[0]?.type.name ?? "normal";
  const mainColor = TYPE_COLORS[mainType] ?? "#636e72";

  return (
    <main style={{ minHeight: "100vh", padding: "140px 24px 100px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ height: 1, background: "rgba(240,240,240,0.08)", marginBottom: 48 }} />

        <button onClick={() => router.back()}
          style={{ background: "none", border: "none", color: "rgba(240,240,240,0.45)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: 48, transition: "color 0.2s", fontFamily: "inherit", padding: 0 }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#f0f0f0")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(240,240,240,0.45)")}>
          ← Kembali ke Pokédex
        </button>

        {loading && <div style={{ opacity: 0.4, fontSize: 13 }}>Memuat data Pokémon...</div>}

        {error && !loading && (
          <div style={{ textAlign: "center", padding: 80 }}>
            <p style={{ opacity: 0.5, marginBottom: 24 }}>{error}</p>
            <Link href="/pokemon" className="btn-outline">← Kembali ke Pokédex</Link>
          </div>
        )}

        {pokemon && !loading && (
          <div style={{ animation: "fadeUp 0.7s cubic-bezier(.22,1,.36,1) both" }}>

            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 48, alignItems: "center" }}>
              {/* Artwork */}
              <div style={{ textAlign: "center" }}>
                <div style={{ border: `1px solid ${mainColor}33`, padding: 32, display: "inline-block", background: `${mainColor}08` }}>
                  {pokemon.sprites.other["official-artwork"].front_default ? (
                    <img src={pokemon.sprites.other["official-artwork"].front_default} alt={pokemon.name} style={{ width: 200, height: 200, objectFit: "contain" }} />
                  ) : pokemon.sprites.front_default ? (
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: 120, height: 120, imageRendering: "pixelated" }} />
                  ) : (
                    <div style={{ width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3, fontSize: 48 }}>?</div>
                  )}
                </div>
                {/* Sprite kecil */}
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
                  {[pokemon.sprites.front_default, pokemon.sprites.back_default, pokemon.sprites.front_shiny].filter(Boolean).map((src, i) => (
                    <img key={i} src={src!} alt="" style={{ width: 48, height: 48, imageRendering: "pixelated", opacity: 0.6, border: "1px solid rgba(240,240,240,0.1)" }} />
                  ))}
                </div>
              </div>

              {/* Info */}
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", opacity: 0.3, marginBottom: 8 }}>
                  #{String(pokemon.id).padStart(3, "0")}
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.0, marginBottom: 20, textTransform: "capitalize" }}>
                  {pokemon.name}
                </h1>

                {/* Types */}
                <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
                  {pokemon.types.map(({ type }) => (
                    <span key={type.name} style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: "6px 14px", background: `${TYPE_COLORS[type.name] ?? "#636e72"}22`, border: `1px solid ${TYPE_COLORS[type.name] ?? "#636e72"}66`, color: TYPE_COLORS[type.name] ?? "#636e72" }}>
                      {type.name}
                    </span>
                  ))}
                </div>

                {/* Basic stats */}
                {[
                  { label: "Tinggi", value: `${(pokemon.height / 10).toFixed(1)} m` },
                  { label: "Berat", value: `${(pokemon.weight / 10).toFixed(1)} kg` },
                  { label: "Base EXP", value: pokemon.base_experience ?? "—" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(240,240,240,0.06)" }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.35 }}>{item.label}</span>
                    <span style={{ fontSize: 13 }}>{item.value}</span>
                  </div>
                ))}

                {/* Abilities */}
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.35, marginBottom: 10 }}>Abilities</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {pokemon.abilities.map(({ ability, is_hidden }) => (
                      <span key={ability.name} style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "capitalize", border: `1px solid rgba(240,240,240,${is_hidden ? "0.08" : "0.2"})`, padding: "4px 10px", opacity: is_hidden ? 0.4 : 0.8 }}>
                        {ability.name}{is_hidden ? " (hidden)" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Base Stats */}
            <div style={{ border: "1px solid rgba(240,240,240,0.08)", padding: 32, marginBottom: 1, background: "#0a0a0a" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.35, marginBottom: 24 }}>Base Stats</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {pokemon.stats.map((s) => (
                  <div key={s.stat.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.45 }}>{s.stat.name.replace("-", " ")}</span>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{s.base_stat}</span>
                    </div>
                    <div style={{ height: 2, background: "rgba(240,240,240,0.08)", position: "relative" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${Math.min(100, (s.base_stat / 255) * 100)}%`, background: mainColor, transition: "width 1s cubic-bezier(.22,1,.36,1)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Moves */}
            <div style={{ border: "1px solid rgba(240,240,240,0.08)", padding: 32, background: "#0a0a0a", marginBottom: 48 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.35, marginBottom: 20 }}>
                Moves (10 pertama)
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {pokemon.moves.slice(0, 10).map(({ move }) => (
                  <span key={move.name} style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "capitalize", border: "1px solid rgba(240,240,240,0.1)", padding: "4px 10px", opacity: 0.6 }}>
                    {move.name.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <Link href="/pokemon" className="btn-outline">← Kembali ke Pokédex</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
