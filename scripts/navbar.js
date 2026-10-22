// Shared navbar component.
// Renders the site header into <div id="site-header"></div> so every page
// uses the exact same markup. Identify the page with <body data-page="...">.
// Load BEFORE main.js / guard.js, which populate the auth area.

const NAV_ITEMS = [
  { key: "home", label: "Home", homeHref: "#", href: "index.html" },
  {
    key: "dashboard",
    label: "Dashboard",
    href: "user-dashboard.html",
    authOnly: true,
  },
  { key: "plans", label: "Plans", homeHref: "#plans", href: "plans.html" },
  {
    key: "operators",
    label: "Operators",
    homeHref: "#operators",
    href: "operators.html",
  },
  {
    key: "subscriptions",
    label: "Subscriptions",
    homeHref: "#subscriptions",
    href: "subscriptions.html",
  },
  {
    key: "customers",
    label: "Customers",
    href: "customers.html",
    subOnly: true,
  },
  { key: "contact", label: "Contact", homeHref: "#contact", homeOnly: true },
];

const ICON_CHEVRON =
  '<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>';

const buttonClass =
  "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

const menuClass =
  "hidden absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl";

const menuItemClass =
  "block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";

function renderNavLinks(currentPage) {
  const isHome = currentPage === "home";

  return NAV_ITEMS.filter((item) => {
    if (item.homeOnly && !isHome) return false;
    if (item.subOnly && isHome) return false;
    return true;
  })
    .map((item) => {
      const href = isHome ? item.homeHref : item.href;
      const active = currentPage === item.key;
      const id =
        item.key === "dashboard"
          ? ' id="dashboard-link" data-nav-dashboard'
          : "";
      const extra = item.authOnly && !active ? " hidden" : "";
      return `<a${id} href="${href}" class="rounded px-1${extra} transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500${
        active ? " text-slate-900" : ""
      }">${item.label}</a>`;
    })
    .join("\n        ");
}

function renderMobileAuth() {
  const loginHref =
    document.body.dataset.page === "home" ? "#login" : "index.html#login";
  const loginClass =
    document.body.dataset.page === "home" ? "js-open-login block" : "block";

  return `
        <div data-nav-login class="flex w-full flex-col items-center border-t border-slate-200 pt-2 lg:hidden">
          <a href="${loginHref}" class="${loginClass} ${buttonClass} w-4/5 text-center">Log in</a>
        </div>

        <div data-nav-user class="hidden w-full flex flex-col items-center gap-2 border-t border-slate-200 pt-2 lg:hidden">
          <p class="px-1 text-xs text-slate-500">Signed in as <span data-nav-username class="font-semibold text-slate-900"></span></p>
          <button type="button" data-nav-logout class="${buttonClass} w-4/5 text-center">Log out</button>
        </div>`;
}

function renderDesktopAuth(isHome) {
  if (isHome) {
    return `
      <div id="nav-auth" class="relative max-lg:hidden lg:block">
        <button type="button" id="login-menu-btn" class="flex items-center gap-2 ${buttonClass}">
          Login
          ${ICON_CHEVRON}
        </button>
        <div id="login-menu" class="${menuClass}">
          <a href="#login" id="signin-link" class="${menuItemClass}">Sign in</a>
          <a href="#register" class="js-open-register ${menuItemClass}">Create account</a>
          <div class="my-2 border-t border-slate-200"></div>
          <a href="/forgot-password" class="block rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">Forgot password?</a>
        </div>
      </div>

      <div id="nav-user" class="max-lg:hidden items-center gap-3 lg:hidden">
        <span class="text-sm text-slate-500">Signed in as</span>
        <span id="nav-username" class="text-sm font-semibold text-slate-900"></span>
        <button type="button" id="logout-btn" class="${buttonClass}">Log out</button>
      </div>`;
  }

  return `
      <button type="button" data-nav-logout-desktop class="hidden lg:block ${buttonClass}">Log out</button>`;
}

function renderNavbar() {
  const host = document.getElementById("site-header");
  if (!host) return;

  const currentPage = document.body.dataset.page || "";
  const isHome = currentPage === "home";
  const brandHref = isHome ? "#" : "index.html";

  host.innerHTML = `
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white">
    <div class="relative mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
      <a href="${brandHref}" class="rounded text-xl font-bold tracking-tight text-slate-900 transition hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        Lexicon Telecom
        <span data-nav-role class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600"></span>
      </a>

      <nav id="mobile-menu" class="absolute right-0 top-16 hidden w-56 flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-2 text-sm font-medium text-slate-600 shadow-xl lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        ${renderNavLinks(currentPage)}
        ${renderMobileAuth()}
      </nav>

      <button id="menu-button" class="${buttonClass} lg:hidden">MENU</button>
      ${renderDesktopAuth(isHome)}
    </div>
  </header>`;
}

renderNavbar();
