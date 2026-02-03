import { useEffect, useMemo, useState } from "react";

const CommentSection = ({
  commentCount = 0,
  comments = null, // null => not loaded yet
  loading = false,
  onToggle,
  onSubmit,
  defaultAuthor = "Anonymous",
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const resolvedComments = useMemo(() => (Array.isArray(comments) ? comments : []), [comments]);

  useEffect(() => {
    if (showComments && typeof onToggle === "function") onToggle(true);
    if (!showComments && typeof onToggle === "function") onToggle(false);
  }, [showComments, onToggle]);

  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!content) return;
    if (typeof onSubmit === "function") {
      const ok = await onSubmit({ author: defaultAuthor, content });
      if (ok !== false) setNewComment("");
    }
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setShowComments((v) => !v)}
        style={{
          border: "none",
          background: "transparent",
          color: "#2563eb",
          cursor: "pointer",
          fontSize: "0.9rem",
        }}
      >
        💬 Comments ({commentCount})
      </button>

      {/* Comment Box */}
      {showComments && (
        <div style={{ marginTop: "0.8rem" }}>
          {/* Existing comments */}
          {loading ? (
            <div style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "0.5rem" }}>
              Loading comments...
            </div>
          ) : null}

          {resolvedComments.map((comment) => (
            <div
              key={comment._id || comment.id}
              style={{
                background: "#F9FAFB",
                padding: "0.6rem",
                borderRadius: "8px",
                marginBottom: "0.5rem",
                fontSize: "0.85rem",
              }}
            >
              <strong>{comment.author || comment.user || "User"}</strong>
              <p style={{ margin: "4px 0" }}>{comment.content || comment.text}</p>
              <span style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : comment.time}
              </span>
            </div>
          ))}

          {/* Add comment */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                flex: 1,
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #D1D5DB",
                fontSize: "0.85rem",
              }}
            />
            <button
              onClick={handleAddComment}
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                border: "none",
                background: "#22c55e",
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
