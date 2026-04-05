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

interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: { jpg: { image_url: string; large_image_url: string } };
  score: number | null;
  episodes: number | null;
  status: string;
  genres: { mal_id: number; name: string }[];
  synopsis: string | null;
  year: number | null;
  type: string | null;
}

// Anime favorit — fetch by MAL ID
const FAVORITE_IDS = [
  { id: 16498, label: "Attack on Titan" },
  { id: 20,    label: "Naruto" },
  { id: 269,   label: "Bleach" },
  { id: 31964, label: "My Hero Academia" },
];

export default function AnimePage() {
  const [ref, inView] = useInView();
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        setLoading(true);
        setError(null);

        const results: Anime[] = [];
        for (const fav of FAVORITE_IDS) {
          const res = await fetch(`https://api.jikan.moe/v4/anime/${fav.id}`);
          if (!res.ok) continue;
          const json = await res.json();
          results.push(json.data);
          // Jikan rate limit: tunggu 350ms antar request
          await new Promise(r => setTimeout(r, 350));
        }
        setAnimeList(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  return (
    <main style={{ minHeight: "100vh", padding: "140px 24px 100px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ height: 1, background: "rgba(240,240,240,0.08)", marginBottom: 80 }} />

        <div ref={ref} className={`section-reveal ${inView ? "visible" : ""}`}>
          {/* Header */}
          <div style={{ fontSize: 11, letterSpacing: "0.25em", opacity: 0.4, marginBottom: 24, textTransform: "uppercase" }}>
            <span>05</span>
            <span className="divider-line" />
            Anime
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 24 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.0 }}>
              Anime
              <br />
              <em style={{ fontWeight: 400, opacity: 0.7 }}>Favoritku</em>
            </h1>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", opacity: 0.35, textTransform: "uppercase", textAlign: "right" }}>
              Data via Jikan API<br />MyAnimeList · Tanpa Auth
            </div>
          </div>

          {/* Status */}
          <div style={{ fontSize: 10, letterSpacing: "0.18em", opacity: 0.3, textTransform: "uppercase", marginBottom: 40, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: loading ? "#888" : "#4ade80", animation: loading ? "pulse 1.2s infinite" : "none" }} />
            {loading ? "Memuat data dari Jikan API..." : error ? `Error: ${error}` : `${animeList.length} anime favorit`}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 1, background: "rgba(240,240,240,0.07)" }}>
              {FAVORITE_IDS.map((_, i) => (
                <div key={i} style={{ background: "#0a0a0a", height: 380, animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ border: "1px solid rgba(240,240,240,0.1)", padding: 48, textAlign: "center", opacity: 0.5 }}>
              <p>{error}</p>
            </div>
          )}

          {/* Anime Grid */}
          {!loading && !error && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 1, background: "rgba(240,240,240,0.07)" }}>
              {animeList.map((anime, i) => (
                <Link
                  key={anime.mal_id}
                  href={`/anime/${anime.mal_id}`}
                  style={{
                    background: "#0a0a0a", display: "block", textDecoration: "none", color: "#f0f0f0",
                    position: "relative", overflow: "hidden",
                    opacity: 0,
                    animation: inView ? `fadeUp 0.5s ${i * 0.1}s cubic-bezier(.22,1,.36,1) forwards` : "none",
                    transition: "transform 0.25s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)")}
                >
                  {/* Cover image */}
                  <div style={{ position: "relative", paddingBottom: "140%", overflow: "hidden" }}>
                    <img
                      src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                      alt={anime.title}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                      onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
                    />
                    {/* Score badge */}
                    {anime.score && (
                      <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(10,10,10,0.88)", border: "1px solid rgba(240,240,240,0.2)", padding: "4px 10px", fontSize: 12, fontWeight: 700, backdropFilter: "blur(4px)" }}>
                        ★ {anime.score.toFixed(1)}
                      </div>
                    )}
                    {/* Type badge */}
                    {anime.type && (
                      <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(10,10,10,0.88)", border: "1px solid rgba(240,240,240,0.15)", padding: "4px 10px", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", backdropFilter: "blur(4px)" }}>
                        {anime.type}
                      </div>
                    )}
                    {/* Favorite label */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(10,10,10,0.9))", padding: "32px 16px 12px", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.6 }}>
                      ♥ Favorit
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "20px 16px" }}>
                    <div style={{ fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>
                      {anime.title_english || anime.title}
                    </div>
                    {anime.title_english && (
                      <div style={{ fontSize: 10, opacity: 0.35, marginBottom: 10 }}>{anime.title}</div>
                    )}

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                      {anime.genres.slice(0, 3).map((g) => (
                        <span key={g.mal_id} style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(240,240,240,0.15)", padding: "2px 6px", opacity: 0.6 }}>
                          {g.name}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, opacity: 0.3 }}>
                      <span>{anime.episodes ? `${anime.episodes} eps` : anime.status}</span>
                      <span>{anime.year ?? "—"}</span>
                    </div>

                    <div style={{ fontSize: 9, letterSpacing: "0.12em", opacity: 0.25, marginTop: 12, borderTop: "1px solid rgba(240,240,240,0.07)", paddingTop: 10 }}>
                      Lihat detail →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
