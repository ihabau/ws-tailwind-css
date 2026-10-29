export const API_BASE_URL = "http://localhost:8080/api/v1";
export const TOKEN_KEY = "accessToken";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const authHeaders = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const describeError = (error) => {
  const data = error.response && error.response.data;
  const detail = data && (data.message || data.error);
  return detail || error.message;
};

function decodeToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function getSession() {
  const token = getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }

  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }

  return payload;
}

export function isAdmin() {
  const payload = getSession();
  const roles = (payload && payload.roles) || "";
  return String(roles)
    .split(",")
    .map((role) => role.trim())
    .includes("ROLE_ADMIN");
}
