import { useEffect, useMemo, useState } from "react";
import VoteButtons from "../../components/VoteButtons";
import CommentSection from "../../components/CommentSection";
import StatusBadge from "../../components/StatusBadge";
import { API_BASE, getUserIdForApi } from "../../utils/apiBase";

export default function CommunityReports() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentState, setCommentState] = useState({});
  const [voteState, setVoteState] = useState({});

  const userId = useMemo(() => getUserIdForApi(), []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/community/issues`, {
        headers: userId ? { "x-user-id": userId } : {},
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load community issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleVote = async (id, type) => {
    const res = await fetch(`${API_BASE}/api/community/issues/${id}/${type}`, {
      method: "POST",
      headers: userId ? { "x-user-id": userId } : {},
    });
    const data = await res.json();
    if (data?.issue?._id) {
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === data.issue._id ? { ...c, ...data.issue } : c,
        ),
      );
      setVoteState((prev) => ({ ...prev, [id]: data.userVote }));
    }
  };

  const loadComments = async (id) => {
    const res = await fetch(`${API_BASE}/api/community/issues/${id}/comments`);
    const data = await res.json();
    setCommentState((p) => ({
      ...p,
      [id]: { comments: data, loading: false },
    }));
  };

  const submitComment = async (id, payload) => {
    await fetch(`${API_BASE}/api/community/issues/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await loadComments(id);
    fetchIssues();
    return true;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main className="community-reports-container">
      {complaints.map((c) => (
        <div key={c._id} className="community-report-card">
          <h3>{c.title}</h3>
          <StatusBadge status={c.status} />
          <p>{c.description}</p>
          <div>
            <VoteButtons
              upvotes={c.upvotes || 0}
              downvotes={c.downvotes || 0}
              voted={voteState[c._id] || null}
              onUpvote={() => handleVote(c._id, "upvote")}
              onDownvote={() => handleVote(c._id, "downvote")}
            />
            <CommentSection
              commentCount={c.commentCount || 0}
              comments={commentState[c._id]?.comments ?? null}
              loading={commentState[c._id]?.loading || false}
              onToggle={(open) => open && loadComments(c._id)}
              onSubmit={(p) => submitComment(c._id, p)}
              defaultAuthor="Community User"
            />
          </div>
        </div>
      ))}
    </main>
  );
}
