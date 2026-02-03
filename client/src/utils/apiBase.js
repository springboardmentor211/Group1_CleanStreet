export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getUserIdForApi() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || user?._id || user?.userId || "";
  } catch {
    return "";
  }
}

