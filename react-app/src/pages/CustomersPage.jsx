import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { SimpleFooter } from "../components/Footer";
import { useAuth } from "../components/AuthContext";
import { API_BASE_URL, authHeaders, describeError } from "../lib/api";

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

export default function CustomersPage() {
  const { admin, session } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [listLoaded, setListLoaded] = useState(false);
  const [status, setStatus] = useState("");
  const [loadButtonText, setLoadButtonText] = useState("Load!");
  const [searchType, setSearchType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [profileCustomerId, setProfileCustomerId] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preferences, setPreferences] = useState("");
  const [profileStatus, setProfileStatus] = useState("");

  useEffect(() => {
    const setupProfileAccess = async () => {
      if (!session?.sub) return;

      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/customers/email/${encodeURIComponent(session.sub)}`,
          { headers: authHeaders() },
        );
        setCurrentUser(data);

        if (!admin) {
          setProfileCustomerId(String(data.id));
          setProfileStatus("You can only update your own profile.");
        } else {
          setProfileStatus("Admin: you can update any customer's profile.");
        }
      } catch {
        return;
      }
    };

    setupProfileAccess();
  }, [admin, session]);

  const loadCustomers = async () => {
    setLoadButtonText("Loading...");
    setStatus("0 customer(s)");
    setCustomerList([]);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/customers`, {
        headers: authHeaders(),
      });
      setCustomers(data);
      setCustomerList(data);
      setListLoaded(true);
      setLoadButtonText("Loading completed");
    } catch (error) {
      setStatus(`Could not load customers: ${describeError(error)}`);
    }
  };

  const getById = async (id) => {
    const { data } = await axios.get(`${API_BASE_URL}/customers/${id}`, {
      headers: authHeaders(),
    });
    return data;
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const value = searchValue.trim().toLowerCase();

    if (customers.length === 0 && searchType === "id") {
      setStatus("Loading...");
      try {
        const customer = await getById(Number(value));
        const matchingCustomers = customer ? [customer] : [];
        setCustomerList(matchingCustomers);
        setStatus(`${matchingCustomers.length} customer(s)`);
      } catch (error) {
        setCustomerList([]);
        setStatus(`Not found: ${describeError(error)}`);
      }
      return;
    }

    if (!listLoaded) {
      setStatus(
        "Load all customers first to search by email, first or last name.",
      );
      return;
    }

    const matchingCustomers = customers.filter((customer) => {
      switch (searchType) {
        case "":
          return true;
        case "id":
          return customer.id === Number(value);
        case "email":
          return customer.email.toLowerCase().includes(value);
        case "firstName":
          return customer.firstName.toLowerCase().includes(value);
        case "lastName":
          return customer.lastName.toLowerCase().includes(value);
        default:
          return false;
      }
    });

    setCustomerList(matchingCustomers);
    setStatus(`${matchingCustomers.length} customer(s)`);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    let id = profileCustomerId;
    if (!admin && currentUser) {
      id = currentUser.id;
      setProfileCustomerId(String(id));
    }

    const body = {
      address: address.trim(),
      phoneNumber: phoneNumber.trim(),
      preferences: preferences.trim(),
    };

    setProfileStatus("Saving...");
    try {
      await axios.put(`${API_BASE_URL}/customers/${id}/profile`, body, {
        headers: authHeaders(),
      });
      setProfileStatus(`Profile for customer #${id} updated.`);
    } catch (error) {
      setProfileStatus(
        `Could not update profile: ${describeError(error)}`,
      );
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <section
          id="all-customers"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Customers
          </h1>
          <p className="mb-10 text-slate-500">Show all customers.</p>

          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              id="load-customers-btn"
              type="button"
              onClick={loadCustomers}
              className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {loadButtonText}
            </button>

            <form
              className="flex items-center gap-2"
              id="customer-search-form"
              onSubmit={handleSearch}
            >
              <input
                id="search-type"
                name="searchType"
                type="text"
                required
                placeholder="Search..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                id="customer-search-btn"
                type="submit"
                className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Search
              </button>
              <select
                id="customer-value-type"
                name="valueType"
                value={searchType}
                onChange={(event) => setSearchType(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option
                  value=""
                  disabled={!listLoaded}
                  className={listLoaded ? "" : "text-slate-400"}
                >
                  All
                </option>
                <option value="id">Id</option>
                <option
                  value="email"
                  disabled={!listLoaded}
                  className={listLoaded ? "" : "text-slate-400"}
                >
                  Email
                </option>
                <option
                  value="firstName"
                  disabled={!listLoaded}
                  className={listLoaded ? "" : "text-slate-400"}
                >
                  First name
                </option>
                <option
                  value="lastName"
                  disabled={!listLoaded}
                  className={listLoaded ? "" : "text-slate-400"}
                >
                  Last name
                </option>
              </select>
            </form>
          </div>

          <p id="customers-status" className="mb-6 text-sm text-slate-500">
            {status}
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
                {customerList.length ? (
                  customerList.map((customer) => (
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

        <section
          id="customer-profile"
          className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Update profile
          </h2>
          <p className="mb-10 text-slate-500">
            PUT /customers/&#123;id&#125;/profile with address, phone number and
            preferences.
          </p>

          <form
            id="profile-form"
            onSubmit={handleProfileSubmit}
            className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-3"
          >
            <div>
              <label
                htmlFor="profile-customer-id"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Customer id
              </label>
              <input
                id="profile-customer-id"
                name="id"
                required
                placeholder="2"
                readOnly={!admin}
                value={profileCustomerId}
                onChange={(event) => setProfileCustomerId(event.target.value)}
                className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  !admin ? "cursor-not-allowed bg-slate-100" : "bg-white"
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="profile-address"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Address
              </label>
              <input
                id="profile-address"
                name="address"
                type="text"
                placeholder="Main Street 1"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Phone number
              </label>
              <input
                id="profile-phone"
                name="phoneNumber"
                type="text"
                placeholder="070-1234567"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label
                htmlFor="profile-preferences"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Preferences
              </label>
              <input
                id="profile-preferences"
                name="preferences"
                type="text"
                placeholder="Paperless billing"
                value={preferences}
                onChange={(event) => setPreferences(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Save profile
              </button>
            </div>
          </form>

          <p id="profile-status" className="mt-4 text-sm text-slate-500">
            {profileStatus}
          </p>
        </section>
      </main>

      <SimpleFooter />
    </>
  );
}
