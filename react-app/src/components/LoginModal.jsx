import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, describeError, isAdmin } from "../lib/api";
import { useAuth } from "./AuthContext";

export default function LoginModal({
  open,
  onClose,
  onOpenRegister,
  initialEmail = "",
  notice = "",
}) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const [username, setUsername] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!open) return;
    setUsername(initialEmail);
    if (notice) setStatus(notice);
    document.body.classList.add("overflow-hidden");
    usernameRef.current?.focus();
    return () => document.body.classList.remove("overflow-hidden");
  }, [open, initialEmail, notice]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Logging in...");

    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: username.trim(),
        password,
      });

      login(data.accessToken);
      setStatus("Logged in.");
      onClose();
      navigate(isAdmin() ? "/admin-dashboard" : "/user-dashboard");
    } catch (error) {
      setStatus(`Login failed: ${describeError(error)}`);
    }
  };

  return (
    <section
      id="login"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"
    >
      <div className="mx-auto mt-24 flex w-full max-w-md flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="login-title"
              className="text-2xl font-bold tracking-tight text-slate-900"
            >
              Log in
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your details to view your data.
            </p>
          </div>

          <button
            type="button"
            id="login-close-btn"
            aria-label="Close"
            onClick={onClose}
            className="-mr-2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form id="login-form" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="login-username"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Username
            </label>
            <input
              ref={usernameRef}
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="admin@example.com"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Log in
          </button>
        </form>

        <p id="login-status" className="mt-4 text-sm text-slate-500">
          {status}
        </p>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm">
          <button
            type="button"
            id="admin-fill-btn"
            onClick={() => {
              setUsername("admin@example.com");
              setPassword("password");
              setStatus("Admin credentials filled - press Log in.");
            }}
            className="rounded text-indigo-600 transition hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Use admin demo account
          </button>

          <a
            href="#register"
            onClick={(event) => {
              event.preventDefault();
              onOpenRegister();
            }}
            className="js-open-register rounded text-slate-500 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Create account
          </a>
        </div>
      </div>
    </section>
  );
}
