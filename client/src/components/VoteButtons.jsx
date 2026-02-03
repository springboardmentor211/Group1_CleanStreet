const VoteButtons = ({
  upvotes = 0,
  downvotes = 0,
  voted = null, // "up" | "down" | null
  onUpvote,
  onDownvote,
  disabled = false,
}) => {
  const handleUpvote = () => {
    if (disabled) return;
    if (typeof onUpvote === "function") onUpvote();
  };

  const handleDownvote = () => {
    if (disabled) return;
    if (typeof onDownvote === "function") onDownvote();
  };

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <button
        onClick={handleUpvote}
        disabled={disabled}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: voted === "up" ? "#22c55e" : "#555",
          fontSize: "1rem",
        }}
      >
        👍 {upvotes}
      </button>

      <button
        onClick={handleDownvote}
        disabled={disabled}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: voted === "down" ? "#ef4444" : "#555",
          fontSize: "1rem",
        }}
      >
        👎 {downvotes}
      </button>
    </div>
  );
};

export default VoteButtons;
