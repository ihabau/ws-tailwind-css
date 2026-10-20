// Shared auth guard for non-index pages.
// Redirects to index.html when there is no valid session.
// Depends on nothing else; load AFTER axios, BEFORE the page script.

const GUARD_TOKEN_KEY = "accessToken";

function guardDecodeToken(token) {
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

// Returns the token payload, or null (and clears storage) when invalid/expired.
function getSession() {
  const token = localStorage.getItem(GUARD_TOKEN_KEY);
  if (!token) return null;

  const payload = guardDecodeToken(token);
  if (!payload) {
    localStorage.removeItem(GUARD_TOKEN_KEY);
    return null;
  }

  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    localStorage.removeItem(GUARD_TOKEN_KEY);
    return null;
  }

  return payload;
}

function isAdmin() {
  const payload = getSession();
  const roles = (payload && payload.roles) || "";
  return String(roles)
    .split(",")
    .map((role) => role.trim())
    .includes("ROLE_ADMIN");
}

// Call from a page: if there is no session, bounce to the landing page login
// and stop the calling script (throw) so no further requests run.
function requireLogin() {
  const payload = getSession();
  if (!payload) {
    window.location.replace("index.html#login");
    throw new Error("No active session - redirecting to login.");
  }
  return payload;
}

// Admin-only pages: require ROLE_ADMIN, otherwise send back to the user area.
function requireAdmin() {
  const payload = requireLogin();
  if (!isAdmin()) {
    window.location.replace("user-dashboard.html");
    throw new Error("ROLE_ADMIN required - redirecting to dashboard.");
  }
  return payload;
}

// Fill any signed-in name shown in a static navbar and wire a logout button,
// if the current page happens to provide them.
function wireStaticNav() {
  const payload = getSession();
  if (!payload) return;

  const nameEl = document.querySelectorAll("[data-nav-username]");
  nameEl.forEach((el) => {
    el.textContent = payload.sub || "";
  });

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(GUARD_TOKEN_KEY);
      window.location.replace("index.html");
    });
  }
}
