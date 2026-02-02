import { useState } from "react";

const CommentSection = () => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      {
        id: Date.now(),
        text: newComment,
        user: "Demo User",
        time: "Just now",
      },
    ]);

    setNewComment("");
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setShowComments(!showComments)}
        style={{
          border: "none",
          background: "transparent",
          color: "#2563eb",
          cursor: "pointer",
          fontSize: "0.9rem",
        }}
      >
        💬 Comments ({comments.length})
      </button>

      {/* Comment Box */}
      {showComments && (
        <div style={{ marginTop: "0.8rem" }}>
          {/* Existing comments */}
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: "#F9FAFB",
                padding: "0.6rem",
                borderRadius: "8px",
                marginBottom: "0.5rem",
                fontSize: "0.85rem",
              }}
            >
              <strong>{comment.user}</strong>
              <p style={{ margin: "4px 0" }}>{comment.text}</p>
              <span style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                {comment.time}
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
