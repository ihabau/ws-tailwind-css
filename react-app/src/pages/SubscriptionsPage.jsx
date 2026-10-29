import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { SimpleFooter } from "../components/Footer";
import { API_BASE_URL, authHeaders, describeError } from "../lib/api";

const exampleSubscriptions = [
  {
    id: 1,
    planName: "Fiber 100",
    price: 299,
    operatorName: "TelNet",
    serviceType: "INTERNET",
    createdAt: "2026-03-01",
    cancelledAt: null,
  },
  {
    id: 2,
    planName: "Mobile Lite",
    price: 99,
    operatorName: "MobiLink",
    serviceType: "MOBILE",
    createdAt: "2026-02-11",
    cancelledAt: "2026-03-14",
  },
];

function SubscriptionRow({ subscription, cancelling, onCancel }) {
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
      <td className="px-6 py-4 text-slate-700">
        {subscription.serviceType ?? "-"}
      </td>
      <td className="px-6 py-4 text-slate-500">
        {subscription.createdAt ?? "-"}
      </td>
      <td className="px-6 py-4 text-slate-500">
        {subscription.cancelledAt ?? "-"}
      </td>
      <td className="px-6 py-4">
        {cancelled ? (
          <span className="text-xs text-slate-400">-</span>
        ) : (
          <>
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Change plan
            </button>
            <button
              type="button"
              disabled={cancelling}
              onClick={() => onCancel(subscription.id)}
              className="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Cancel
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState(exampleSubscriptions);
  const [status, setStatus] = useState("");
  const [subscribePlanId, setSubscribePlanId] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");
  const [changeId, setChangeId] = useState("");
  const [changePlanId, setChangePlanId] = useState("");
  const [changeStatus, setChangeStatus] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const loadSubscriptions = async () => {
    setStatus("Loading subscriptions...");
    try {
      const { data } = await axios.get(`${API_BASE_URL}/subscriptions`, {
        headers: authHeaders(),
      });
      setSubscriptions(data);
      setStatus(`${data.length} subscription(s)`);
    } catch (error) {
      setStatus(`Could not load subscriptions: ${describeError(error)}`);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    const planId = Number(subscribePlanId);

    setSubscribeStatus("Subscribing...");
    try {
      await axios.post(
        `${API_BASE_URL}/subscriptions`,
        { planId },
        { headers: authHeaders() },
      );
      setSubscribeStatus(`Subscribed to plan #${planId}.`);
      setSubscribePlanId("");
      loadSubscriptions();
    } catch (error) {
      setSubscribeStatus(`Could not subscribe: ${describeError(error)}`);
    }
  };

  const handleChange = async (event) => {
    event.preventDefault();
    const id = changeId;
    const planId = Number(changePlanId);

    setChangeStatus("Changing plan...");
    try {
      await axios.put(
        `${API_BASE_URL}/subscriptions/${id}`,
        { planId },
        { headers: authHeaders() },
      );
      setChangeStatus(`Subscription #${id} changed to plan #${planId}.`);
      setChangeId("");
      setChangePlanId("");
      loadSubscriptions();
    } catch (error) {
      setChangeStatus(`Could not change plan: ${describeError(error)}`);
    }
  };

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await axios.post(
        `${API_BASE_URL}/subscriptions/${id}/cancel`,
        null,
        { headers: authHeaders() },
      );
      loadSubscriptions();
    } catch (error) {
      setStatus(`Could not cancel: ${describeError(error)}`);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <section
          id="my-subscriptions"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Subscriptions
          </h1>
          <p className="mb-10 text-slate-500">
            Example rows - live data and actions are wired in
            subscriptions.js.
          </p>

          <p id="subscriptions-status" className="mb-6 text-sm text-slate-500">
            {status}
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Id</th>
                  <th className="px-6 py-3 font-semibold">Plan</th>
                  <th className="px-6 py-3 font-semibold">Price</th>
                  <th className="px-6 py-3 font-semibold">Operator</th>
                  <th className="px-6 py-3 font-semibold">Service type</th>
                  <th className="px-6 py-3 font-semibold">Created</th>
                  <th className="px-6 py-3 font-semibold">Cancelled</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.length ? (
                  subscriptions.map((subscription) => (
                    <SubscriptionRow
                      key={subscription.id}
                      subscription={subscription}
                      cancelling={cancellingId === subscription.id}
                      onCancel={handleCancel}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-slate-500">
                      No subscriptions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section
          id="subscription-forms"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Subscribe or change plan
          </h2>
          <p className="mb-10 text-slate-500">
            POST /subscriptions to subscribe, PUT /subscriptions/&#123;id&#125;
            to change plan.
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <form
              id="subscribe-form"
              onSubmit={handleSubscribe}
              className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="min-w-[12rem] flex-1">
                <label
                  htmlFor="subscribe-plan-id"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Plan id
                </label>
                <input
                  id="subscribe-plan-id"
                  name="planId"
                  type="number"
                  min="1"
                  required
                  placeholder="3"
                  value={subscribePlanId}
                  onChange={(event) => setSubscribePlanId(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Subscribe
              </button>
              <p id="subscribe-status" className="w-full text-sm text-slate-500">
                {subscribeStatus}
              </p>
            </form>

            <form
              id="change-plan-form"
              onSubmit={handleChange}
              className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="min-w-[10rem] flex-1">
                <label
                  htmlFor="change-subscription-id"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Subscription id
                </label>
                <input
                  id="change-subscription-id"
                  name="id"
                  type="number"
                  min="1"
                  required
                  placeholder="1"
                  value={changeId}
                  onChange={(event) => setChangeId(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="min-w-[10rem] flex-1">
                <label
                  htmlFor="change-plan-id"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  New plan id
                </label>
                <input
                  id="change-plan-id"
                  name="planId"
                  type="number"
                  min="1"
                  required
                  placeholder="5"
                  value={changePlanId}
                  onChange={(event) => setChangePlanId(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Change plan
              </button>
              <p
                id="change-plan-status"
                className="w-full text-sm text-slate-500"
              >
                {changeStatus}
              </p>
            </form>
          </div>
        </section>
      </main>

      <SimpleFooter />
    </>
  );
}
