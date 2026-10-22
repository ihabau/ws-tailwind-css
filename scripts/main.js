const API_BASE_URL = "http://localhost:8080/api/v1";
const TOKEN_KEY = "accessToken";

const loginOverlay = document.getElementById("login");
const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const registerOverlay = document.getElementById("register");
const registerForm = document.getElementById("register-form");
const registerStatus = document.getElementById("register-status");

const menuBtn = document.getElementById("login-menu-btn");
const menu = document.getElementById("login-menu");

const navAuth = document.getElementById("nav-auth");
const navUser = document.getElementById("nav-user");
const navUsername = document.getElementById("nav-username");
const dashboardLink = document.getElementById("dashboard-link");

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

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

function getSession() {
  const token = getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) {
    clearToken();
    return null;
  }

  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    clearToken();
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

function updateAuthUi() {
  const payload = getSession();
  const loggedIn = Boolean(payload);

  document.querySelectorAll("[data-nav-username]").forEach((el) => {
    el.textContent = loggedIn ? payload.sub || "" : "";
  });

  document.querySelectorAll("[data-nav-login]").forEach((el) => {
    el.classList.toggle("hidden", loggedIn);
  });

  document.querySelectorAll("[data-nav-user]").forEach((el) => {
    el.classList.toggle("hidden", !loggedIn);
  });

  navUsername.textContent = loggedIn ? payload.sub || "" : "";
  navAuth.classList.toggle("lg:hidden", loggedIn);
  navAuth.classList.toggle("lg:block", !loggedIn);
  navUser.classList.toggle("lg:hidden", !loggedIn);
  navUser.classList.toggle("lg:flex", loggedIn);

  dashboardLink.classList.toggle("hidden", !loggedIn);
  if (loggedIn) {
    dashboardLink.href = isAdmin() ? "admin-dashboard.html" : "user-dashboard.html";
  }
}

const openMenu = () => menu.classList.remove("hidden");
const closeMenu = () => menu.classList.add("hidden");

const openLogin = () => {
  closeRegister();
  loginOverlay.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  loginUsername.focus();
};

const closeLogin = () => {
  loginOverlay.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
};

const openRegister = () => {
  closeLogin();
  registerOverlay.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  document.getElementById("register-email").focus();
};

const closeRegister = () => {
  registerOverlay.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
};

menuBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  menu.classList.toggle("hidden");
});

menu.addEventListener("click", closeMenu);

document.addEventListener("click", (event) => {
  if (!menu.contains(event.target) && !menuBtn.contains(event.target))
    closeMenu();
});

const mobileMenuBtn = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");
if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
  });
}

document.getElementById("signin-link").addEventListener("click", (event) => {
  event.preventDefault();
  openLogin();
});

document.querySelectorAll(".js-open-register").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openRegister();
  });
});

document.querySelectorAll(".js-open-login").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openLogin();
  });
});

document
  .getElementById("login-close-btn")
  .addEventListener("click", closeLogin);
document
  .getElementById("register-close-btn")
  .addEventListener("click", closeRegister);

loginOverlay.addEventListener("click", (event) => {
  if (event.target === loginOverlay) closeLogin();
});

registerOverlay.addEventListener("click", (event) => {
  if (event.target === registerOverlay) closeRegister();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLogin();
    closeRegister();
    closeMenu();
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  clearToken();
  updateAuthUi();
});

document.querySelectorAll("[data-nav-logout]").forEach((btn) => {
  btn.addEventListener("click", () => {
    clearToken();
    updateAuthUi();
  });
});

document.getElementById("admin-fill-btn").addEventListener("click", () => {
  loginUsername.value = "admin@example.com";
  loginPassword.value = "password";
  loginStatus.textContent = "Admin credentials filled - press Log in.";
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginStatus.textContent = "Logging in...";

  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: loginUsername.value.trim(),
      password: loginPassword.value,
    });
    //we always get a token weather its a admin or user

    setToken(data.accessToken);
    updateAuthUi();
    loginStatus.textContent = "Logged in.";
    closeLogin();
    window.location.href = isAdmin() ? "admin-dashboard.html" : "user-dashboard.html";
  } catch (error) {
    loginStatus.textContent = `Login failed: ${describeError(error)}`;
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  registerStatus.textContent = "Creating account...";

  const email = document.getElementById("register-email").value.trim();

  try {
    await axios.post(`${API_BASE_URL}/customers`, {
      email,
      firstName: document.getElementById("register-first-name").value.trim(),
      lastName: document.getElementById("register-last-name").value.trim(),
      password: document.getElementById("register-password").value,
    });

    registerForm.reset();
    loginUsername.value = email;
    openLogin();
    loginStatus.textContent =
      "Account created - enter your password and log in.";
  } catch (error) {
    registerStatus.textContent = `Registration failed: ${describeError(error)}`;
  }
});

function describeError(error) {
  const data = error.response && error.response.data;
  const detail = data && (data.message || data.error);
  return detail || error.message;
}

updateAuthUi();
