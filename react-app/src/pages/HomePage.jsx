import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FullFooter } from "../components/Footer";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

const planExamples = [0, 1, 2];
const subscriptionExamples = [0, 1, 2];
const operatorExamples = [0, 1, 2];

export default function HomePage() {
  const location = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginNotice, setLoginNotice] = useState("");

  useEffect(() => {
    if (location.hash === "#login") setLoginOpen(true);
    if (location.hash === "#register") setRegisterOpen(true);
  }, [location.hash]);

  const openLogin = () => {
    setLoginNotice("");
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const openRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const handleRegistered = (email) => {
    setLoginEmail(email);
    setLoginNotice("Account created - enter your password and log in.");
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  return (
    <>
      <Navbar onOpenLogin={openLogin} onOpenRegister={openRegister} />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onOpenRegister={openRegister}
        initialEmail={loginEmail}
        notice={loginNotice}
      />

      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onOpenLogin={openLogin}
        onRegistered={handleRegistered}
      />

      <main>
        <section
          id="hero"
          className="bg-gradient-to-br from-white via-indigo-50 to-slate-100"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center md:py-32">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Find best deals here!
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Lexicon Telecom
            </h1>

            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Track plans, operators and customers with a single dashboard. Set
              up in minutes, cancel anytime.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#plans"
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                See current offers
              </a>

              <a
                href="#contact"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Contact me
              </a>
            </div>
          </div>
        </section>

        <section
          id="plans"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Plans
          </h2>
          <p className="mb-10 text-slate-500">
            Example cards - live plans from the API appear here.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {planExamples.map((index) => (
              <article
                key={index}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-400 hover:shadow-md"
              >
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  Example card Starter Plan will get populated with javascript
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-500">
                  Description of the plan!
                </p>
                <div className="mt-auto flex items-end justify-between">
                  <p className="text-3xl font-extrabold text-slate-900">
                    $9
                    <span className="text-base font-medium text-slate-400">
                      /month
                    </span>
                  </p>
                  <a
                    href="#"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    Choose plan
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="subscriptions"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            My subscriptions
          </h2>
          <p id="subscriptions-status" className="mb-10 text-slate-500">
            Log in to see your subscriptions.
          </p>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subscriptionExamples.map((index) => (
              <li
                key={index}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-400 hover:shadow-md"
              >
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  Example card Starter Plan will get populated with javascript
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-500">
                  Description of the plan!
                </p>
                <div className="mt-auto flex items-end justify-between">
                  <p className="text-3xl font-extrabold text-slate-900">
                    $9
                    <span className="text-base font-medium text-slate-400">
                      /month
                    </span>
                  </p>
                  <a
                    href="#"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    Edit plan
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="operators"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Operators
          </h2>
          <p id="operators-status" className="mb-10 text-slate-500">
            Loading operators...
          </p>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {operatorExamples.map((index) => (
              <li
                key={index}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-400 hover:shadow-md"
              >
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  Example operator will get populated with javascript
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-500">
                  Description of the operator!
                </p>
                <div className="mt-auto flex items-end justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    Internet &amp; mobile
                  </p>
                  <a
                    href="#plans"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    View plans
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <FullFooter />
    </>
  );
}
