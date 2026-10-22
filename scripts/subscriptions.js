// Subscriptions page requests (ROLE_USER):
//   GET  /api/v1/subscriptions                 -> #subscription-list
//   POST /api/v1/subscriptions  { planId }     -> #subscribe-form
//   PUT  /api/v1/subscriptions/{id} { planId } -> #change-plan-form
//   POST /api/v1/subscriptions/{id}/cancel     -> row "Cancel" button

const API_BASE_URL = "http://localhost:8080/api/v1";
const TOKEN_KEY = "accessToken";
const getToken = () => localStorage.getItem(TOKEN_KEY);
const authHeaders = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const describeError = (error) => {
  const data = error.response && error.response.data;
  const detail = data && (data.message || data.error);
  return detail || error.message;
};

const subscriptionRow = (sub) => {
  const cancelled = Boolean(sub.cancelledAt);
  return `
  <tr class="transition hover:bg-slate-50">
    <td class="px-6 py-4 text-slate-400">${sub.id}</td>
    <td class="px-6 py-4 font-semibold text-slate-900">${sub.planName}</td>
    <td class="px-6 py-4 text-slate-700">${sub.price}</td>
    <td class="px-6 py-4 text-slate-700">${sub.operatorName ?? "-"}</td>
    <td class="px-6 py-4 text-slate-700">${sub.serviceType ?? "-"}</td>
    <td class="px-6 py-4 text-slate-500">${sub.createdAt ?? "-"}</td>
    <td class="px-6 py-4 text-slate-500">${sub.cancelledAt ?? "-"}</td>
    <td class="px-6 py-4">
      ${
        cancelled
          ? `<span class="text-xs text-slate-400">-</span>`
          : `<button type="button" data-subscription-id="${sub.id}" data-plan-id="${sub.planId}" data-action="change"
               class="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
               Change plan
             </button>
             <button type="button" data-subscription-id="${sub.id}" data-action="cancel"
               class="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
               Cancel
             </button>`
      }
    </td>
  </tr>`;
};

function bootstrapSubscriptions() {
  const subscriptionList = document.getElementById("subscription-list");
  const subscriptionsStatus = document.getElementById("subscriptions-status");
  const subscribeForm = document.getElementById("subscribe-form");
  const subscribeStatus = document.getElementById("subscribe-status");
  const changeForm = document.getElementById("change-plan-form");
  const changeStatus = document.getElementById("change-plan-status");

  async function loadSubscriptions() {
    subscriptionsStatus.textContent = "Loading subscriptions...";
    try {
      const { data } = await axios.get(`${API_BASE_URL}/subscriptions`, { headers: authHeaders() });
      subscriptionList.innerHTML = data.length
        ? data.map(subscriptionRow).join("")
        : `<tr><td colspan="8" class="px-6 py-4 text-slate-500">No subscriptions yet.</td></tr>`;
      subscriptionsStatus.textContent = `${data.length} subscription(s)`;
    } catch (error) {
      subscriptionsStatus.textContent = `Could not load subscriptions: ${describeError(error)}`;
    }
  }

  subscribeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const planId = Number(document.getElementById("subscribe-plan-id").value);

    subscribeStatus.textContent = "Subscribing...";
    try {
      await axios.post(`${API_BASE_URL}/subscriptions`, { planId }, { headers: authHeaders() });
      subscribeStatus.textContent = `Subscribed to plan #${planId}.`;
      subscribeForm.reset();
      loadSubscriptions();
    } catch (error) {
      subscribeStatus.textContent = `Could not subscribe: ${describeError(error)}`;
    }
  });

  changeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("change-subscription-id").value;
    const planId = Number(document.getElementById("change-plan-id").value);

    changeStatus.textContent = "Changing plan...";
    try {
      await axios.put(`${API_BASE_URL}/subscriptions/${id}`, { planId }, { headers: authHeaders() });
      changeStatus.textContent = `Subscription #${id} changed to plan #${planId}.`;
      changeForm.reset();
      loadSubscriptions();
    } catch (error) {
      changeStatus.textContent = `Could not change plan: ${describeError(error)}`;
    }
  });

  subscriptionList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-subscription-id]");
    if (!button || button.dataset.action !== "cancel") return;

    const id = button.dataset.subscriptionId;
    button.disabled = true;

    try {
      await axios.post(`${API_BASE_URL}/subscriptions/${id}/cancel`, null, { headers: authHeaders() });
      loadSubscriptions();
    } catch (error) {
      subscriptionsStatus.textContent = `Could not cancel: ${describeError(error)}`;
      button.disabled = false;
    }
  });

  loadSubscriptions();
}

if (requireLogin()) {
  wireStaticNav();
  bootstrapSubscriptions();
}
