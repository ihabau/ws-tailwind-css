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

## Weekly reflection

### What you have learned this week

This week focused on **utility-first styling with Tailwind CSS**. Instead of writing custom CSS in separate files, I learned to compose small
single-purpose utility classes (`px-4`, `bg-blue-500`, `rounded-lg`) directly in the markup, using fixed spacing and color scales to keep the design consistent. I also learned the mobile-first responsive approach with `sm:`/`md:`/`lg:` breakpoints, and when to reach for Flexbox versus Grid when laying out a page. Finally, I understood that the CDN is only for prototyping and that real production builds bundle Tailwind and strip unused CSS.

### Key tasks worked on this week

This week I read the workshop brief and the Tailwind CSS presentation, covering what utility-first CSS is, the install methods, and how a Tailwind button compares to a traditional CSS one. I practiced the core utility groups - colors and shades, spacing with direction modifiers, typography, and the Flexbox and Grid layout classes. I also set up the teaching environment with an `index.html` skeleton that has commented section goals and tip comments plus a local dev server. The main task has been building the landing page for lexicon-ws-subscription-platform - a styled navbar as the worked example, and plain HTML skeleton sections for the rest - with API calls that pull live plans and operators (GET) and log the user in (POST), which the checklist above tracks.
