"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const GITHUB_USERNAME = "andrianasli";

interface RepoDetail {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  topics: string[];
  visibility: string;
  size: number;
  license: { name: string } | null;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export default function RepoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [repo, setRepo] = useState<RepoDetail | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchRepoDetail() {
      try {
        setLoading(true);

        const [repoRes, commitsRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${slug}`),
          fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${slug}/commits?per_page=5`),
        ]);

        if (!repoRes.ok) throw new Error("Repository tidak ditemukan");

        const repoData: RepoDetail = await repoRes.json();
        const commitsData: Commit[] = commitsRes.ok ? await commitsRes.json() : [];

        setRepo(repoData);
        setCommits(commitsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    fetchRepoDetail();
  }, [slug]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatSize = (kb: number) => {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
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
      <div style={{ height: 1, background: "rgba(240,240,240,0.08)", marginBottom: 48 }} />

      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          background: "none",
          border: "none",
          color: "rgba(240,240,240,0.45)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 48,
          transition: "color 0.2s",
          fontFamily: "inherit",
          padding: 0,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#f0f0f0")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(240,240,240,0.45)")}
      >
        ← Kembali ke Projects
      </button>

      {/* Loading */}
      {loading && (
        <div style={{ opacity: 0.4, fontSize: 13, letterSpacing: "0.1em" }}>
          Memuat data dari GitHub API...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ textAlign: "center", padding: 80 }}>
          <p style={{ opacity: 0.5, marginBottom: 24 }}>{error}</p>
          <Link href="/projects" className="btn-outline">
            ← Kembali ke Projects
          </Link>
        </div>
      )}

      {/* Content */}
      {repo && !loading && (
        <div style={{ animation: "fadeUp 0.7s cubic-bezier(.22,1,.36,1) both" }}>

          {/* Header */}
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.25em", opacity: 0.35, marginBottom: 16, textTransform: "uppercase" }}>
              {GITHUB_USERNAME} / repository detail
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                fontWeight: 900,
                lineHeight: 1.0,
                marginBottom: 20,
              }}
            >
              {repo.name.replace(/-/g, " ")}
            </h1>

            {repo.description && (
              <p style={{ fontSize: 15, lineHeight: 1.8, opacity: 0.55, maxWidth: 560, marginBottom: 32 }}>
                {repo.description}
              </p>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="btn-filled"
              >
                Buka di GitHub ↗
              </a>
              {repo.homepage && (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                >
                  Live Demo ↗
                </a>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 1,
              background: "rgba(240,240,240,0.07)",
              marginBottom: 1,
            }}
          >
            {[
              { label: "Stars", value: repo.stargazers_count },
              { label: "Forks", value: repo.forks_count },
              { label: "Watchers", value: repo.watchers_count },
              { label: "Issues", value: repo.open_issues_count },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "#0a0a0a",
                  padding: "28px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 36,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.35 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Info & Commits */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 1,
              background: "rgba(240,240,240,0.07)",
              marginBottom: 48,
            }}
          >
            {/* Repo info */}
            <div style={{ background: "#0a0a0a", padding: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.35, marginBottom: 24 }}>
                Informasi Repository
              </div>
              {[
                { label: "Bahasa", value: repo.language ?? "—" },
                { label: "Visibilitas", value: repo.visibility },
                { label: "Branch utama", value: repo.default_branch },
                { label: "Ukuran", value: formatSize(repo.size) },
                { label: "Lisensi", value: repo.license?.name ?? "—" },
                { label: "Dibuat", value: formatDate(repo.created_at) },
                { label: "Diperbarui", value: formatDate(repo.updated_at) },
                { label: "Terakhir push", value: formatDate(repo.pushed_at) },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(240,240,240,0.06)",
                  }}
                >
                  <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.35 }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: 12, opacity: 0.8 }}>{item.value}</span>
                </div>
              ))}

              {/* Topics */}
              {repo.topics.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.35, marginBottom: 12 }}>
                    Topics
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {repo.topics.map((topic) => (
                      <span
                        key={topic}
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          border: "1px solid rgba(240,240,240,0.18)",
                          padding: "4px 10px",
                          opacity: 0.6,
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Commits */}
            <div style={{ background: "#0a0a0a", padding: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.35, marginBottom: 24 }}>
                5 Commit Terakhir
              </div>

              {commits.length === 0 ? (
                <p style={{ fontSize: 12, opacity: 0.3 }}>Tidak ada commit.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {commits.map((commit) => (
                    <div
                      key={commit.sha}
                      style={{
                        paddingBottom: 20,
                        borderBottom: "1px solid rgba(240,240,240,0.06)",
                      }}
                    >
                      <div style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 8, opacity: 0.8 }}>
                        {commit.commit.message.split("\n")[0]}
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: 10, opacity: 0.35, letterSpacing: "0.08em" }}>
                        <span>{commit.commit.author.name}</span>
                        <span>{formatDate(commit.commit.author.date)}</span>
                        <span style={{ fontFamily: "monospace" }}>{commit.sha.slice(0, 7)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Back link */}
          <div style={{ textAlign: "center" }}>
            <Link href="/projects" className="btn-outline">
              ← Kembali ke Projects
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
