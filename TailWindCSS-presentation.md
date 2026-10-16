---

## Resources & References![Lexicon Logo](https://lexicongruppen.se/media/wi5hphtd/lexicon-logo.svg)

# Tailwind CSS Presentation

## Table of Contents

1. Introduction to Tailwind CSS
    - What is Tailwind CSS?
    - Why use Tailwind?
2. Getting Started with Tailwind
3. Traditional CSS vs. Tailwind CSS
4. Tailwind CSS Common Components

## 1. Introduction to Tailwind CSS

### What is Tailwind CSS?

**Tailwind CSS** is a **utility-first CSS framework** that provides small, reusable utility classes to style elements directly in your HTML.

Instead of writing custom CSS for every component, Tailwind lets you apply pre-built classes such as `flex`, `pt-4`, `text-center`, and `rotate-90` to control layout, spacing, typography, and transformations.

By combining these utility classes, developers can quickly build custom designs **directly in their markup without writing much CSS**.

- **Utility-First Architecture**: Instead of pre-designed components, it provides low-level utility classes.
- **Customizable**: You can easily customize colors, spacing, and more via a configuration file.
- **Modern Features**: Built-in support for responsive design, dark mode, and hover/active states.

**Note**: "Pre-built components" are ready-made UI elements whose styling is already decided for you, such as buttons, cards, navbars, and modals. In frameworks like Bootstrap, you often use a predefined class structure and get a default design immediately.

```html
<button class="btn btn-primary">Save</button>
```

Tailwind works differently. Instead of giving you fully designed components, it gives you low-level utility classes where each class does one small job, such as `p-4` for padding, `bg-blue-500` for background color, `text-white` for text color, `rounded-lg` for rounded corners, and `flex` for flex layout.

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded-lg">Save</button>
```

> Tailwind does not hand you finished UI blocks. It gives you small styling tools that you combine to build your own custom components.

### Why use Tailwind?

1. **Speed of Development**: Build custom UIs without ever leaving your HTML. No more switching between files to change a single margin.
2. **No Inventing Class Names**: You don't have to worry about naming things like `wrapper-outer-inner-v2`. Use standard utility names.
3. **Consistency**: Using a fixed design system (pre-defined scales for colors/spacing) ensures a more consistent UI.
4. **Maintainability**: CSS is local to the HTML. Deleting a component deletes its styles automatically, preventing "CSS bloat" over time.
5. **Small Production Bundles**: Tailwind automatically removes all unused CSS in the production build, resulting in tiny CSS files.

## 2. Getting Started with Tailwind

There are several ways to install Tailwind CSS, depending on your project type and preferred build tools. For a detailed guide on each method, visit the [official Tailwind CSS Installation Documentation](https://tailwindcss.com/docs/installation).

### Installation Types

1. **Tailwind CLI**: The simplest way to get Tailwind CSS up and running from scratch.
2. **Using Vite**: Recommended for modern web apps using build tools.
3. **Using PostCSS**: Best for projects with existing PostCSS pipelines.
4. **Framework Guides**: Optimized setup guides for Next.js, Nuxt, SvelteKit, and more.

### Play CDN (Easiest for Learning)

Perfect for quick prototyping, demos, or learning without any installation.

**How to use:**
Add this script to your `<head>`:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

> **Note**: The CDN is only for development/prototyping. For production, use one of the build tool methods above for performance and optimization.

---

## 3. Traditional CSS vs. Tailwind CSS

Before we dive into the specific utilities, let's compare the traditional CSS approach with the Tailwind CSS approach using a simple button example.

### Traditional CSS Approach

**HTML:**

```html
<button class="btn">Click Me</button>
```

**CSS:**

```css
.btn {
  background-color: #3b82f6; /* blue-500 */
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background-color: #2563eb; /* blue-600 */
}
```

### Tailwind CSS Approach

**HTML:**

```html
<button
  class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
>
  Click Me
</button>
```

---

## 4. Tailwind CSS Common Components

Tailwind CSS provides a wide range of utility classes that can be combined to build any design. Let's explore some of the most commonly used components and utilities.

### 1. Container & Breakpoints

The `container` class sets the `max-width` of an element to match the current breakpoint's `min-width`. It's often used with `mx-auto` to center content.

Tailwind uses **mobile-first** breakpoints:

- **Default**: `0px` (styles apply to all sizes)
- **sm**: `640px`
- **md**: `768px`
- **lg**: `1024px`
- **xl**: `1280px`
- **2xl**: `1536px`

**Example:**

```html
<div class="container">
  <!-- Content is centered and has responsive padding -->
</div>
```

### 2. Colors

In **Tailwind CSS**, colors are applied using **utility classes** instead of writing custom CSS rules. Tailwind provides a **large predefined color palette** with various hues like **Slate, Gray, Red, Blue, Emerald, and Amber**. Each color includes a numeric scale ranging from **50 (lightest) to 950 (darkest)**.

#### The Shade Scale

These numbers represent the intensity and brightness of the color:

- **50-100**: Very light shades, perfect for backgrounds or subtle highlights.
- **200-400**: Light to medium shades, often used for borders or secondary text.
- **500**: The **standard "base" color**, typically used for primary actions.
- **600-800**: Darker shades, ideal for high-contrast elements and hover states.
- **900-950**: Very dark shades, suitable for deep backgrounds or nearly-black text.

#### Color Utilities

You can apply colors to various properties using specific prefixes:

- `text-{color}-{shade}` -> Sets the **text color**.
- `bg-{color}-{shade}` -> Sets the **background color**.
- `border-{color}-{shade}` -> Sets the **border color**.
- `ring-{color}-{shade}` -> Sets the **focus ring color**.
- `divide-{color}-{shade}` -> Sets the **border color between elements** in a list.

#### Opacity (Transparency)

You can easily control transparency by adding a forward slash `/` followed by an opacity value (0-100) after any color class:

- `bg-blue-500/50` -> Blue background with **50% opacity**.
- `text-slate-800/25` -> Slate text with **25% opacity**.

This utility-based approach ensures **design consistency** across your project by using a fixed set of professional colors.

Common color utilities:

- `bg-*` -> background color
- `text-*` -> text color
- `border-*` -> border color
- `/*` -> opacity (transparency)

Example:

```html
<!-- Background and Text Color -->
<div class="bg-blue-500 text-white p-4 rounded-lg font-bold text-center">
  Blue background with white text
</div>

<!-- Border Colors -->
<div
  class="bg-emerald-100 text-emerald-800 border-2 border-emerald-600 p-4 rounded-lg text-center"
>
  Green background with a darker green border
</div>

<!-- Color Opacity -->
<div
  class="bg-amber-500/30 text-amber-900 border border-amber-500 p-4 rounded-lg text-center"
>
  Background with 30% opacity
</div>
```

Explanation:

- `bg-blue-500` -> blue background (shade 500)
- `text-white` -> white text
- `border-emerald-600` -> border color (shade 600)
- `bg-amber-500/30` -> background with 30% transparency
- `font-bold` -> bold text
- `text-center` -> centers text inside the element

---

### 3. Spacing (Margin & Padding)

In **Tailwind CSS**, spacing controls the **distance inside and outside elements**. It is mainly managed using **padding** and **margin** utility classes.

- **Padding (`p`)** -> controls the space **inside** an element, between the content and its border.
- **Margin (`m`)** -> controls the space **outside** an element, creating distance between elements.

Tailwind uses a **rem-based spacing scale** where each step increases the amount of space. By default:

**1 unit = 0.25rem (4px)**

Common values include `0`, `1`, `2`, `3`, `4`, `6`, `8`, `10`, `12`, etc.

#### Direction Modifiers

To apply spacing to specific sides, use the following direction modifiers:

- **t**: top (`pt-4`, `mt-4`)
- **b**: bottom (`pb-4`, `mb-4`)
- **l**: left (`pl-4`, `ml-4`)
- **r**: right (`pr-4`, `mr-4`)
- **x**: horizontal (left & right) (`px-4`, `mx-4`)
- **y**: vertical (top & bottom) (`py-4`, `my-4`)

#### Understanding the Scale

Examples of the spacing scale:

- `p-1` = 0.25rem (4px)
- `p-4` = 1rem (16px)
- `p-12` = 3rem (48px)

Common spacing utilities:

| Class     | Meaning                          |
| :-------- | :------------------------------- |
| `m-4`     | margin on all sides              |
| `mt-4`    | margin on top                    |
| `mx-4`    | margin left & right (horizontal) |
| `mx-auto` | center element horizontally      |
| `p-4`     | padding on all sides             |
| `py-4`    | padding top & bottom (vertical)  |

---

### 4. Utility Classes (Typography, Shadows, Rounding)

Tailwind CSS provides many **utility classes** to style elements quickly without writing custom CSS.
Common utilities include **typography**, **shadows**, and **border rounding**.

#### Typography

Typography utilities control text appearance such as size, weight, and alignment.

Examples:

- `text-lg` -> larger text
- `font-bold` -> bold text
- `text-center` -> center-aligned text

#### Shadows

Shadow utilities add depth to elements using box shadows.

Examples:

- `shadow-sm` -> small shadow
- `shadow-md` -> medium shadow
- `shadow-lg` -> large shadow

#### Rounding

Rounding utilities control the **border radius** of elements.

Examples:

- `rounded` -> small rounded corners
- `rounded-md` -> medium rounding
- `rounded-full` -> fully rounded (circle)

---

### 5. Flexbox

In **Tailwind CSS**, Flexbox is used to create flexible layouts that
align and distribute items inside a container.

To enable Flexbox, apply the `flex` class to the parent element.

```html
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

#### Flex Direction

Controls the direction of the flex items.

- `flex-row` -> horizontal layout (default)
- `flex-col` -> vertical layout
- `flex-row-reverse` -> horizontal reversed
- `flex-col-reverse` -> vertical reversed

Example:

```html
<div class="flex flex-col">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

#### Justify Content

Controls how items are distributed along the **main axis**.

- `justify-start`
- `justify-center`
- `justify-end`
- `justify-between`
- `justify-around`
- `justify-evenly`

Example:

```html
<div class="flex justify-center">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

#### Align Items

Controls alignment on the **cross axis**.

- `items-start`
- `items-center`
- `items-end`
- `items-stretch`
- `items-baseline`

Example:

```html
<div class="flex items-center h-32">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

#### Gap Between Items

Adds spacing between items.

- `gap-2`
- `gap-4`
- `gap-8`

Example:

```html
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

### 6. Grid

**CSS Grid** in Tailwind is used to create **two-dimensional layouts**
(rows and columns).

To enable grid layout, use the `grid` utility.

```html
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

#### Grid Columns

Defines how many columns exist in the grid.

- `grid-cols-1`
- `grid-cols-2`
- `grid-cols-3`
- `grid-cols-4`

Example:

```html
<div class="grid grid-cols-2 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

#### Grid Column Span

Controls how many columns an element spans.

- `col-span-1`
- `col-span-2`
- `col-span-3`

Example:

```html
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-2">Wide Item</div>
  <div>Item</div>
</div>
```

#### Grid Rows

Controls row layout.

- `grid-rows-1`
- `grid-rows-2`
- `grid-rows-3`

Example:

```html
<div class="grid grid-rows-2 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

### Flexbox vs Grid

Both **Flexbox** and **Grid** are layout systems in CSS, but they are used for different purposes.

| Feature     | Flexbox                  | Grid                     |
| :---------- | :----------------------- | :----------------------- |
| Layout Type | One-dimensional          | Two-dimensional          |
| Direction   | Row OR Column            | Rows AND Columns         |
| Best For    | Aligning items in a line | Complex layouts          |
| Control     | Item alignment           | Full page layout control |

**When to use Flexbox:**

- Navigation bars
- Buttons in a row
- Centering content
- Small component layouts

**When to use Grid:**

- Page layouts
- Dashboards
- Galleries
- Complex responsive layouts

- **[Wireframing Guide (Figma)](https://www.figma.com/resource-library/what-is-wireframing/)** - Learn what wireframing is and why it matters in the design process.
- **[Justinmind Wireframing Guide](https://www.justinmind.com/wireframe)** - Overview of wireframing concepts, examples, and best practices.
- **[Tailwind CSS Documentation](https://tailwindcss.com/)** - Official docs with the full utility class reference and examples.
- **[Tailwind Play](https://play.tailwindcss.com/)** - Online playground to test Tailwind CSS directly in your browser.
