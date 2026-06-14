export const API_BASE =
  import.meta.env.VITE_API_URL || "https://clean-street-backend-8hgi.onrender.com";

export function getUserIdForApi() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || user?._id || user?.userId || "";
  } catch {
    return "";
  }
}

