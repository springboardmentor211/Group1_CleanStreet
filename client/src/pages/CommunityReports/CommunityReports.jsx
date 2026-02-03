import { useState } from "react";
import VoteButtons from "../../components/VoteButtons";
import CommentSection from "../../components/CommentSection";
import StatusBadge from "../../components/StatusBadge";

export default function CommunityReports() {
  const [complaints] = useState([
    {
      id: 1,
      title: "Large pothole on Main Street causing traffic delays",
      description:
        "There's a massive pothole on Main Street near the intersection with Oak Avenue.",
      location: "Main Street & Oak Avenue",
      status: "Received",
      time: "1 day ago",
    },
    {
      id: 2,
      title: "Broken streetlight in residential area",
      description:
        "The streetlight at the corner of Pine Street and 2nd Avenue has been out for over a month.",
      location: "Pine Street & 2nd Avenue",
      status: "Received",
      time: "1 day ago",
    },
    {
      id: 3,
      title: "Illegal garbage dump behind shopping center",
      description:
        "Someone has been dumping trash behind the Westfield Shopping Center.",
      location: "Westfield Shopping Center, Back Parking Lot",
      status: "Received",
      time: "1 day ago",
    },
    {
      id: 4,
      title: "Water leak flooding sidewalk on Elm Street",
      description:
        "Water leak flooding the sidewalk for the past 3 days.",
      location: "Elm Street between 5th and 6th Ave",
      status: "Received",
      time: "1 day ago",
    },
  ]);

  return (
    
    <main className="community-reports-container">
    
      {/* Page Header */}
      <div>
        <h1 className="community-reports-title">Community Reports</h1>
        <p className="community-reports-subtitle">
          View and interact with issues reported by the community
        </p>
      </div>

      {/* Filters (UI only) */}
      <div className="community-reports-filters">
        <select>
          <option>All Status</option>
          <option>Received</option>
          <option>In Review</option>
          <option>Resolved</option>
        </select>

        <select>
          <option>All Types</option>
          <option>Garbage</option>
          <option>Pothole</option>
          <option>Water Leakage</option>
          <option>Streetlight</option>
        </select>
      </div>

      {/* Complaints Grid */}
      <div className="community-reports-grid">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="community-report-card">
            {/* Card Header */}
            <div className="community-report-header">
              <h3 className="community-report-title">
                {complaint.title}
              </h3>
              <StatusBadge status={complaint.status} />
            </div>

            {/* Description */}
            <p className="community-report-description">
              {complaint.description}
            </p>

            {/* Meta */}
            <div className="community-report-meta">
              📍 {complaint.location} &nbsp;•&nbsp; ⏱ {complaint.time}
            </div>

            {/* Actions */}
            <div className="community-report-actions">
              <div className="vote-buttons">
                <VoteButtons />
              </div>
              <CommentSection />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
  
}
