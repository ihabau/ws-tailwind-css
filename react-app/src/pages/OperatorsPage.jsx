import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { SimpleFooter } from "../components/Footer";
import { API_BASE_URL, authHeaders, describeError } from "../lib/api";

const exampleOperators = [
  { id: 1, name: "TelNet" },
  { id: 2, name: "MobiLink" },
];

function OperatorCard({ operator }) {
  return (
    <li className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-400 hover:shadow-md">
      <h3 className="mb-2 text-xl font-bold text-slate-900">
        {operator.name}
      </h3>
      <p className="mb-6 text-sm leading-relaxed text-slate-500">
        Operator - internet &amp; mobile.
      </p>
      <div className="mt-auto flex items-end justify-between">
        <p className="text-sm font-medium text-slate-500">
          Operator #{operator.id}
        </p>
        <Link
          to={`/plans?operatorId=${operator.id}`}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          View plans
        </Link>
      </div>
    </li>
  );
}

export default function OperatorsPage() {
  const [operators, setOperators] = useState(exampleOperators);
  const [status, setStatus] = useState("Loading operators...");
  const [searchName, setSearchName] = useState("");
  const [createName, setCreateName] = useState("");
  const [createStatus, setCreateStatus] = useState("");

  const loadOperators = async () => {
    setStatus("Loading operators...");
    try {
      const { data } = await axios.get(`${API_BASE_URL}/operators`, {
        headers: authHeaders(),
      });
      setOperators(data);
      setStatus(`${data.length} operator(s)`);
    } catch (error) {
      setStatus(`Could not load operators: ${describeError(error)}`);
    }
  };

  useEffect(() => {
    loadOperators();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    const name = searchName.trim();
    if (!name) return loadOperators();

    setStatus("Searching...");
    try {
      const { data } = await axios.get(`${API_BASE_URL}/operators/search`, {
        headers: authHeaders(),
        params: { name },
      });
      setOperators(Array.isArray(data) ? data : [data]);
      setStatus(`Result for "${name}"`);
    } catch (error) {
      setStatus(`Search failed: ${describeError(error)}`);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const name = createName.trim();

    setCreateStatus("Creating...");
    try {
      await axios.post(
        `${API_BASE_URL}/operators`,
        { name },
        { headers: authHeaders() },
      );
      setCreateStatus(`Operator "${name}" created.`);
      setCreateName("");
      loadOperators();
    } catch (error) {
      setCreateStatus(`Could not create operator: ${describeError(error)}`);
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <section
          id="all-operators"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Operators
          </h1>
          <p className="mb-10 text-slate-500">
            Example cards - live data is wired in operators.js.
          </p>

          <div className="mb-6 flex flex-wrap items-end gap-4">
            <form
              id="operator-search-form"
              onSubmit={handleSearch}
              className="flex items-end gap-3"
            >
              <div>
                <label
                  htmlFor="operator-search-name"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Search by name
                </label>
                <input
                  id="operator-search-name"
                  name="name"
                  type="text"
                  placeholder="TelNet"
                  value={searchName}
                  onChange={(event) => setSearchName(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Search
              </button>
            </form>
          </div>

          <p id="operators-status" className="mb-6 text-sm text-slate-500">
            {status}
          </p>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {operators.length ? (
              operators.map((operator) => (
                <OperatorCard key={operator.id} operator={operator} />
              ))
            ) : (
              <li className="text-sm text-slate-500">No operators found.</li>
            )}
          </ul>
        </section>

        <section
          id="operator-create"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Create operator
          </h2>
          <p className="mb-10 text-slate-500">POST /operators (admin only).</p>

          <form
            id="operator-form"
            onSubmit={handleCreate}
            className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="min-w-[16rem] flex-1">
              <label
                htmlFor="operator-name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Name
              </label>
              <input
                id="operator-name"
                name="name"
                type="text"
                required
                placeholder="New operator"
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Create operator
            </button>
          </form>

          <p id="operator-form-status" className="mt-4 text-sm text-slate-500">
            {createStatus}
          </p>
        </section>
      </main>

      <SimpleFooter />
    </>
  );
}
