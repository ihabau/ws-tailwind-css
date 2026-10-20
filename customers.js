// Customers page requests:
//   GET /api/v1/customers                 -> #customer-list
//   GET /api/v1/customers/{id}            -> #customer-by-id-form
//   GET /api/v1/customers/email/{email}   -> #customer-by-email-form
//   PUT /api/v1/customers/{id}/profile { address, phoneNumber, preferences } -> #profile-form

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

const customerRow = (customer) => `
  <tr class="transition hover:bg-slate-50">
    <td class="px-6 py-4 text-slate-400">${customer.id}</td>
    <td class="px-6 py-4 font-semibold text-slate-900">${customer.firstName}</td>
    <td class="px-6 py-4 text-slate-700">${customer.lastName}</td>
    <td class="px-6 py-4 text-slate-500">${customer.email}</td>
  </tr>`;

function bootstrapCustomers() {
  const customerList = document.getElementById("customer-list");
  const customersStatus = document.getElementById("customers-status");
  const byIdForm = document.getElementById("customer-by-id-form");
  const byIdStatus = document.getElementById("customer-by-id-status");
  const byEmailForm = document.getElementById("customer-by-email-form");
  const byEmailStatus = document.getElementById("customer-by-email-status");
  const profileForm = document.getElementById("profile-form");
  const profileStatus = document.getElementById("profile-status");

  async function loadCustomers() {
    customersStatus.textContent = "Loading customers...";
    try {
      const { data } = await axios.get(`${API_BASE_URL}/customers`, { headers: authHeaders() });
      customerList.innerHTML = data.length
        ? data.map(customerRow).join("")
        : `<tr><td colspan="4" class="px-6 py-4 text-slate-500">No customers found</td></tr>`;
      customersStatus.textContent = `${data.length} customer(s)`;
    } catch (error) {
      customersStatus.textContent = `Could not load customers: ${describeError(error)}`;
    }
  }

  byIdForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("customer-id").value;

    byIdStatus.textContent = "Loading...";
    try {
      const { data } = await axios.get(`${API_BASE_URL}/customers/${id}`, { headers: authHeaders() });
      byIdStatus.textContent = `#${data.id} ${data.firstName} ${data.lastName} - ${data.email}`;
    } catch (error) {
      byIdStatus.textContent = `Not found: ${describeError(error)}`;
    }
  });

  byEmailForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("customer-email-search").value.trim();

    byEmailStatus.textContent = "Loading...";
    try {
      const { data } = await axios.get(`${API_BASE_URL}/customers/email/${encodeURIComponent(email)}`, {
        headers: authHeaders(),
      });
      byEmailStatus.textContent = `#${data.id} ${data.firstName} ${data.lastName} - ${data.email}`;
    } catch (error) {
      byEmailStatus.textContent = `Not found: ${describeError(error)}`;
    }
  });

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("profile-customer-id").value;
    const body = {
      address: document.getElementById("profile-address").value.trim(),
      phoneNumber: document.getElementById("profile-phone").value.trim(),
      preferences: document.getElementById("profile-preferences").value.trim(),
    };

    profileStatus.textContent = "Saving...";
    try {
      await axios.put(`${API_BASE_URL}/customers/${id}/profile`, body, { headers: authHeaders() });
      profileStatus.textContent = `Profile for customer #${id} updated.`;
    } catch (error) {
      profileStatus.textContent = `Could not update profile: ${describeError(error)}`;
    }
  });

  loadCustomers();
}

if (requireLogin()) {
  wireStaticNav();
  bootstrapCustomers();
}
