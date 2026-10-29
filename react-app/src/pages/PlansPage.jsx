import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { SimpleFooter } from "../components/Footer";
import { useAuth } from "../components/AuthContext";
import {
  API_BASE_URL,
  authHeaders,
  describeError,
} from "../lib/api";

function PlanCard({ plan }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-400 hover:shadow-md">
      <h3 className="mb-2 text-xl font-bold text-slate-900">{plan.name}</h3>
      <p className="mb-6 text-sm leading-relaxed text-slate-500">
        {plan.serviceType ?? "n/a"} - {plan.dataLimit ?? "n/a"} GB -{" "}
        {plan.operatorName ?? "n/a"}
      </p>
      <div className="mt-auto flex items-end justify-between">
        <p className="text-3xl font-extrabold text-slate-900">
          {plan.price}
          <span className="text-base font-medium text-slate-400">
            {" "}
            SEK/month
          </span>
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            plan.active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {plan.active ? "active" : "inactive"}
        </span>
      </div>
    </article>
  );
}

function AdminPlanRow({ plan, onEdit, onDelete }) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-6 py-4 text-slate-400">{plan.id}</td>
      <td className="px-6 py-4 font-semibold text-slate-900">{plan.name}</td>
      <td className="px-6 py-4 text-slate-700">{plan.price}</td>
      <td className="px-6 py-4 text-slate-700">{plan.serviceType}</td>
      <td className="px-6 py-4 text-slate-500">{plan.dataLimit ?? "-"}</td>
      <td className="px-6 py-4 text-slate-700">
        {plan.operatorName ?? "-"}
      </td>
      <td className="px-6 py-4">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            plan.active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {String(plan.active)}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          onClick={() => onEdit(plan.id)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(plan.id)}
          className="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

const emptyForm = {
  id: "",
  name: "",
  price: "",
  operatorId: "",
  serviceType: "INTERNET",
  dataLimit: "",
  active: false,
};

export default function PlansPage() {
  const { admin } = useAuth();
  const [searchParams] = useSearchParams();
  const [activePlans, setActivePlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [operatorId, setOperatorId] = useState(
    searchParams.get("operatorId") || "",
  );
  const [operators, setOperators] = useState([]);
  const [adminPlans, setAdminPlans] = useState([]);
  const [adminStatus, setAdminStatus] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    setOperatorId(searchParams.get("operatorId") || "");
  }, [searchParams]);

  const loadActivePlans = async (type = "") => {
    setServiceType(type);
    setPlansLoading(true);
    setPlansError("");

    try {
      const { data } = await axios.get(`${API_BASE_URL}/plans/active`, {
        headers: authHeaders(),
        params: type ? { serviceType: type } : {},
      });
      setActivePlans(Array.isArray(data) ? data : []);
    } catch (error) {
      setPlansError(describeError(error));
    } finally {
      setPlansLoading(false);
    }
  };

  const loadAllPlans = async () => {
    setAdminStatus("Loading admin plans...");
    try {
      const { data } = await axios.get(`${API_BASE_URL}/plans`, {
        headers: authHeaders(),
      });
      setAdminPlans(data);
      setAdminStatus(`${data.length} plan(s) in total`);
    } catch (error) {
      setAdminStatus(`Could not load admin plans: ${describeError(error)}`);
    }
  };

  useEffect(() => {
    loadActivePlans();

    axios
      .get(`${API_BASE_URL}/operators`, { headers: authHeaders() })
      .then(({ data }) => setOperators(data))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (admin) loadAllPlans();
  }, [admin]);

  const filteredPlans = operatorId
    ? activePlans.filter((plan) => String(plan.operatorId) === operatorId)
    : activePlans;

  const plansStatus = plansError
    ? `Could not load plans: ${plansError}`
    : plansLoading
      ? "Loading plans..."
      : `${filteredPlans.length} active plan(s)`;

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleOperatorChange = (value) => {
    setOperatorId(value);
    if (activePlans.length === 0) {
      loadActivePlans(serviceType);
    }
  };

  const handleEdit = async (id) => {
    const existing = adminPlans.find((plan) => String(plan.id) === String(id));
    if (existing) {
      setForm({
        id: existing.id,
        name: existing.name,
        price: existing.price,
        operatorId: existing.operatorId,
        serviceType: existing.serviceType,
        dataLimit: existing.dataLimit ?? "",
        active: Boolean(existing.active),
      });
      setFormStatus(`Editing plan #${existing.id}`);
      return;
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/plans`, {
        headers: authHeaders(),
      });
      const plan = data.find((item) => String(item.id) === String(id));
      if (plan) {
        setForm({
          id: plan.id,
          name: plan.name,
          price: plan.price,
          operatorId: plan.operatorId,
          serviceType: plan.serviceType,
          dataLimit: plan.dataLimit ?? "",
          active: Boolean(plan.active),
        });
        setFormStatus(`Editing plan #${plan.id}`);
      }
    } catch (error) {
      setFormStatus(`Could not load plan: ${describeError(error)}`);
    }
  };

  const handleDelete = async (id) => {
    setAdminStatus("Deleting...");
    try {
      await axios.delete(`${API_BASE_URL}/plans/${id}`, {
        headers: authHeaders(),
      });
      setAdminStatus(`Plan #${id} deleted.`);
      loadAllPlans();
      loadActivePlans(serviceType);
    } catch (error) {
      setAdminStatus(`Could not delete plan: ${describeError(error)}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const body = {
      operatorId: Number(form.operatorId),
      name: form.name.trim(),
      price: Number(form.price),
      serviceType: form.serviceType,
      dataLimit: Number(form.dataLimit) || null,
      active: form.active,
    };

    setFormStatus("Saving...");
    try {
      if (form.id) {
        await axios.put(`${API_BASE_URL}/plans/${form.id}`, body, {
          headers: authHeaders(),
        });
        setFormStatus(`Plan #${form.id} updated.`);
      } else {
        await axios.post(`${API_BASE_URL}/plans`, body, {
          headers: authHeaders(),
        });
        setFormStatus("Plan created.");
      }
      setForm(emptyForm);
      loadAllPlans();
      loadActivePlans(serviceType);
    } catch (error) {
      setFormStatus(`Could not save plan: ${describeError(error)}`);
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <section
          id="active-plans"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Plans
          </h1>
          <p className="mb-10 text-slate-500">
            Example cards - filter buttons call GET /plans/active with a
            serviceType.
          </p>

          <div
            id="plan-filters"
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            {[
              { value: "", label: "All" },
              { value: "INTERNET", label: "Internet" },
              { value: "MOBILE", label: "Mobile" },
            ].map((item) => (
              <button
                key={item.value || "all"}
                type="button"
                data-service-type={item.value}
                onClick={() => loadActivePlans(item.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {item.label}
              </button>
            ))}

            <label htmlFor="plan-operator-filter" className="sr-only">
              Operator
            </label>
            <select
              id="plan-operator-filter"
              value={operatorId}
              onChange={(event) => handleOperatorChange(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All operators</option>
              {operators.map((operator) => (
                <option key={operator.id} value={String(operator.id)}>
                  {operator.name}
                </option>
              ))}
            </select>
          </div>

          <p id="plans-status" className="mb-6 text-sm text-slate-500">
            {plansStatus}
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.length ? (
              filteredPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No active plans{operatorId ? " for this operator" : ""}.
              </p>
            )}
          </div>
        </section>

        {admin && (
          <>
            <section
              id="all-plans"
              data-admin-only
              className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
            >
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                All plans (admin)
              </h2>
              <p className="mb-10 text-slate-500">
                GET /plans returns every plan, including inactive ones.
              </p>

              <p
                id="admin-plan-status"
                className="mb-6 text-sm text-slate-500"
              >
                {adminStatus}
              </p>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[56rem] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Id</th>
                      <th className="px-6 py-3 font-semibold">Name</th>
                      <th className="px-6 py-3 font-semibold">Price</th>
                      <th className="px-6 py-3 font-semibold">Service type</th>
                      <th className="px-6 py-3 font-semibold">Data limit</th>
                      <th className="px-6 py-3 font-semibold">Operator</th>
                      <th className="px-6 py-3 font-semibold">Active</th>
                      <th className="px-6 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminPlans.length ? (
                      adminPlans.map((plan) => (
                        <AdminPlanRow
                          key={plan.id}
                          plan={plan}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-6 py-4 text-slate-500"
                        >
                          No plans found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section
              id="plan-edit"
              data-admin-only
              className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
            >
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Create or update a plan
              </h2>
              <p className="mb-10 text-slate-500">
                POST /plans to create, PUT /plans/&#123;id&#125; to update (admin
                only).
              </p>

              <form
                id="plan-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-3"
              >
                <input type="hidden" id="plan-id" name="id" value={form.id} />

                <div>
                  <label
                    htmlFor="plan-name"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Name
                  </label>
                  <input
                    id="plan-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Fiber 100"
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="plan-price"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Price
                  </label>
                  <input
                    id="plan-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="299"
                    value={form.price}
                    onChange={(event) => updateForm("price", event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="plan-operator-id"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Operator id
                  </label>
                  <input
                    id="plan-operator-id"
                    name="operatorId"
                    type="number"
                    min="1"
                    required
                    placeholder="1"
                    value={form.operatorId}
                    onChange={(event) =>
                      updateForm("operatorId", event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="plan-service-type"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Service type
                  </label>
                  <select
                    id="plan-service-type"
                    name="serviceType"
                    required
                    value={form.serviceType}
                    onChange={(event) =>
                      updateForm("serviceType", event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="INTERNET">INTERNET</option>
                    <option value="MOBILE">MOBILE</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="plan-data-limit"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Data limit (GB)
                  </label>
                  <input
                    id="plan-data-limit"
                    name="dataLimit"
                    type="number"
                    min="0"
                    placeholder="100"
                    value={form.dataLimit}
                    onChange={(event) =>
                      updateForm("dataLimit", event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="plan-active"
                    name="active"
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      updateForm("active", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="plan-active"
                    className="text-sm font-medium text-slate-700"
                  >
                    Active
                  </label>
                </div>

                <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-3">
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    Save plan
                  </button>
                  <button
                    type="reset"
                    onClick={() => {
                      setForm(emptyForm);
                      setFormStatus("");
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    Clear
                  </button>
                </div>
              </form>

              <p id="plan-form-status" className="mt-4 text-sm text-slate-500">
                {formStatus}
              </p>
            </section>
          </>
        )}
      </main>

      <SimpleFooter />
    </>
  );
}
