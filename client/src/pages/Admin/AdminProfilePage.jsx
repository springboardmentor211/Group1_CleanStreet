import { useEffect, useRef, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { API_BASE } from "../../utils/apiBase";
import "./AdminDashboard.css";
import "./AdminProfile.css";
import cleanStreetLogo from "../../assets/illustrations/13300e7a-6ca5-4b88-b861-9bd2d84036eb 5.png";
import adminShieldIcon from "../../assets/illustrations/User Shield.jpg";
import surveyIcon from "../../assets/illustrations/Survey.png";
import usersMenuIcon from "../../assets/illustrations/Users.png";
import complaintsMenuIcon from "../../assets/illustrations/Edit Property.png";

const FALLBACK_ADMIN = {
  id: "",
  name: "Admin",
  email: "",
  phone: "",
  role: "admin",
  avatar: "",
};

const getAdminId = (user) => user?.id || user?._id || user?.userId || "";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "A";

const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }
  return parsed.toLocaleDateString();
};

async function readApiPayload(response) {
  const raw = await response.text();

  if (!raw) {
    return { payload: {}, raw };
  }

  try {
    return { payload: JSON.parse(raw), raw };
  } catch {
    return { payload: {}, raw };
  }
}

export default function AdminProfilePage({ onNavigate }) {
  const { showToast } = useToast();
  const [admin, setAdmin] = useState(FALLBACK_ADMIN);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const loadAdminProfile = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("user") || "null");

        if (!stored || !getAdminId(stored)) {
          showToast("Please login as admin first.", { type: "warning" });
          if (onNavigate) onNavigate("login");
          return;
        }

        if (stored.role && stored.role !== "admin") {
          showToast("Admin access is required.", { type: "error" });
          if (onNavigate) onNavigate("login");
          return;
        }

        setAdmin((prev) => ({ ...prev, ...stored, role: "admin" }));
        const adminId = getAdminId(stored);

        const response = await fetch(`${API_BASE}/api/admin/profile/${adminId}`);
        const { payload, raw } = await readApiPayload(response);

        if (!response.ok) {
          if (
            response.status === 404 &&
            raw.includes("Cannot GET /api/admin/profile/")
          ) {
            throw new Error(
              "Admin profile API route is not loaded on backend (stale server instance).",
            );
          }
          throw new Error(payload?.message || "Failed to load admin profile");
        }

        if (!isCancelled && payload?.admin) {
          setAdmin(payload.admin);
          localStorage.setItem("user", JSON.stringify(payload.admin));
        }
      } catch (error) {
        console.error("Admin profile fetch failed:", error);
        if (!isCancelled) {
          showToast("Failed to load admin profile.", { type: "error" });
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadAdminProfile();

    return () => {
      isCancelled = true;
    };
  }, [onNavigate, showToast]);

  const navigateToDashboardTab = (tab) => {
    sessionStorage.setItem("adminActiveTab", tab);
    if (onNavigate) onNavigate("admin-dashboard");
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      showToast("Please choose a valid image file.", { type: "warning" });
      return;
    }

    const adminId = getAdminId(admin);
    if (!adminId) {
      showToast("Invalid admin session. Please login again.", { type: "error" });
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      setUploadingPhoto(true);
      try {
        const response = await fetch(
          `${API_BASE}/api/admin/profile/${adminId}/photo`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ photo: reader.result }),
          },
        );

        const { payload, raw } = await readApiPayload(response);
        if (!response.ok) {
          if (
            response.status === 404 &&
            raw.includes("Cannot PATCH /api/admin/profile/")
          ) {
            throw new Error(
              "Admin profile photo API route is not loaded on backend (stale server instance).",
            );
          }
          throw new Error(payload?.message || "Photo upload failed");
        }

        if (payload?.admin) {
          setAdmin(payload.admin);
          localStorage.setItem("user", JSON.stringify(payload.admin));
          showToast("Profile photo updated successfully.", { type: "success" });
        }
      } catch (error) {
        console.error("Admin profile photo upload failed:", error?.message || error);
        showToast(error?.message || "Failed to update profile photo.", {
          type: "error",
        });
      } finally {
        setUploadingPhoto(false);
      }
    };

    reader.onerror = () => {
      showToast("Unable to read the selected file.", { type: "error" });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="admin-dashboard-container admin-profile-page">
      <div className="admin-background">
        <div className="admin-content">
          <div className="admin-title-row">
            <h1 className="admin-title">Admin Dashboard</h1>
            <div className="admin-auth-switch">
              <button
                type="button"
                className="admin-switch-btn"
                onClick={() => onNavigate && onNavigate("login")}
              >
                Log In
              </button>
              <button
                type="button"
                className="admin-switch-btn active"
                onClick={() => onNavigate && onNavigate("signup")}
              >
                Sign Up
              </button>
            </div>
          </div>

          <header className="admin-header">
            <div className="admin-logo">
              <img
                src={cleanStreetLogo}
                alt="CleanStreet"
                className="admin-logo-mark"
              />
              <span className="admin-logo-text">CLEAN STREET</span>
            </div>

            <div className="admin-header-actions">
              <button
                type="button"
                className="admin-logout"
                onClick={() => {
                  localStorage.removeItem("user");
                  if (onNavigate) onNavigate("login");
                }}
              >
                Logout
              </button>
            </div>
          </header>

          <main className="admin-main">
            <aside className="admin-sidebar">
              <div className="admin-panel-heading">
                <img
                  src={adminShieldIcon}
                  alt="Admin panel"
                  className="admin-panel-icon"
                />
                <div className="admin-panel-title">Admin panel</div>
              </div>

              <div className="admin-menu">
                <button
                  className="admin-menu-item"
                  onClick={() => navigateToDashboardTab("overview")}
                >
                  <img src={surveyIcon} alt="" className="admin-menu-icon" />
                  <span className="admin-menu-item-label">Overview</span>
                </button>

                <button
                  className="admin-menu-item"
                  onClick={() => navigateToDashboardTab("users")}
                >
                  <img src={usersMenuIcon} alt="" className="admin-menu-icon" />
                  <span className="admin-menu-item-label">Users</span>
                </button>

                <button
                  className="admin-menu-item"
                  onClick={() => navigateToDashboardTab("manage")}
                >
                  <img
                    src={complaintsMenuIcon}
                    alt=""
                    className="admin-menu-icon"
                  />
                  <span className="admin-menu-item-label">Manage Complaints</span>
                </button>

                <button className="admin-menu-item active">
                  <img
                    src={adminShieldIcon}
                    alt=""
                    className="admin-menu-icon"
                  />
                  <span className="admin-menu-item-label">Profile</span>
                </button>
              </div>
            </aside>

            <section className="admin-content-area">
              <div className="admin-section admin-profile-section">
                <h2 className="admin-section-title">Admin Profile</h2>

                <div className="admin-profile-card">
                  <div className="admin-profile-photo-row">
                    <div className="admin-profile-avatar">
                      {admin.avatar ? (
                        <img src={admin.avatar} alt={admin.name} />
                      ) : (
                        <span>{getInitials(admin.name)}</span>
                      )}
                    </div>

                    <div className="admin-profile-photo-actions">
                      <button
                        type="button"
                        className="admin-profile-upload-btn"
                        onClick={handleChoosePhoto}
                        disabled={uploadingPhoto || loading}
                      >
                        {uploadingPhoto ? "Uploading..." : "Upload Profile Photo"}
                      </button>
                      <p className="admin-profile-upload-hint">
                        JPG, PNG, or WEBP image recommended.
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="admin-profile-file-input"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          handlePhotoUpload(file);
                        }
                        event.target.value = "";
                      }}
                    />
                  </div>

                  <div className="admin-profile-info-grid">
                    <div className="admin-profile-info-item">
                      <div className="admin-profile-info-label">Name</div>
                      <div className="admin-profile-info-value">{admin.name || "N/A"}</div>
                    </div>
                    <div className="admin-profile-info-item">
                      <div className="admin-profile-info-label">Email</div>
                      <div className="admin-profile-info-value">
                        {admin.email || "N/A"}
                      </div>
                    </div>
                    <div className="admin-profile-info-item">
                      <div className="admin-profile-info-label">Phone</div>
                      <div className="admin-profile-info-value">
                        {admin.phone || "N/A"}
                      </div>
                    </div>
                    <div className="admin-profile-info-item">
                      <div className="admin-profile-info-label">Role</div>
                      <div className="admin-profile-info-value">
                        {(admin.role || "admin").toUpperCase()}
                      </div>
                    </div>
                    <div className="admin-profile-info-item">
                      <div className="admin-profile-info-label">Joined</div>
                      <div className="admin-profile-info-value">
                        {formatDate(admin.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
