// User dashboard requests:
//   GET /api/v1/subscriptions      -> #subscriptions-body (my rows) + #subscriptions-count
//   GET /api/v1/plans/active       -> #plans-count
//   GET /api/v1/operators          -> #operators-count

const API_BASE_URL = "http://localhost:8080/api/v1";
const TOKEN_KEY = "accessToken";
const getToken = () => localStorage.getItem(TOKEN_KEY);
const authHeaders = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const subscriptionRow = (sub) => {
  const cancelled = Boolean(sub.cancelledAt);
  return `
  <tr class="transition hover:bg-slate-50">
    <td class="px-6 py-4 text-slate-400">${sub.id}</td>
    <td class="px-6 py-4 font-semibold text-slate-900">${sub.planName}</td>
    <td class="px-6 py-4 text-slate-700">${sub.price}</td>
    <td class="px-6 py-4 text-slate-700">${sub.operatorName ?? "-"}</td>
    <td class="px-6 py-4">
      <span class="rounded-full px-2 py-0.5 text-xs font-semibold ${cancelled ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"}">${cancelled ? "CANCELLED" : "ACTIVE"}</span>
    </td>
    <td class="px-6 py-4 text-slate-500">${sub.cancelledAt ?? "-"}</td>
  </tr>`;
};

function bootstrapUserDashboard() {
  const subscriptionsBody = document.getElementById("subscriptions-body");
  const subscriptionsCount = document.getElementById("subscriptions-count");
  const plansCount = document.getElementById("plans-count");
  const operatorsCount = document.getElementById("operators-count");
  const welcomeTitle = document.getElementById("welcome-title");

  async function loadSubscriptions() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/subscriptions`, { headers: authHeaders() });
      subscriptionsCount.textContent = data.length;
      subscriptionsBody.innerHTML = data.length
        ? data.map(subscriptionRow).join("")
        : `<tr><td colspan="6" class="px-6 py-4 text-slate-500">No subscriptions yet.</td></tr>`;
    } catch (error) {
      subscriptionsBody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 text-slate-500">Could not load subscriptions.</td></tr>`;
    }
  }

  async function loadCounts() {
    try {
      const { data: plans } = await axios.get(`${API_BASE_URL}/plans/active`, { headers: authHeaders() });
      plansCount.textContent = plans.length;
    } catch {
      plansCount.textContent = "-";
    }

    try {
      const { data: operators } = await axios.get(`${API_BASE_URL}/operators`, { headers: authHeaders() });
      operatorsCount.textContent = operators.length;
    } catch {
      operatorsCount.textContent = "-";
    }
  }

  // Fill welcome name from the session (sub = email) or cached user.
  try {
    const session = getSession();
    if (session && session.sub && welcomeTitle) {
      welcomeTitle.textContent = `Welcome back, ${session.sub}`;
    }
  } catch {
    // ignore
  }

  loadSubscriptions();
  loadCounts();
}

if (requireLogin()) {
  wireStaticNav();
  bootstrapUserDashboard();
}
