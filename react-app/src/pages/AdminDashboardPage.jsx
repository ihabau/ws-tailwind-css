import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { SimpleFooter } from "../components/Footer";
import { API_BASE_URL, authHeaders, getToken } from "../lib/api";

const examplePlans = [
  {
    id: 1,
    name: "Fiber 50",
    price: "199 SEK",
    serviceType: "INTERNET",
    dataLimit: "50 GB",
    operatorName: "TelNet",
    active: true,
  },
  {
    id: 2,
    name: "Fiber 300",
    price: "499 SEK",
    serviceType: "INTERNET",
    dataLimit: "300 GB",
    operatorName: "TelNet",
    active: false,
  },
  {
    id: 3,
    name: "Mobile Unlimited",
    price: "349 SEK",
    serviceType: "MOBILE",
    dataLimit: "100 GB",
    operatorName: "MobiLink",
    active: true,
  },
];

const exampleCustomers = [
  {
    id: 1,
    firstName: "Admin",
    lastName: "Adminson",
    email: "admin@example.com",
  },
  {
    id: 2,
    firstName: "User",
    lastName: "Userson",
    email: "user@example.com",
  },
];

function PlanRow({ plan }) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-6 py-4 text-slate-400">{plan.id}</td>
      <td className="px-6 py-4 font-semibold text-slate-900">{plan.name}</td>
      <td className="px-6 py-4 text-slate-700">{plan.price}</td>
      <td className="px-6 py-4 text-slate-700">{plan.serviceType}</td>
      <td className="px-6 py-4 text-slate-500">{plan.dataLimit}</td>
      <td className="px-6 py-4 text-slate-700">{plan.operatorName}</td>
      <td className="px-6 py-4">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            plan.active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {plan.active ? "active" : "inactive"}
        </span>
      </td>
    </tr>
  );
}

function CustomerRow({ customer }) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-6 py-4 text-slate-400">{customer.id}</td>
      <td className="px-6 py-4 font-semibold text-slate-900">
        {customer.firstName}
      </td>
      <td className="px-6 py-4 text-slate-700">{customer.lastName}</td>
      <td className="px-6 py-4 text-slate-500">{customer.email}</td>
    </tr>
  );
}

export default function AdminDashboardPage() {
  const [plans, setPlans] = useState(examplePlans);
  const [customers, setCustomers] = useState(exampleCustomers);
  const [plansCount, setPlansCount] = useState(8);
  const [activePlansCount, setActivePlansCount] = useState(6);
  const [customersCount, setCustomersCount] = useState(2);
  const [operatorsCount, setOperatorsCount] = useState(2);

  useEffect(() => {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    };

    const loadPlans = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/plans`, { headers });
        setPlans(data);
        setPlansCount(data.length);
        setActivePlansCount(data.filter((plan) => plan.active).length);
      } catch {
        return;
      }
    };

    const loadCustomers = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/customers`, {
          headers,
        });
        setCustomers(data);
        setCustomersCount(data.length);
      } catch {
        return;
      }
    };

    const loadOperators = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/operators`, {
          headers,
        });
        setOperatorsCount(data.length);
      } catch {
        return;
      }
    };

    loadPlans();
    loadCustomers();
    loadOperators();
  }, []);

  return (
    <>
      <Navbar />

      <main>
        <section
          id="overview"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Admin dashboard
          </h1>
          <p className="mb-10 text-slate-500">
            Your current plan and operator.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total plans
              </p>
              <p
                id="plans-count"
                className="mt-2 text-3xl font-extrabold text-slate-900"
              >
                {plansCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">GET /api/v1/plans</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Active plans
              </p>
              <p
                id="active-plans-count"
                className="mt-2 text-3xl font-extrabold text-slate-900"
              >
                {activePlansCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">2 inactive</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Customers</p>
              <p
                id="customers-count"
                className="mt-2 text-3xl font-extrabold text-slate-900"
              >
                {customersCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                GET /api/v1/customers
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
          id="plans"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            All plans
          </h2>
          <p className="mb-10 text-slate-500">
            Example rows - includes inactive plans, which only admins can see.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Id</th>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Price</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Data</th>
                  <th className="px-6 py-3 font-semibold">Operator</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plans.length ? (
                  plans.map((plan) => <PlanRow key={plan.id} plan={plan} />)
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-slate-500">
                      No plans found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section
          id="customers"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Customers
          </h2>
          <p className="mb-10 text-slate-500">
            Example rows - registered customer accounts.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Id</th>
                  <th className="px-6 py-3 font-semibold">First name</th>
                  <th className="px-6 py-3 font-semibold">Last name</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.length ? (
                  customers.map((customer) => (
                    <CustomerRow key={customer.id} customer={customer} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-slate-500">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <SimpleFooter label="© 2026 Lexicon Telecom AB. Admin view." />
    </>
  );
}
