import { useEffect, useMemo, useState } from "react";
import { API_BASE, getUserIdForApi } from "../../utils/apiBase";

export default function CommunityReports({ onNavigate }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = useMemo(() => getUserIdForApi(), []);
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/community/issues`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIssues(data);
    } catch {
      setError("Failed to load community issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const upvote = async (id) => {
    await fetch(`${API_BASE}/api/community/issues/${id}/upvote`, {
      method: "POST",
      headers: userId ? { "x-user-id": userId } : {},
    });
    fetchIssues();
  };

  const toggleComments = async (id) => {
    setOpenComments((p) => ({ ...p, [id]: !p[id] }));

    if (!comments[id]) {
      const res = await fetch(
        `${API_BASE}/api/community/issues/${id}/comments`,
      );
      const data = await res.json();
      setComments((p) => ({ ...p, [id]: data }));
    }
  };

  const submitComment = async (id) => {
    if (!commentInput[id]?.trim()) return;

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const author = user?.name || "Community User";

    await fetch(`${API_BASE}/api/community/issues/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, content: commentInput[id].trim() }),
    });

    setCommentInput((p) => ({ ...p, [id]: "" }));
    const res = await fetch(`${API_BASE}/api/community/issues/${id}/comments`);
    const data = await res.json();
    setComments((p) => ({ ...p, [id]: data }));
    fetchIssues();
  };

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (error) return <p style={{ padding: 40 }}>{error}</p>;

  return (
    <div className="page-container">
      <div
        className="page-background"
        style={{
          background: "linear-gradient(180deg, #d9ead3 0%, #d9ead3 30%, #d9ead3 100%)",
          minHeight: "100vh",
        }}
      >
        <div className="page-content">
          <header className="page-header">
            <div className="page-logo">
              <div className="page-logo-icon">🛣️</div>
              <span className="page-logo-text">Clean Street</span>
            </div>

            <nav className="page-nav">
              <button
                type="button"
                className="page-nav-link"
                onClick={() => onNavigate && onNavigate("home")}
              >
                Home
              </button>
              <button
                type="button"
                className="page-nav-link"
                onClick={() => onNavigate && onNavigate("my-complaints")}
              >
                My Complaints
              </button>
              <button
                type="button"
                className="page-nav-link active"
                onClick={() => onNavigate && onNavigate("community-reports")}
              >
                Community Issues
              </button>
              <button
                type="button"
                className="page-nav-link"
                onClick={() => onNavigate && onNavigate("profile")}
              >
                Profile
              </button>
            </nav>

            <div className="page-header-actions">
              <button
                type="button"
                className="page-header-logout"
                onClick={() => {
                  localStorage.removeItem("user");
                  if (onNavigate) onNavigate("login");
                }}
              >
                Logout
              </button>
            </div>
          </header>

          <main className="page-main" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#2d2d2d",
                }}
              >
                Track Community Issues
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  color: "#5a5a5a",
                }}
              >
                View reported issues, vote for priorities, and be part of the solution.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                gap: "32px",
                maxWidth: 1280,
                margin: "0 auto",
                textAlign: "left",
              }}
            >
        {issues.map((i) => (
          <div
            key={i._id}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 200,
                background: "#e8e8e8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9e9e9e"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginBottom: 8 }}
              >
                <path d="M3 20h18v-2H3v2z" />
                <path d="M3 20l4-8 4 4 5-10 5 14" />
                <path d="M7 16l2-4 2 2 3-6" />
              </svg>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#555",
                  textAlign: "center",
                  padding: "0 12px",
                }}
              >
                {i.title}
              </span>
            </div>

            <div style={{ padding: 20, flex: 1 }}>
              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#2d2d2d",
                }}
              >
                {i.title}
              </h3>

              <p
                style={{
                  margin: "0 0 18px",
                  fontSize: 15,
                  color: "#5a5a5a",
                  lineHeight: 1.4,
                }}
              >
                {i.description}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  paddingTop: 12,
                  borderTop: "1px solid #eee",
                }}
              >
                <button
                  onClick={() => upvote(i._id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 15,
                    color: "#374151",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 0",
                    fontWeight: 500,
                  }}
                >
                  👍 {i.upvotes || 0}
                </button>
                <button
                  onClick={() => toggleComments(i._id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 15,
                    color: "#374151",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 0",
                    fontWeight: 500,
                  }}
                >
                  💬 {i.commentCount || 0}
                </button>
              </div>

              {openComments[i._id] && (
                <div style={{ marginTop: 16 }}>
                  {(comments[i._id] || []).map((c) => (
                    <div
                      key={c._id}
                      style={{
                        background: "#f4f4f4",
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 8,
                      }}
                    >
                      <strong style={{ fontSize: 14 }}>{c.author}</strong>
                      <div style={{ fontSize: 14, color: "#555", marginTop: 4 }}>
                        {c.content}
                      </div>
                    </div>
                  ))}

                  <div style={{ display: "flex", marginTop: 8, gap: 8 }}>
                    <input
                      placeholder="Write a comment..."
                      value={commentInput[i._id] || ""}
                      onChange={(e) =>
                        setCommentInput((p) => ({
                          ...p,
                          [i._id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitComment(i._id);
                      }}
                      style={{
                        flex: 1,
                        padding: 8,
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        fontSize: 14,
                      }}
                    />
                    <button
                      onClick={() => submitComment(i._id)}
                      style={{
                        padding: "8px 16px",
                        background: "#4caf50",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
