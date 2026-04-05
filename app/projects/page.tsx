"use client";
import { useRef, useState, useEffect } from "react";
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

// Tipe data dari GitHub API
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
}

interface GitHubUser {
  name: string;
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
}

const GITHUB_USERNAME = "andrianasli";

export default function ProjectsPage() {
  const [ref, inView] = useInView();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        setLoading(true);

        // Fetch profile & repos sekaligus (GitHub API publik, tanpa auth)
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`
          ),
        ]);

        if (!userRes.ok || !reposRes.ok) {
          throw new Error("Gagal mengambil data dari GitHub API");
        }

        const userData: GitHubUser = await userRes.json();
        const reposData: GitHubRepo[] = await reposRes.json();

        setUser(userData);
        // Filter repo fork, tampilkan hanya repo asli
        setRepos(reposData.filter((r) => !r.fork));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
    });
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
        {/* Header */}
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.25em",
            opacity: 0.4,
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          <span>02</span>
          <span className="divider-line" />
          Projects
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 56,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 900,
              lineHeight: 1.0,
            }}
          >
            Karya yang
            <br />
            <em style={{ fontWeight: 400, opacity: 0.7 }}>pernah dibuat</em>
          </h1>

          {/* GitHub stats dari API */}
          {user && (
            <div style={{ display: "flex", gap: 32 }}>
              {[
                { label: "Repos", value: user.public_repos },
                { label: "Followers", value: user.followers },
                { label: "Following", value: user.following },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 28,
                      fontWeight: 700,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      opacity: 0.35,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API source label */}
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            opacity: 0.3,
            textTransform: "uppercase",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: loading ? "#888" : "#4ade80",
              animation: loading ? "pulse 1.2s infinite" : "none",
            }}
          />
          {loading
            ? "Mengambil data dari GitHub API..."
            : error
            ? `Error: ${error}`
            : `Data live dari GitHub API · ${repos.length} repositories`}
        </div>

        {/* Loading state */}
        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 1,
              background: "rgba(240,240,240,0.07)",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#0a0a0a",
                  padding: 32,
                  height: 200,
                  animation: "pulse 1.5s infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div
            style={{
              border: "1px solid rgba(240,240,240,0.1)",
              padding: 48,
              textAlign: "center",
              opacity: 0.5,
            }}
          >
            <p style={{ marginBottom: 16 }}>Tidak bisa memuat data dari GitHub API.</p>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              Lihat di GitHub ↗
            </a>
          </div>
        )}

        {/* Repos grid */}
        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 1,
              background: "rgba(240,240,240,0.07)",
            }}
          >
            {repos.map((repo, i) => (
              <div
                key={repo.id}
                className="project-card"
                style={{
                  opacity: 0,
                  animation: inView
                    ? `fadeUp 0.6s ${i * 0.08}s cubic-bezier(.22,1,.36,1) forwards`
                    : "none",
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      opacity: 0.28,
                      letterSpacing: "0.15em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* GitHub link */}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="icon-link"
                      title="GitHub Repository"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </a>
                    {/* Live demo link jika ada */}
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="icon-link"
                        title="Live Demo"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 22.525H0l12-21.05 12 21.05z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Repo name */}
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 10,
                    wordBreak: "break-word",
                  }}
                >
                  {repo.name.replace(/-/g, " ")}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: 12,
                    lineHeight: 1.75,
                    opacity: 0.45,
                    marginBottom: 24,
                    minHeight: 40,
                  }}
                >
                  {repo.description ?? "Tidak ada deskripsi."}
                </p>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {repo.language && (
                      <span
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          opacity: 0.5,
                          border: "1px solid rgba(240,240,240,0.14)",
                          padding: "3px 8px",
                        }}
                      >
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.12em",
                          opacity: 0.38,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        ★ {repo.stargazers_count}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      opacity: 0.28,
                      textTransform: "uppercase",
                    }}
                  >
                    {formatDate(repo.updated_at)}
                  </span>
                </div>

                {/* Tombol detail */}
                <Link
                  href={`/projects/${repo.name}`}
                  style={{
                    display: "block",
                    marginTop: 20,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(240,240,240,0.4)",
                    textDecoration: "none",
                    borderTop: "1px solid rgba(240,240,240,0.07)",
                    paddingTop: 16,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#f0f0f0")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(240,240,240,0.4)")}
                >
                  Lihat Detail →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Link ke GitHub */}
        {!loading && !error && (
          <div style={{ marginTop: 48, textAlign: "center" }}>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              Lihat Semua di GitHub ↗
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
