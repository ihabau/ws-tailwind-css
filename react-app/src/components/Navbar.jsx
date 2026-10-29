import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const NAV_ITEMS = [
  { key: "home", label: "Home", homeHref: "#", href: "/" },
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/user-dashboard",
    authOnly: true,
  },
  { key: "plans", label: "Plans", homeHref: "#plans", href: "/plans" },
  {
    key: "operators",
    label: "Operators",
    homeHref: "#operators",
    href: "/operators",
  },
  {
    key: "subscriptions",
    label: "Subscriptions",
    homeHref: "#subscriptions",
    href: "/subscriptions",
  },
  {
    key: "customers",
    label: "Customers",
    href: "/customers",
    subOnly: true,
  },
  { key: "contact", label: "Contact", homeHref: "#contact", homeOnly: true },
];

const ICON_CHEVRON = (
  <svg
    className="h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const buttonClass =
  "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

const menuClass =
  "absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl";

const menuItemClass =
  "block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";

function pageFromPath(pathname) {
  if (pathname === "/") return "home";
  if (pathname === "/plans") return "plans";
  if (pathname === "/operators") return "operators";
  if (pathname === "/subscriptions") return "subscriptions";
  if (pathname === "/customers") return "customers";
  if (pathname === "/user-dashboard" || pathname === "/admin-dashboard") {
    return "dashboard";
  }
  return "";
}

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const { loggedIn, admin, session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);

  const currentPage = pageFromPath(location.pathname);
  const isHome = currentPage === "home";

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const openLogin = (event) => {
    event.preventDefault();
    setLoginMenuOpen(false);
    setMenuOpen(false);
    if (onOpenLogin) onOpenLogin();
    else navigate("/#login");
  };

  const openRegister = (event) => {
    event.preventDefault();
    setLoginMenuOpen(false);
    setMenuOpen(false);
    if (onOpenRegister) onOpenRegister();
    else navigate("/#register");
  };

  const dashboardHref = admin ? "/admin-dashboard" : "/user-dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="relative mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link
          to={isHome ? "#" : "/"}
          className="rounded text-xl font-bold tracking-tight text-slate-900 transition hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Lexicon Telecom
          <span
            data-nav-role
            className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
              admin
                ? "bg-indigo-100 text-indigo-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {loggedIn ? (admin ? "Admin" : "User") : ""}
          </span>
        </Link>

        <nav
          id="mobile-menu"
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute right-0 top-16 w-56 flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-2 text-sm font-medium text-slate-600 shadow-xl lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          {NAV_ITEMS.filter((item) => {
            if (item.homeOnly && !isHome) return false;
            if (item.subOnly && isHome) return false;
            return true;
          }).map((item) => {
            const href = isHome ? item.homeHref : item.href;
            const active = currentPage === item.key;
            const hidden = item.authOnly && !loggedIn;
            const linkClass = `rounded px-1 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500${
              active ? " text-slate-900" : ""
            }${hidden ? " hidden" : ""}`;

            if (item.key === "dashboard") {
              return (
                <Link
                  key={item.key}
                  id="dashboard-link"
                  data-nav-dashboard
                  to={dashboardHref}
                  className={linkClass}
                >
                  {item.label}
                </Link>
              );
            }

            if (href.startsWith("#")) {
              return (
                <a key={item.key} href={href} className={linkClass}>
                  {item.label}
                </a>
              );
            }

            return (
              <Link key={item.key} to={href} className={linkClass}>
                {item.label}
              </Link>
            );
          })}

          {!loggedIn ? (
            <div
              data-nav-login
              className="flex w-full flex-col items-center border-t border-slate-200 pt-2 lg:hidden"
            >
              {isHome ? (
                <a
                  href="#login"
                  onClick={openLogin}
                  className={`js-open-login block ${buttonClass} w-4/5 text-center`}
                >
                  Log in
                </a>
              ) : (
                <Link
                  to="/#login"
                  className={`block ${buttonClass} w-4/5 text-center`}
                >
                  Log in
                </Link>
              )}
            </div>
          ) : (
            <div
              data-nav-user
              className="flex w-full flex-col items-center gap-2 border-t border-slate-200 pt-2 lg:hidden"
            >
              <p className="px-1 text-xs text-slate-500">
                Signed in as{" "}
                <span
                  data-nav-username
                  className="font-semibold text-slate-900"
                >
                  {session?.sub || ""}
                </span>
              </p>
              <button
                type="button"
                data-nav-logout
                onClick={handleLogout}
                className={`${buttonClass} w-4/5 text-center`}
              >
                Log out
              </button>
            </div>
          )}
        </nav>

        <button
          id="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          className={`${buttonClass} lg:hidden`}
        >
          MENU
        </button>

        {isHome ? (
          loggedIn ? (
            <div
              id="nav-user"
              className="max-lg:hidden items-center gap-3 lg:flex"
            >
              <span className="text-sm text-slate-500">Signed in as</span>
              <span
                id="nav-username"
                className="text-sm font-semibold text-slate-900"
              >
                {session?.sub || ""}
              </span>
              <button
                type="button"
                id="logout-btn"
                onClick={handleLogout}
                className={buttonClass}
              >
                Log out
              </button>
            </div>
          ) : (
            <div id="nav-auth" className="relative max-lg:hidden lg:block">
              <button
                type="button"
                id="login-menu-btn"
                onClick={() => setLoginMenuOpen((open) => !open)}
                className={`flex items-center gap-2 ${buttonClass}`}
              >
                Login
                {ICON_CHEVRON}
              </button>
              <div
                id="login-menu"
                className={`${menuClass} ${loginMenuOpen ? "" : "hidden"}`}
              >
                <a
                  href="#login"
                  id="signin-link"
                  onClick={openLogin}
                  className={menuItemClass}
                >
                  Sign in
                </a>
                <a
                  href="#register"
                  onClick={openRegister}
                  className={`js-open-register ${menuItemClass}`}
                >
                  Create account
                </a>
                <div className="my-2 border-t border-slate-200"></div>
                <a
                  href="/forgot-password"
                  className="block rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Forgot password?
                </a>
              </div>
            </div>
          )
        ) : (
          <button
            type="button"
            data-nav-logout-desktop
            onClick={handleLogout}
            className={`hidden lg:block ${buttonClass}`}
          >
            Log out
          </button>
        )}
      </div>
    </header>
  );
}
