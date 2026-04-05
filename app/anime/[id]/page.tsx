"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface AnimeDetail {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: { jpg: { large_image_url: string; image_url: string } };
  trailer: { url: string | null };
  type: string | null;
  episodes: number | null;
  status: string;
  aired: { string: string };
  duration: string;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  studios: { name: string }[];
  genres: { name: string }[];
  themes: { name: string }[];
  demographics: { name: string }[];
}

interface Character {
  character: { mal_id: number; name: string; images: { jpg: { image_url: string } } };
  role: string;
}

export default function AnimeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchDetail() {
      try {
        setLoading(true);
        // Jikan rate limit — fetch satu per satu
        const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
        if (!res.ok) throw new Error("Anime tidak ditemukan");
        const json = await res.json();
        setAnime(json.data);

        // Delay sedikit sebelum fetch characters (rate limit)
        await new Promise(r => setTimeout(r, 400));
        const charRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
        if (charRes.ok) {
          const charJson = await charRes.json();
          setCharacters((charJson.data ?? []).slice(0, 8));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const formatNumber = (n: number) => n?.toLocaleString("id-ID") ?? "—";

  return (
    <main style={{ minHeight: "100vh", padding: "140px 24px 100px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ height: 1, background: "rgba(240,240,240,0.08)", marginBottom: 48 }} />

        <button onClick={() => router.back()}
          style={{ background: "none", border: "none", color: "rgba(240,240,240,0.45)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: 48, fontFamily: "inherit", padding: 0, transition: "color 0.2s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#f0f0f0")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(240,240,240,0.45)")}>
          ← Kembali ke Anime
        </button>

        {loading && <div style={{ opacity: 0.4, fontSize: 13, letterSpacing: "0.1em" }}>Memuat data dari Jikan API...</div>}

        {error && !loading && (
          <div style={{ textAlign: "center", padding: 80 }}>
            <p style={{ opacity: 0.5, marginBottom: 24 }}>{error}</p>
            <Link href="/anime" className="btn-outline">← Kembali ke Anime</Link>
          </div>
        )}

        {anime && !loading && (
          <div style={{ animation: "fadeUp 0.7s cubic-bezier(.22,1,.36,1) both" }}>

            {/* Hero */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 48, marginBottom: 48, alignItems: "start" }}>
              {/* Poster */}
              <div>
                <img
                  src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                  alt={anime.title}
                  style={{ width: "100%", maxWidth: 280, display: "block", border: "1px solid rgba(240,240,240,0.1)" }}
                />
              </div>

              {/* Info */}
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.3, marginBottom: 8, textTransform: "uppercase" }}>
                  #{anime.mal_id} · {anime.type ?? "Anime"}
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>
                  {anime.title_english || anime.title}
                </h1>
                {anime.title_japanese && (
                  <div style={{ fontSize: 12, opacity: 0.35, marginBottom: 20 }}>{anime.title_japanese}</div>
                )}

                {/* Score */}
                {anime.score && (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 24 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, lineHeight: 1 }}>
                      {anime.score.toFixed(1)}
                    </span>
                    <span style={{ fontSize: 11, opacity: 0.4 }}>/ 10 · {formatNumber(anime.scored_by ?? 0)} votes</span>
                  </div>
                )}

                {/* Genres */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                  {[...anime.genres, ...anime.themes, ...anime.demographics].map((g) => (
                    <span key={g.name} style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", border: "1px solid rgba(240,240,240,0.2)", padding: "4px 10px", opacity: 0.7 }}>
                      {g.name}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                {[
                  { label: "Status", value: anime.status },
                  { label: "Episode", value: anime.episodes ? `${anime.episodes} eps` : "—" },
                  { label: "Durasi", value: anime.duration },
                  { label: "Ditayangkan", value: anime.aired?.string ?? "—" },
                  { label: "Season", value: anime.season && anime.year ? `${anime.season} ${anime.year}` : anime.year ? String(anime.year) : "—" },
                  { label: "Studio", value: anime.studios.map(s => s.name).join(", ") || "—" },
                  { label: "Rating", value: anime.rating ?? "—" },
                  { label: "Rank", value: anime.rank ? `#${anime.rank}` : "—" },
                  { label: "Popularitas", value: anime.popularity ? `#${anime.popularity}` : "—" },
                  { label: "Members", value: formatNumber(anime.members) },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(240,240,240,0.06)" }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.35 }}>{item.label}</span>
                    <span style={{ fontSize: 12, opacity: 0.8, textAlign: "right", maxWidth: "60%" }}>{item.value}</span>
                  </div>
                ))}

                {/* Trailer */}
                {anime.trailer?.url && (
                  <a href={anime.trailer.url} target="_blank" rel="noreferrer" className="btn-outline" style={{ marginTop: 24, display: "inline-block" }}>
                    Tonton Trailer ↗
                  </a>
                )}
              </div>
            </div>

            {/* Synopsis */}
            {anime.synopsis && (
              <div style={{ border: "1px solid rgba(240,240,240,0.08)", padding: 32, background: "#0a0a0a", marginBottom: 1 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.35, marginBottom: 20 }}>Sinopsis</div>
                <p style={{ fontSize: 13, lineHeight: 1.9, opacity: 0.65 }}>{anime.synopsis}</p>
              </div>
            )}

            {/* Characters */}
            {characters.length > 0 && (
              <div style={{ border: "1px solid rgba(240,240,240,0.08)", padding: 32, background: "#0a0a0a", marginBottom: 48 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.35, marginBottom: 24 }}>
                  Karakter Utama
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 16 }}>
                  {characters.map(({ character, role }) => (
                    <div key={character.mal_id} style={{ textAlign: "center" }}>
                      <img
                        src={character.images.jpg.image_url}
                        alt={character.name}
                        style={{ width: "100%", aspectRatio: "1", objectFit: "cover", border: "1px solid rgba(240,240,240,0.08)", marginBottom: 8 }}
                      />
                      <div style={{ fontSize: 10, lineHeight: 1.3, opacity: 0.75 }}>{character.name}</div>
                      <div style={{ fontSize: 9, opacity: 0.3, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ textAlign: "center" }}>
              <Link href="/anime" className="btn-outline">← Kembali ke Anime</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
