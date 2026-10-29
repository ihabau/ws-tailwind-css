import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { SimpleFooter } from "../components/Footer";
import { useAuth } from "../components/AuthContext";
import { API_BASE_URL, authHeaders } from "../lib/api";

const exampleSubscriptions = [
  {
    id: 1,
    planName: "Fiber 100",
    price: "299 SEK",
    operatorName: "TelNet",
    cancelledAt: null,
  },
  {
    id: 2,
    planName: "Mobile Lite",
    price: "99 SEK",
    operatorName: "MobiLink",
    cancelledAt: "2026-03-14",
  },
];

function SubscriptionRow({ subscription }) {
  const cancelled = Boolean(subscription.cancelledAt);

  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-6 py-4 text-slate-400">{subscription.id}</td>
      <td className="px-6 py-4 font-semibold text-slate-900">
        {subscription.planName}
      </td>
      <td className="px-6 py-4 text-slate-700">{subscription.price}</td>
      <td className="px-6 py-4 text-slate-700">
        {subscription.operatorName ?? "-"}
      </td>
      <td className="px-6 py-4">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            cancelled
              ? "bg-slate-100 text-slate-500"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {cancelled ? "CANCELLED" : "ACTIVE"}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-500">
        {subscription.cancelledAt ?? "-"}
      </td>
    </tr>
  );
}

export default function UserDashboardPage() {
  const { session } = useAuth();
  const [subscriptions, setSubscriptions] = useState(exampleSubscriptions);
  const [subscriptionsError, setSubscriptionsError] = useState(false);
  const [subscriptionsCount, setSubscriptionsCount] = useState(2);
  const [plansCount, setPlansCount] = useState(6);
  const [operatorsCount, setOperatorsCount] = useState(2);
  const [welcomeTitle, setWelcomeTitle] = useState("Welcome back, User");

  useEffect(() => {
    if (session?.sub) {
      setWelcomeTitle(`Welcome back, ${session.sub}`);
    }

    const loadSubscriptions = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/subscriptions`, {
          headers: authHeaders(),
        });
        setSubscriptionsCount(data.length);
        setSubscriptions(data);
        setSubscriptionsError(false);
      } catch {
        setSubscriptionsError(true);
      }
    };

    const loadCounts = async () => {
      try {
        const { data: plans } = await axios.get(
          `${API_BASE_URL}/plans/active`,
          { headers: authHeaders() },
        );
        setPlansCount(plans.length);
      } catch {
        setPlansCount("-");
      }

      try {
        const { data: operators } = await axios.get(
          `${API_BASE_URL}/operators`,
          { headers: authHeaders() },
        );
        setOperatorsCount(operators.length);
      } catch {
        setOperatorsCount("-");
      }
    };

    loadSubscriptions();
    loadCounts();
  }, [session]);

  return (
    <>
      <Navbar />

      <main>
        <section
          id="overview"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h1
            id="welcome-title"
            className="mb-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
          >
            {welcomeTitle}
          </h1>
          <p className="mb-10 text-slate-500">
            Example numbers - the live data is loaded from your account.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                My subscriptions
              </p>
              <p
                id="subscriptions-count"
                className="mt-2 text-3xl font-extrabold text-slate-900"
              >
                {subscriptionsError ? "-" : subscriptionsCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                GET /api/v1/subscriptions
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Available plans
              </p>
              <p
                id="plans-count"
                className="mt-2 text-3xl font-extrabold text-slate-900"
              >
                {plansCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                GET /api/v1/plans/active
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Operators</p>
              <p
                id="operators-count"
                className="mt-2 text-3xl font-extrabold text-slate-900"
              >
                {operatorsCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                GET /api/v1/operators
              </p>
            </div>
          </div>
        </section>

        <section
          id="subscriptions"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            My subscriptions
          </h2>
          <p className="mb-10 text-slate-500">
            Example rows - your active and cancelled subscriptions.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Id</th>
                  <th className="px-6 py-3 font-semibold">Plan</th>
                  <th className="px-6 py-3 font-semibold">Price</th>
                  <th className="px-6 py-3 font-semibold">Operator</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Cancelled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptionsError ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-slate-500">
                      Could not load subscriptions.
                    </td>
                  </tr>
                ) : subscriptions.length ? (
                  subscriptions.map((subscription) => (
                    <SubscriptionRow
                      key={subscription.id}
                      subscription={subscription}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-slate-500">
                      No subscriptions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <SimpleFooter label="© 2026 Lexicon Telecom AB. User view." />
    </>
  );
}
