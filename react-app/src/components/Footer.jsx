import { Link } from "react-router-dom";

export function FullFooter() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-white text-slate-500">
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              to="/"
              className="mb-4 inline-block text-xl font-bold text-slate-900"
            >
              Lexicon Telecom AB
            </Link>
            <p className="mb-6 text-sm leading-relaxed">
              Fast fibre, mobile, and TV subscriptions for homes and businesses
              across Sweden.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-lg border border-slate-200 bg-white p-2 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 22v-8h3l1-4h-4V8c0-1 .3-2 2-2h2V2h-3c-3 0-5 2-5 5v3H6v4h3v8z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="rounded-lg border border-slate-200 bg-white p-2 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c2.7 0 3 0 4.1.1 1 0 1.7.2 2.3.5.6.2 1.1.6 1.6 1 .4.5.8 1 1 1.6.3.6.4 1.3.5 2.3.1 1.1.1 1.4.1 4.5s0 3.4-.1 4.5c0 1-.2 1.7-.5 2.3-.2.6-.6 1.1-1 1.6-.5.4-1 .8-1.6 1-.6.3-1.3.4-2.3.5-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.7-.2-2.3-.5-.6-.2-1.1-.6-1.6-1-.4-.5-.8-1-1-1.6-.3-.6-.4-1.3-.5-2.3C2 15.4 2 15.1 2 12s0-3.4.1-4.5c0-1 .2-1.7.5-2.3.2-.6.6-1.1 1-1.6.5-.4 1-.8 1.6-1 .6-.3 1.3-.4 2.3-.5C8.6 2 8.9 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.8-3.2a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="rounded-lg border border-slate-200 bg-white p-2 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5A2.5 2.5 0 112.5 6a2.5 2.5 0 012.48-2.5zM3 8.98h4V21H3zM9 8.98h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.1 1.43-2.1 2.9V21H9z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Services
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Fibre broadband
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Mobile subscriptions
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  TV and streaming
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Business internet
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Router and equipment
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Help centre
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Check coverage
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Track order
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Report an outage
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  About Lexicon Telecom
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-900">
                  Terms of service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 Lexicon Telecom AB. All rights reserved.</p>
          <p>Made in Sweden</p>
        </div>
      </div>
    </footer>
  );
}

export function SimpleFooter({ label = "© 2026 Lexicon Telecom AB." }) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-slate-500 sm:flex-row">
        <p>{label}</p>
        <Link
          to="/"
          className="rounded transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Back to site
        </Link>
      </div>
    </footer>
  );
}
