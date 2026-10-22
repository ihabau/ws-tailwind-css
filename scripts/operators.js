// Operators page requests:
//   GET  /api/v1/operators                 -> #operator-list
//   GET  /api/v1/operators/{id}
//   GET  /api/v1/operators/search?name=    -> #operator-search-form
//   POST /api/v1/operators  { name }       -> #operator-form

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

const operatorCard = (operator) => `
  <li class="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-400 hover:shadow-md">
    <h3 class="mb-2 text-xl font-bold text-slate-900">${operator.name}</h3>
    <p class="mb-6 text-sm leading-relaxed text-slate-500">Operator - internet &amp; mobile.</p>
    <div class="mt-auto flex items-end justify-between">
      <p class="text-sm font-medium text-slate-500">Operator #${operator.id}</p>
      <a href="plans.html"
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        View plans
      </a>
    </div>
  </li>`;

function bootstrapOperators() {
  const operatorList = document.getElementById("operator-list");
  const operatorsStatus = document.getElementById("operators-status");
  const searchForm = document.getElementById("operator-search-form");
  const createForm = document.getElementById("operator-form");
  const createStatus = document.getElementById("operator-form-status");

  function renderOperators(operators) {
    operatorList.innerHTML = operators.length
      ? operators.map(operatorCard).join("")
      : `<li class="text-sm text-slate-500">No operators found.</li>`;
  }

  async function loadOperators() {
    operatorsStatus.textContent = "Loading operators...";
    try {
      const { data } = await axios.get(`${API_BASE_URL}/operators`, { headers: authHeaders() });
      renderOperators(data);
      operatorsStatus.textContent = `${data.length} operator(s)`;
    } catch (error) {
      operatorsStatus.textContent = `Could not load operators: ${describeError(error)}`;
    }
  }

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("operator-search-name").value.trim();
    if (!name) return loadOperators();

    operatorsStatus.textContent = "Searching...";
    try {
      const { data } = await axios.get(`${API_BASE_URL}/operators/search`, {
        headers: authHeaders(),
        params: { name },
      });
      renderOperators(Array.isArray(data) ? data : [data]);
      operatorsStatus.textContent = `Result for "${name}"`;
    } catch (error) {
      operatorsStatus.textContent = `Search failed: ${describeError(error)}`;
    }
  });

  createForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("operator-name").value.trim();

    createStatus.textContent = "Creating...";
    try {
      await axios.post(`${API_BASE_URL}/operators`, { name }, { headers: authHeaders() });
      createStatus.textContent = `Operator "${name}" created.`;
      createForm.reset();
      loadOperators();
    } catch (error) {
      createStatus.textContent = `Could not create operator: ${describeError(error)}`;
    }
  });

  loadOperators();
}

if (requireLogin()) {
  wireStaticNav();
  bootstrapOperators();
}
