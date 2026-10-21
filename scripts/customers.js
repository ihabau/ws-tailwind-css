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
  const profileForm = document.getElementById("profile-form");
  const profileStatus = document.getElementById("profile-status");
  const loadCustomersBtn = document.getElementById("load-customers-btn");
  const customerSearchForm = document.getElementById("customer-search-form");
  const profileCustomerId = document.getElementById("profile-customer-id");

  let customers = [];
  let listLoaded = false;
  let currentUser = null;

  const searchTypeSelect = document.getElementById("customer-value-type");

  // Options that only work once the full list is loaded.
  const listOnlyOptions = ["", "email", "firstName", "lastName"];
  const setListOnlyEnabled = (enabled) => {
    listOnlyOptions.forEach((value) => {
      const option = searchTypeSelect.querySelector(`option[value="${value}"]`);
      if (option) {
        option.disabled = !enabled;
        option.classList.toggle("text-slate-400", !enabled);
      }
    });
  };

  setListOnlyEnabled(false);

  // Lock profile form for non-admins to only edit their own profile
  const setupProfileAccess = async () => {
    try {
      const session = getSession();
      if (!session || !session.sub) return;

      const admin = isAdmin();

      const { data } = await axios.get(`${API_BASE_URL}/customers/email/${encodeURIComponent(session.sub)}`, {
        headers: authHeaders(),
      });
      currentUser = data;

      if (!admin && profileCustomerId) {
        profileCustomerId.value = data.id;
        profileCustomerId.readOnly = true;
        profileCustomerId.classList.add("bg-slate-100", "cursor-not-allowed");
        profileStatus.textContent = "You can only update your own profile.";
      } else if (admin && profileStatus) {
        profileStatus.textContent = "Admin: you can update any customer's profile.";
      }
    } catch (error) {
      console.error(error);
    }
  };

  setupProfileAccess();

  loadCustomersBtn.addEventListener("click", async () => {
    loadCustomersBtn.textContent = "Loading...";
    customersStatus.textContent = "0 customer(s)";
    customerList.innerHTML = "";
    try {
      const { data } = await axios.get(`${API_BASE_URL}/customers`, {
        headers: authHeaders(),
      });
      customers = data;
      listLoaded = true;
      setListOnlyEnabled(true);
      loadCustomersBtn.textContent = "Loading completed";
    } catch (error) {
      customersStatus.textContent = `Could not load customers: ${describeError(error)}`;
    }
  });

  customerSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchType = document.getElementById("customer-value-type").value;
    const searchValue = document
      .getElementById("search-type")
      .value.trim()
      .toLowerCase();

    // Id always uses its own endpoint.
    if (customers.length === 0 && searchType === "id") {
      customersStatus.textContent = "Loading...";
      try {
        const customer = await getById(Number(searchValue));
        const matchingCustomers = customer ? [customer] : [];
        customerList.innerHTML = matchingCustomers.length
          ? matchingCustomers.map(customerRow).join("")
          : `<tr><td colspan="4" class="px-6 py-4 text-slate-500">No customers found</td></tr>`;
        customersStatus.textContent = `${matchingCustomers.length} customer(s)`;
      } catch (error) {
        customerList.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-slate-500">No customers found</td></tr>`;
        customersStatus.textContent = `Not found: ${describeError(error)}`;
      }
      return;
    }

    // Everything else filters the loaded list.
    if (!listLoaded) {
      customersStatus.textContent =
        "Load all customers first to search by email, first or last name.";
      return;
    }

    const matchingCustomers = customers.filter((customer) => {
      switch (searchType) {
        case "":
          return true;
        case "id":
          return customer.id === Number(searchValue);
        case "email":
          return customer.email.toLowerCase().includes(searchValue);

        case "firstName":
          return customer.firstName.toLowerCase().includes(searchValue);

        case "lastName":
          return customer.lastName.toLowerCase().includes(searchValue);

        default:
          return false;
      }
    });

    customerList.innerHTML = matchingCustomers.length
      ? matchingCustomers.map(customerRow).join("")
      : `<tr><td colspan="4" class="px-6 py-4 text-slate-500">No customers found</td></tr>`;
    customersStatus.textContent = `${matchingCustomers.length} customer(s)`;
  });

  const getById = async (id) => {
    const { data } = await axios.get(`${API_BASE_URL}/customers/${id}`, {
      headers: authHeaders(),
    });
    console.log(data);
    return data;
  };

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const admin = isAdmin();
    let id = document.getElementById("profile-customer-id").value;

    if (!admin && currentUser) {
      id = currentUser.id;
      document.getElementById("profile-customer-id").value = id;
    }

    const body = {
      address: document.getElementById("profile-address").value.trim(),
      phoneNumber: document.getElementById("profile-phone").value.trim(),
      preferences: document.getElementById("profile-preferences").value.trim(),
    };

    profileStatus.textContent = "Saving...";
    try {
      await axios.put(`${API_BASE_URL}/customers/${id}/profile`, body, {
        headers: authHeaders(),
      });
      console.log(body);
      profileStatus.textContent = `Profile for customer #${id} updated.`;
    } catch (error) {
      console.error(error);
      profileStatus.textContent = `Could not update profile: ${describeError(error)}`;
    }
  });

  //loadCustomers();
}

if (requireLogin()) {
  wireStaticNav();
  bootstrapCustomers();
}
