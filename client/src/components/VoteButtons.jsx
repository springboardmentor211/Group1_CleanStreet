import { useState } from "react";

const VoteButtons = () => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [voted, setVoted] = useState(null); // "up" | "down" | null

  const handleUpvote = () => {
    if (voted === "up") return;
    if (voted === "down") setDownvotes((prev) => prev - 1);

    setUpvotes((prev) => prev + 1);
    setVoted("up");
  };

  const handleDownvote = () => {
    if (voted === "down") return;
    if (voted === "up") setUpvotes((prev) => prev - 1);

    setDownvotes((prev) => prev + 1);
    setVoted("down");
  };

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <button
        onClick={handleUpvote}
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
