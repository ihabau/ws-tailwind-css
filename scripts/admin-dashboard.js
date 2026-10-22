// Admin dashboard requests:
//   GET /api/v1/plans      (ADMIN)       -> #plans-header / counts
//   GET /api/v1/customers  (USER, ADMIN) -> #customers-header / count
//   GET /api/v1/operators  (USER, ADMIN) -> #operators-count

const API_BASE_URL = "http://localhost:8080/api/v1";
const TOKEN_KEY = "accessToken";
const getToken = () => localStorage.getItem(TOKEN_KEY);

function bootstrapAdminDashboard() {
  const plansHeader = document.getElementById("plans-header");
  const customerHeader = document.getElementById("customers-header");
  const plansCount = document.getElementById("plans-count");
  const customersCount = document.getElementById("customers-count");
  const operatorsCount = document.getElementById("operators-count");
  const activePlansCount = document.getElementById("active-plans-count");

  const getPlans = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/plans`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      console.log("Plans:");
      console.log(data);
      if (data.length === 0) {
        plansHeader.innerHTML = `<tr><td colspan="7">No plans found</td></tr>`;
      }
      for (const plan of data) {
        let active = plan.active ? "active" : "inactive";
        plansCount.textContent = data.length;
        activePlansCount.textContent = data.filter((p) => p.active).length;
        customersCount.textContent = data.filter((p) => p.customerId).length;
        plansHeader.innerHTML += `
            <tr class="transition hover:bg-slate-50">
              <td class="px-6 py-4 text-slate-400">${plan.id}</td>
              <td class="px-6 py-4 font-semibold text-slate-900">${plan.name}</td>
              <td class="px-6 py-4 text-slate-700">${plan.price}</td>
              <td class="px-6 py-4 text-slate-700">${plan.serviceType}</td>
              <td class="px-6 py-4 text-slate-500">${plan.dataLimit}</td>
              <td class="px-6 py-4 text-slate-700">${plan.operatorName}</td>
              <td class="px-6 py-4">
                <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">${plan.active}</span>
              </td>
            </tr>
      `;
      }
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  getPlans();

  const getCustomers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/customers`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      console.log("Customers:");
      console.log(data);
      customersCount.textContent = data.length;
      if (data.length === 0) {
        plansHeader.innerHTML = `<tr><td colspan="7">No customers found</td></tr>`;
      }
      for (const customer of data) {
        customerHeader.innerHTML += `
            <tr class="transition hover:bg-slate-50">
              <td class="px-6 py-4 text-slate-400">${customer.id}</td>
              <td class="px-6 py-4 font-semibold text-slate-900">${customer.firstName}</td>
              <td class="px-6 py-4 font-semibold text-slate-900">${customer.lastName}</td>
              <td class="px-6 py-4 text-slate-700">${customer.email}</td>
            </tr>
      `;
      }
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  getCustomers();

  const getOperators = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/operators`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      operatorsCount.textContent = data.length;

      console.log("Operators:");
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  getOperators();
}

if (requireAdmin()) {
  wireStaticNav();
  bootstrapAdminDashboard();
}
