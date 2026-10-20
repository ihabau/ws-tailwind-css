// Plans page requests:
//   GET    /api/v1/plans/active                            -> #plan-list
//   GET    /api/v1/plans/active?serviceType=INTERNET|MOBILE -> #plan-filters buttons
//   GET    /api/v1/plans                                    (ADMIN) -> #admin-plan-list
//   POST   /api/v1/plans   { operatorId, name, price, serviceType, dataLimit, active } -> #plan-form
//   PUT    /api/v1/plans/{id}  { ...same as POST }                                     -> #plan-form
//   DELETE /api/v1/plans/{id}                                                          -> row buttons

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

// --- active plans (cards) --------------------------------------------------

const planCard = (plan) => `
  <article class="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-400 hover:shadow-md">
    <h3 class="mb-2 text-xl font-bold text-slate-900">${plan.name}</h3>
    <p class="mb-6 text-sm leading-relaxed text-slate-500">${plan.serviceType ?? "n/a"} - ${plan.dataLimit ?? "n/a"} GB - ${plan.operatorName ?? "n/a"}</p>
    <div class="mt-auto flex items-end justify-between">
      <p class="text-3xl font-extrabold text-slate-900">${plan.price}<span class="text-base font-medium text-slate-400"> SEK/month</span></p>
      <span class="rounded-full px-2 py-0.5 text-xs font-semibold ${plan.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}">${plan.active ? "active" : "inactive"}</span>
    </div>
  </article>`;

const adminPlanRow = (plan) => `
  <tr class="transition hover:bg-slate-50">
    <td class="px-6 py-4 text-slate-400">${plan.id}</td>
    <td class="px-6 py-4 font-semibold text-slate-900">${plan.name}</td>
    <td class="px-6 py-4 text-slate-700">${plan.price}</td>
    <td class="px-6 py-4 text-slate-700">${plan.serviceType}</td>
    <td class="px-6 py-4 text-slate-500">${plan.dataLimit ?? "-"}</td>
    <td class="px-6 py-4 text-slate-700">${plan.operatorName ?? "-"}</td>
    <td class="px-6 py-4">
      <span class="rounded-full px-2 py-0.5 text-xs font-semibold ${plan.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}">${plan.active}</span>
    </td>
    <td class="px-6 py-4">
      <button type="button" data-plan-id="${plan.id}" data-action="edit"
        class="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        Edit
      </button>
      <button type="button" data-plan-id="${plan.id}" data-action="delete"
        class="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        Delete
      </button>
    </td>
  </tr>`;

function bootstrapPlans() {
  const planList = document.getElementById("plan-list");
  const plansStatus = document.getElementById("plans-status");
  const adminPlanList = document.getElementById("admin-plan-list");
  const adminPlanStatus = document.getElementById("admin-plan-status");
  const planForm = document.getElementById("plan-form");
  const planFormStatus = document.getElementById("plan-form-status");

  async function loadActivePlans(serviceType = "") {
    plansStatus.textContent = "Loading plans...";
    try {
      const { data } = await axios.get(`${API_BASE_URL}/plans/active`, {
        headers: authHeaders(),
        params: serviceType ? { serviceType } : {},
      });
      planList.innerHTML = data.length
        ? data.map(planCard).join("")
        : `<p class="text-sm text-slate-500">No active plans.</p>`;
      plansStatus.textContent = `${data.length} active plan(s)`;
    } catch (error) {
      plansStatus.textContent = `Could not load plans: ${describeError(error)}`;
    }
  }

  async function loadAllPlans() {
    adminPlanStatus.textContent = "Loading admin plans...";
    try {
      const { data } = await axios.get(`${API_BASE_URL}/plans`, { headers: authHeaders() });
      adminPlanList.innerHTML = data.length
        ? data.map(adminPlanRow).join("")
        : `<tr><td colspan="8" class="px-6 py-4 text-slate-500">No plans found</td></tr>`;
      adminPlanStatus.textContent = `${data.length} plan(s) in total`;
    } catch (error) {
      adminPlanStatus.textContent = `Could not load admin plans: ${describeError(error)}`;
    }
  }

  const fillPlanForm = (plan) => {
    document.getElementById("plan-id").value = plan.id;
    document.getElementById("plan-name").value = plan.name;
    document.getElementById("plan-price").value = plan.price;
    document.getElementById("plan-operator-id").value = plan.operatorId;
    document.getElementById("plan-service-type").value = plan.serviceType;
    document.getElementById("plan-data-limit").value = plan.dataLimit ?? "";
    document.getElementById("plan-active").checked = Boolean(plan.active);
    planFormStatus.textContent = `Editing plan #${plan.id}`;
  };

  document.querySelectorAll("#plan-filters button").forEach((button) => {
    button.addEventListener("click", () => loadActivePlans(button.dataset.serviceType || ""));
  });

  planForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("plan-id").value;
    const body = {
      operatorId: Number(document.getElementById("plan-operator-id").value),
      name: document.getElementById("plan-name").value.trim(),
      price: Number(document.getElementById("plan-price").value),
      serviceType: document.getElementById("plan-service-type").value,
      dataLimit: Number(document.getElementById("plan-data-limit").value) || null,
      active: document.getElementById("plan-active").checked,
    };

    planFormStatus.textContent = "Saving...";
    try {
      if (id) {
        await axios.put(`${API_BASE_URL}/plans/${id}`, body, { headers: authHeaders() });
        planFormStatus.textContent = `Plan #${id} updated.`;
      } else {
        await axios.post(`${API_BASE_URL}/plans`, body, { headers: authHeaders() });
        planFormStatus.textContent = "Plan created.";
      }
      planForm.reset();
      document.getElementById("plan-id").value = "";
      loadAllPlans();
      loadActivePlans();
    } catch (error) {
      planFormStatus.textContent = `Could not save plan: ${describeError(error)}`;
    }
  });

  adminPlanList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-plan-id]");
    if (!button) return;

    const id = button.dataset.planId;

    if (button.dataset.action === "edit") {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/plans`, { headers: authHeaders() });
        const plan = data.find((p) => String(p.id) === String(id));
        if (plan) fillPlanForm(plan);
      } catch (error) {
        planFormStatus.textContent = `Could not load plan: ${describeError(error)}`;
      }
      return;
    }

    if (button.dataset.action === "delete") {
      adminPlanStatus.textContent = "Deleting...";
      try {
        await axios.delete(`${API_BASE_URL}/plans/${id}`, { headers: authHeaders() });
        adminPlanStatus.textContent = `Plan #${id} deleted.`;
        loadAllPlans();
        loadActivePlans();
      } catch (error) {
        adminPlanStatus.textContent = `Could not delete plan: ${describeError(error)}`;
      }
    }
  });

  loadActivePlans();
  loadAllPlans();
}

if (requireLogin()) {
  wireStaticNav();
  bootstrapPlans();
}
