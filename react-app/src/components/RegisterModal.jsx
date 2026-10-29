import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_BASE_URL, describeError } from "../lib/api";

export default function RegisterModal({ open, onClose, onOpenLogin, onRegistered }) {
  const emailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("overflow-hidden");
    emailRef.current?.focus();
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Creating account...");

    try {
      await axios.post(`${API_BASE_URL}/customers`, {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
      });

      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setStatus("");
      onRegistered(email.trim());
    } catch (error) {
      setStatus(`Registration failed: ${describeError(error)}`);
    }
  };

  return (
    <section
      id="register"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"
    >
      <div className="mx-auto mt-24 flex w-full max-w-md flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="register-title"
              className="text-2xl font-bold tracking-tight text-slate-900"
            >
              Create account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Sign up to manage your subscriptions.
            </p>
          </div>

          <button
            type="button"
            id="register-close-btn"
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

        <form id="register-form" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="register-email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              ref={emailRef}
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="register-first-name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                First name
              </label>
              <input
                id="register-first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                placeholder="Jane"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="register-last-name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Last name
              </label>
              <input
                id="register-last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                placeholder="Doe"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength="8"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Create account
          </button>
        </form>

        <p id="register-status" className="mt-4 text-sm text-slate-500">
          {status}
        </p>

        <div className="mt-4 border-t border-slate-200 pt-4 text-sm">
          <a
            href="#login"
            onClick={(event) => {
              event.preventDefault();
              onOpenLogin();
            }}
            className="js-open-login rounded text-indigo-600 transition hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Already have an account? Log in
          </a>
        </div>
      </div>
    </section>
  );
}
