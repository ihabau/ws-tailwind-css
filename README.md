![Lexicon Logo](https://lexicongruppen.se/media/wi5hphtd/lexicon-logo.svg)

# Tailwind CSS Workshop - Landing Page

This workshop's landing page is for last week's project **lexicon-ws-subscription-platform** (the Spring API in `school/lexicon/java/workshops/lexicon-ws-subscription-platform`).

The **navbar is already styled with Tailwind** and serves as your worked example. Every other section is plain, unstyled HTML - your job is to add Tailwind utility classes to them. `main.js` contains the API calls: **GET** for data (Plans, Operators) and **POST** for auth (Log in / Sign up).

## Setup

The project uses the **Tailwind Play CDN**, so no build step is needed for the workshop.

```bash
npm install   # once
npm run dev   # serves the folder at http://localhost:3000
```

The API runs separately on `http://localhost:8080` - start it later (`mvn spring-boot:run` in `subscription-api/`). CORS already allows `localhost:3000`. Until the API is up (or when it returns 401 - most GET endpoints need a JWT), the Plans/Operators sections show a status message instead of data.

> The CDN is for learning/prototyping only. For production you would install Tailwind via the CLI, Vite or PostCSS so unused CSS gets purged.

## Checklist

Work through the list before you call the page done.

- [x] Navbar with brand, nav links, login and signup buttons (Tailwind - done, use as reference)
- [ ] Hero section with headline, pitch and a call-to-action button - styled with Tailwind
- [ ] Feature/card section using **grid** or **flex**
- [ ] Plans and Operators sections styled around the data from the GET calls
- [ ] Consistent color palette (pick a hue and use its 50-950 shades)
- [ ] Consistent spacing (stick to the `p-*` / `m-*` / `gap-*` scale)
- [ ] Typography hierarchy (clear difference between h1, h2, body, muted text)
- [ ] Responsive at every breakpoint (`sm:`, `md:`, `lg:`) - tested on a phone width
- [ ] Hover/focus states on interactive elements (`hover:`, `focus:`)
- [ ] Footer with links and copyright
- [ ] Login and signup forms styled (wired to `POST /auth/login` and `POST /auth/register`)
- [ ] Admin dashboard styled (all plans + customers, visible for an `ADMIN` token)
- [ ] No custom CSS written - only Tailwind utilities
- [ ] API calls used correctly: **GET** for data (plans, subscriptions, operators, admin data), **POST** only for auth (login/register)

## Useful references

- `tailwind-classes.md` - every Tailwind class used in the navbar, with examples and explanations (git-ignored, local study notes)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Tailwind Play](https://play.tailwindcss.com/) - online playground
- [Wireframing Guide (Figma)](https://www.figma.com/resource-library/what-is-wireframing/)

---

## JavaScript Workshop Coverage

This project demonstrates the core JavaScript concepts from the workshop:

- [x] **Dynamic DOM manipulation** - All pages render data dynamically using template literals and DOM updates (`plans.js`, `operators.js`, `customers.js`, `subscriptions.js`, dashboards)
- [x] **Event handling** - Forms, buttons, search inputs with `click`, `submit`, `input`, `change` events
- [x] **Array methods** - Heavy use of `map()`, `filter()`, `find()` for rendering and searching
- [x] **API calls with axios** - GET/POST/PUT requests to REST API with authentication headers
- [x] **localStorage** - Token persistence (`accessToken`) and session management
- [x] **Template literals** - Dynamic HTML generation throughout scripts
- [x] **Functions & modular code** - Separate script files per page/feature
- [x] **Error handling** - Try/catch with user-friendly error messages
- [x] **Form validation & submission** - Login, register, profile updates
- [x] **Filtering & searching** - Real-time filtering on customers page (case-insensitive), search by different criteria
- [x] **Authentication flow** - JWT token handling, role-based access control, guards

### Additional Features Implemented
- [x] Role-based UI (admin/user dashboards, conditional rendering)
- [x] Route guards preventing unauthorized access
- [x] Modal overlays for login/register
- [x] Loading states and empty states
- [x] Responsive design with Tailwind CSS
- [x] Profile management with ownership controls

*Note:* The original JS workshop focused on an e-commerce product catalog with cart functionality. Our telecom subscription platform covers equivalent JavaScript concepts in a different domain (API integration, authentication, role-based access). All core JS skills (DOM manipulation, events, arrays, async API calls, localStorage) are demonstrated.
