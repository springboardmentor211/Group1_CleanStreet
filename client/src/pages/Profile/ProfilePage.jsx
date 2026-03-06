import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";

export default function ProfilePage({ onNavigate }) {
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    if (!userData) {
      showToast("Please login first", { type: "warning" });
      if (onNavigate) onNavigate("login");
      return;
    }
    setUser(userData);
    setFormData({
      name: userData.name || "",
      phone: userData.phone || "",
    });
    // Load avatar if exists
    if (userData.avatar) {
      setAvatar(userData.avatar);
    }
  }, [onNavigate, showToast]);

  const handleAvatarClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatar(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          avatar: avatar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Failed to update profile", {
          type: "error",
        });
        return;
      }

      // Update localStorage with Cloudinary URL from backend
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setAvatar(data.user.avatar || null);
        setEditMode(false);
        showToast("Profile updated successfully!", { type: "success" });
      }
    } catch (err) {
      showToast("Server error. Please try again.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });
    if (user?.avatar) {
      setAvatar(user.avatar);
    } else {
      setAvatar(null);
    }
    setEditMode(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page-container">
      <div className="profile-page-background">
        <div className="profile-page-content">
          <header className="profile-page-header">
            <div className="profile-page-logo">
              <div className="profile-page-logo-icon">🛣️</div>
              <span className="profile-page-logo-text">Clean Street</span>
            </div>

            <nav className="profile-page-nav">
              <button
                type="button"
                className="profile-page-nav-link"
                onClick={() => onNavigate && onNavigate("home")}
              >
                Home
              </button>
              <button
                type="button"
                className="profile-page-nav-link"
                onClick={() => onNavigate && onNavigate("my-complaints")}
              >
                My Complaints
              </button>
              <button
                type="button"
                className="profile-page-nav-link active"
                onClick={() => onNavigate && onNavigate("profile")}
              >
                Profile
              </button>
            </nav>

            <div className="profile-page-header-actions">
              <button
                type="button"
                className="profile-page-logout"
                onClick={() => {
                  localStorage.removeItem("user");
                  if (onNavigate) onNavigate("login");
                }}
              >
                Logout
              </button>
            </div>
          </header>

          <main className="profile-page-main">
            {/* Profile Header with Avatar */}
            <div className="profile-header-section">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-container">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="profile-avatar-img" />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      <span className="profile-avatar-icon">👤</span>
                    </div>
                  )}
                  <div className="profile-avatar-overlay" onClick={handleAvatarClick}>
                    <span className="profile-avatar-change-text">📷 Change photo</span>
                  </div>
                </div>
              </div>
              <h1 className="profile-header-name">{user.name}</h1>
              <p className="profile-header-role">{user.role || "user"}</p>
            </div>

            {/* Profile Info Display */}
            <div className="profile-info-section">
              <div className="profile-info-header">
                <h2 className="profile-info-title">Profile Information</h2>
                {!editMode && (
                  <button
                    type="button"
                    className="profile-edit-button"
                    onClick={() => setEditMode(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <div className="profile-info-icon">👤</div>
                  <div className="profile-info-content">
                    <div className="profile-info-label">Full Name</div>
                    {editMode ? (
                      <input
                        type="text"
                        className="profile-info-input"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        disabled={loading}
                      />
                    ) : (
                      <div className="profile-info-value">{user.name}</div>
                    )}
                  </div>
                </div>

                <div className="profile-info-item">
                  <div className="profile-info-icon">📧</div>
                  <div className="profile-info-content">
                    <div className="profile-info-label">Email</div>
                    <div className="profile-info-value profile-info-readonly">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="profile-info-item">
                  <div className="profile-info-icon">📱</div>
                  <div className="profile-info-content">
                    <div className="profile-info-label">Phone Number</div>
                    {editMode ? (
                      <input
                        type="tel"
                        className="profile-info-input"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        disabled={loading}
                      />
                    ) : (
                      <div className="profile-info-value">{user.phone}</div>
                    )}
                  </div>
                </div>

                <div className="profile-info-item">
                  <div className="profile-info-icon">🎭</div>
                  <div className="profile-info-content">
                    <div className="profile-info-label">Role</div>
                    <div className="profile-info-value profile-info-readonly">
                      {user.role || "user"}
                    </div>
                  </div>
                </div>
              </div>

              {editMode && (
                <div className="profile-edit-actions">
                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="profile-save-button"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
