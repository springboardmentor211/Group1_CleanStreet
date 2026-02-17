import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../utils/apiBase";

function formatCategory(category) {
  if (!category) return "—";
  return String(category).replace(/_/g, " ");
}

function formatStatus(status) {
  if (!status) return "—";
  return String(status).replace(/_/g, " ");
}

function formatLocation(location) {
  if (!location) return "—";
  const address = location.address?.trim?.();
  if (address) return address;
  const lat = location.latitude;
  const lng = location.longitude;
  if (typeof lat === "number" && typeof lng === "number") return `${lat}, ${lng}`;
  return "—";
}

export default function IssueModal({ issue, onClose, onIssueUpdated }) {
  const issueId = issue?._id;

  const [comments, setComments] = useState(null); // null => not loaded yet
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  const defaultAuthor = useMemo(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.name || "Community User";
  }, []);

  const fetchComments = async () => {
    if (!issueId) return;
    try {
      setLoadingComments(true);
      const res = await fetch(`${API_BASE}/api/community/issues/${issueId}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    // reset state when switching issues
    setNewComment("");
    setPosting(false);
    setComments(Array.isArray(issue?.comments) ? issue.comments : null);
  }, [issueId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (comments === null) fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments, issueId]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submitComment = async () => {
    const content = newComment.trim();
    if (!content || !issueId || posting) return;
    try {
      setPosting(true);
      await fetch(`${API_BASE}/api/community/issues/${issueId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: defaultAuthor, content }),
      });
      setNewComment("");
      await fetchComments();
      if (typeof onIssueUpdated === "function") onIssueUpdated();
    } finally {
      setPosting(false);
    }
  };

  const createdAt = issue?.createdAt ? new Date(issue.createdAt).toLocaleString() : "—";

  return (
    <div className="issue-modal-backdrop" onClick={onClose}>
      <div className="issue-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="issue-modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <div
            style={{
              width: "100%",
              height: 320,
              borderRadius: 14,
              overflow: "hidden",
              background: "#e8e8e8",
            }}
          >
            {issue?.photo ? (
              <img
                src={issue.photo}
                alt={issue.title || "Issue image"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#777",
                  fontWeight: 600,
                }}
              >
                No Image
              </div>
            )}
          </div>

          <div>
            <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 800, color: "#2d2d2d" }}>
              {issue?.title || "Untitled Issue"}
            </h2>
            <p style={{ margin: 0, fontSize: 15, color: "#5a5a5a", lineHeight: 1.5 }}>
              {issue?.description || "—"}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              paddingTop: 12,
              borderTop: "1px solid #eee",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280" }}>Category</div>
              <div style={{ fontSize: 14, color: "#2d2d2d" }}>{formatCategory(issue?.category)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280" }}>Status</div>
              <div style={{ fontSize: 14, color: "#2d2d2d" }}>{formatStatus(issue?.status)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280" }}>Location</div>
              <div style={{ fontSize: 14, color: "#2d2d2d" }}>{formatLocation(issue?.location)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280" }}>Created</div>
              <div style={{ fontSize: 14, color: "#2d2d2d" }}>{createdAt}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280" }}>Upvotes</div>
              <div style={{ fontSize: 14, color: "#2d2d2d" }}>{issue?.upvotes || 0}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280" }}>Downvotes</div>
              <div style={{ fontSize: 14, color: "#2d2d2d" }}>{issue?.downvotes || 0}</div>
            </div>
          </div>

          <div style={{ paddingTop: 12, borderTop: "1px solid #eee" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#2d2d2d" }}>
                Comments
              </h3>
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                {Array.isArray(comments) ? comments.length : issue?.commentCount || 0} total
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              {loadingComments ? (
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
                  Loading comments...
                </div>
              ) : null}

              {(Array.isArray(comments) ? comments : []).map((c) => (
                <div
                  key={c._id}
                  style={{
                    background: "#f4f4f4",
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <strong style={{ color: "#2d2d2d" }}>{c.author || "User"}</strong>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                    </span>
                  </div>
                  <div style={{ marginTop: 6, color: "#2d2d2d", lineHeight: 1.45 }}>
                    {c.content}
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", marginTop: 10, gap: 10 }}>
                <input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitComment();
                  }}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ddd",
                  }}
                />
                <button
                  type="button"
                  onClick={submitComment}
                  disabled={posting}
                  style={{
                    padding: "10px 16px",
                    background: posting ? "#7ac57d" : "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    cursor: posting ? "not-allowed" : "pointer",
                    fontWeight: 700,
                  }}
                >
                  {posting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

