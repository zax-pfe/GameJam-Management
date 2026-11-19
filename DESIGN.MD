---
version: "1.0"
name: "Blueprint Ops — Game Project Manager"
description: "Design system for a single-project web app (Kanban, calendar, dashboard, resource hub) used daily by a game development team. Dark blueprint aesthetic: deep navy surfaces, hairline white rules, monospace data, mechanical details used with restraint. Dark theme only. AI-ready."

colors:
  # Surfaces (darkest to lightest)
  canvas: "#0B1E33"
  surface: "#0F2842"
  surface-raised: "#15365A"
  primary: "#1C4E80"
  # Text
  text: "#F5F8FC"
  text-muted: "#A9BDD3"
  text-subtle: "#8CA3BC"
  # Interactive accent
  accent: "#E85D35"
  accent-hover: "#F06F49"
  accent-text: "#FF7A52"
  on-accent: "#0B1E33"
  # Decorative only (dimension lines, drop guides). Never a status.
  guide: "#FFD700"
  # Lines and overlays
  line: "rgba(255,255,255,0.16)"
  line-strong: "rgba(255,255,255,0.40)"
  grid: "rgba(255,255,255,0.06)"
  hover-overlay: "rgba(255,255,255,0.06)"
  active-overlay: "rgba(255,255,255,0.10)"
  # Feedback
  danger: "#FF7B7B"
  on-danger: "#0B1E33"
  # Ticket status
  status-todo: "#8FA8C4"
  status-in-progress: "#4DB8FF"
  status-done: "#3FD08A"
  # Ticket type
  type-design: "#C58AF9"
  type-development: "#4FD1C5"
  type-3d: "#FF8A7A"
  type-2d-art: "#FF8CC6"
  type-ui-ux: "#FFB547"
  type-audio: "#B5E061"
  type-other: "#9FB3C8"

typography:
  display:
    fontFamily: "IBM Plex Mono"
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.1
  h1:
    fontFamily: "IBM Plex Mono"
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.2
  h2:
    fontFamily: "IBM Plex Mono"
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.3
  h3:
    fontFamily: "IBM Plex Sans"
    fontSize: 0.9375rem
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "IBM Plex Sans"
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "IBM Plex Sans"
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Mono"
    fontSize: 0.75rem
    fontWeight: 500
    letterSpacing: 0.06em
    textTransform: uppercase
  data:
    fontFamily: "IBM Plex Mono"
    fontSize: 0.8125rem
    fontWeight: 500
    fontFeature: "tabular-nums"

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px

rounded:
  sm: 2px
  md: 4px
  lg: 6px
  full: 999px

components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "0 16px"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.text}"
    border: "1px solid {colors.line-strong}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "0 16px"
  card:
    backgroundColor: "{colors.surface-raised}"
    border: "1px solid {colors.line}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    border: "1px solid {colors.line-strong}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "0 12px"
  chip:
    height: 22px
    rounded: "{rounded.sm}"
    padding: "0 8px"
  sidebar:
    backgroundColor: "{colors.surface}"
    width: 240px
    widthCollapsed: 64px
  topbar:
    backgroundColor: "{colors.canvas}"
    height: 56px
---

## Overview

Game Project Manager is an internal tool for ONE game team, used every day to move tickets, check progress and find shared links. The look is a **blueprint**: deep navy surfaces, hairline white rules, monospace for data and labels, small mechanical details. It signals precision without getting in the way of work.

The golden rule: **structure over decoration.** The blueprint language lives in the frame (lines, ticks, labels, numbers). Data views (Kanban, calendar, forms) stay calm, dense and readable.

- Density: 7/10, compact
- Variance: 2/10, structured and predictable
- Motion: 3/10, functional feedback only (drag & drop, hover, panels)
- Theme: dark only (`color-scheme: dark`). No light theme in v1.
- UI language: labels for statuses, types and roles are in English, as in the spec (To Do, In Progress, Done, Game Designer...).

## Colors

Roles, not decoration. Every color has one job.

| Token                           | Hex                         | Role                                                                                         |
| ------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| canvas                          | #0B1E33                     | Page background, input background                                                            |
| surface                         | #0F2842                     | Sidebar, Kanban columns, calendar, panels                                                    |
| surface-raised                  | #15365A                     | Cards, menus, modals, slide-over                                                             |
| primary                         | #1C4E80                     | Brand blue: selected nav item, hero band, selected states. Always a fill, with `text` on top |
| text / text-muted / text-subtle | #F5F8FC / #A9BDD3 / #8CA3BC | Primary / secondary / metadata and placeholders                                              |
| accent                          | #E85D35                     | Primary actions only (one per view), active indicators                                       |
| accent-text                     | #FF7A52                     | Accent used as TEXT or icon on dark surfaces (links, small highlights)                       |
| guide                           | #FFD700                     | Decorative only: dimension lines, measurement ticks, drop guides while dragging              |
| danger                          | #FF7B7B                     | Errors and destructive actions                                                               |

**Status colors** (always paired with an icon and a label, never color alone):

- To Do `#8FA8C4`, icon `Circle`
- In Progress `#4DB8FF`, icon `CircleDot`
- Done `#3FD08A`, icon `CircleCheck`

**Task type colors** (always paired with an icon and a label):

- Design `#C58AF9` (`PenTool`), Development `#4FD1C5` (`Code`), 3D `#FF8A7A` (`Box`), 2D / Art `#FF8CC6` (`Brush`), UI/UX `#FFB547` (`MousePointerClick`), Audio `#B5E061` (`Music`), Other `#9FB3C8` (`Tag`)
- Use the closest equivalent icon if a name does not exist in the installed lucide-react version.

**Color usage rules**

- Status and type colors appear on the icon, a 3px left bar and a 1px border at 40% opacity. Text inside chips stays `text` or `text-muted` so contrast is guaranteed.
- Never use `guide` yellow for a status, a button or a text.
- Never put colored text on `primary`. On `primary`, use `text` only (not `text-muted`).
- Never use white text on `accent` (3.5:1, fails AA). Text on `accent` is `on-accent` (#0B1E33).
- No pure white (#FFFFFF) backgrounds. No gradients. No glows. Saturation of any accent capped at 80%.

**Verified contrast (WCAG)**

- `text` on canvas 15.8, surface 14.1, surface-raised 11.6, primary 8.0
- `text-muted` on surface-raised 6.4. `text-subtle` on surface-raised 4.7
- `on-accent` on `accent` 4.85. `accent-text` on surface-raised 4.8
- `line-strong` (input borders) against canvas / surface / surface-raised: 3.8 / 3.6 / 3.3 (meets 3:1 for UI components)
- `line` (1.6:1) is for decorative dividers only, never for the border of an interactive control

## Typography

Two families from the same superfamily, loaded as web fonts (never rely on Consolas or Monaco, they are not available everywhere):

- **IBM Plex Mono**: page titles, big numbers, labels, durations, dates, counters, chips. Gives the technical blueprint voice.
- **IBM Plex Sans**: ticket titles, descriptions, comments, form text. Long text must stay readable, so it is NOT monospace.

Fallbacks: mono `ui-monospace, "SF Mono", Menlo, Consolas, monospace`; sans `ui-sans-serif, system-ui, "Segoe UI", sans-serif`.

Scale (see tokens): display 2.5rem (dashboard % only), h1 1.5rem (page title), h2 1.125rem (section title), h3 0.9375rem (card title), body 0.9375rem / 1.5, body-sm 0.8125rem, label 0.75rem uppercase with letter-spacing 0.06em, data 0.8125rem with tabular numbers.

- Comments and descriptions: max 72ch per line.
- Numbers (counts, %, durations, dates) always use `data` or `display` with tabular numbers so columns align.
- No text below 12px.

## Layout

**App shell**

- Sidebar (left): 240px, collapses to a 64px icon rail between 768 and 1099px. Items: Dashboard, Tasks, Team, Project Hub.
- Topbar: 56px, page title (h1) on the left, primary action and user menu on the right.
- Page padding: 24px (16px on mobile).
- Content max-width: 1280px centered for Dashboard, Team and Project Hub. Tasks views use the full width.
- Mobile (< 768px): sidebar becomes a bottom tab bar (4 items, 56px, safe-area padding). Slide-over becomes a full-screen sheet. Modals become bottom sheets.
- Breakpoints: mobile < 768, tablet 768-1099, desktop >= 1100. No horizontal page overflow at any width (use `100dvh`, never `100vh`).

**Spacing:** 4px base unit. Scale: 4, 8, 12, 16, 24, 32, 48, 64. Cards padding 12px. Gap between cards 8px, between columns 16px, between page sections 32px.

**z-index contract:** base 0 / sticky 100 / dropdown 200 / overlay 250 / modal and slide-over 300 / drag-overlay 400 / toast 500 / tooltip 600.

## Shapes

Precise, not soft: radius `sm` 2px (chips, tags), `md` 4px (buttons, inputs, cards, avatars), `lg` 6px (modals, slide-over). `full` only for status dots. Avatars are rounded squares (4px), not circles.

## Elevation & Depth

Depth comes from surface color and 1px lines, not from shadows (shadows are invisible on dark navy).

- Level 0: canvas. Level 1: surface (columns, sidebar). Level 2: surface-raised (cards, menus, modals).
- Cards: 1px `line` border, no shadow.
- Shadows only for things that float: menus `0 8px 24px rgba(0,0,0,0.45)`, modal and slide-over `0 16px 48px rgba(0,0,0,0.55)`, dragged card `0 12px 28px rgba(0,0,0,0.5)`.

## Blueprint motifs (where yes, where no)

The decorative layer is part of the identity, but strictly limited so it never hurts reading.

**Allowed**

- Square grid (24px, `grid` color) as background of: login page, empty states, the dashboard progress card header.
- Measurement ticks (small 1px marks every 10%) on the dashboard progress bar and on the rule under column headers.
- Corner crop marks (small L-shaped marks) on the dashboard progress card and on empty states.
- Gear / mechanical line illustrations (1px stroke, `text-subtle`) on login, empty states and 404 only.
- 1px hairline rules and monospace labels everywhere.

**Forbidden**

- Any grid, gear or tick pattern behind ticket cards, Kanban columns, calendar cells, forms, modals or comments.
- Decorative elements are `aria-hidden` and `pointer-events: none`.

## Motion

Functional only, 120-180ms, `cubic-bezier(0.2, 0, 0, 1)`.

- Hover: color or background change, 120ms.
- Drag & drop: picked-up card scales to 1.02 with the drag shadow; the original slot shows a dashed 1px `guide` placeholder of the same height; the hovered drop column gets a `primary` tint at 35% opacity; drop settles in 160ms. On the calendar, the target day gets a dashed `guide` outline.
- Panels: slide-over slides in from the right (180ms), modals fade in with 4px upward motion (160ms).
- Skeletons: static blocks in `surface-raised`, with a very subtle opacity pulse (1.4s). No shimmer sweeps, no page spinners. A 16px inline spinner is allowed inside a loading button only.
- No entry animations on lists, no page transitions.
- `prefers-reduced-motion`: remove all movement and pulses, keep instant color changes.

## Iconography

- lucide-react only. 16px in UI, 20px in navigation, stroke 1.5, `currentColor`.
- No emojis anywhere in the UI. No brand logos (use generic icons for resource categories).
- Icon-only buttons have an `aria-label` and a tooltip.

## Components

**Buttons** (sans 600, 14px, sentence case)

- Primary: `accent` fill, `on-accent` text. Hover `accent-hover`. Active: no color change, `translateY(1px)`. One primary button per view.
- Secondary: transparent, 1px `line-strong` border, `text`. Hover `hover-overlay`, active `active-overlay`.
- Ghost: no border, `text-muted`, hover becomes `text` with `hover-overlay`.
- Danger: `danger` fill, `on-danger` text. Only inside confirmation dialogs.
- Icon button: 32px square, ghost style.
- Sizes: sm 28, md 36 (default), lg 44 (touch devices). Minimum touch target 44px on mobile.
- Disabled: 45% opacity, `not-allowed`. Loading: label stays, small inline spinner, button disabled.
- Focus (all focusable elements): 2px solid `text` outline, 2px offset.

**Inputs, textarea, selects, date picker**

- Label above (label style, `text-muted`), 36px height, `canvas` background, 1px `line-strong` border, 4px radius, placeholder `text-subtle`. No floating labels.
- Optional fields show "(optional)" next to the label.
- Error: border `danger`, message below with an alert icon, text in `danger`.
- Multi-select member picker: shows avatars with names, removable chips.

**Chips / badges** (22px high, label style)

- Type chip: type icon in type color + label in `text`, tinted background (type color 14%), 1px border (type color 40%).
- Status chip: same pattern with status color and status icon.
- Role chip (Team): neutral, `text-muted` on `surface-raised`, 1px `line` border. Roles are not color-coded.
- Complexity indicator: 3 small vertical bars, 1 / 2 / 3 filled (Simple / Medium / Complex), filled `text-muted`, empty `line`, with `aria-label="Complexity: Medium"`. Hidden when the field is empty.

**Avatar:** rounded square 4px, sizes 16 / 24 / 32 / 64. Fallback: initials in mono on `surface-raised` with 1px `line`. Avatar stack overlaps by 6px with a 2px ring in the parent surface color; show max 3 then "+n".

**Ticket card** (the core component, `surface-raised`, 12px padding, 3px left bar in type color)

- Optional image on top: 16:9, max-height 112px, `object-fit: cover`, 2px radius.
- Row 1: type chip (left), complexity indicator (right).
- Row 2: title, h3 / 500, clamped to 2 lines.
- Row 3: avatar stack (24px, max 3 then +n), estimated duration with clock icon in `data` style (e.g. "4h").
- When the view is not Kanban (calendar, category), also show the status icon.
- Hover: `hover-overlay`. Dragging: see Motion. Context menu (overflow): Edit, Move to (statuses), Delete. "Move to" is the keyboard and mobile alternative to drag & drop.

**Navigation (sidebar):** `surface` background, 1px right border `line`. Item 40px: icon + label. Active: `primary` fill, `text`, plus a 3px `accent` bar on the left edge. Hover: `hover-overlay`.

**Tabs / segmented control** (Kanban | Calendar | Category, Month | Week): 32px high, `surface` track, selected segment `primary` with `text`.

**Modal and confirm dialog:** `surface-raised`, 6px radius, max-width 400px (confirm) / 560px (forms), overlay `rgba(0,0,0,0.6)`, focus trapped, Esc closes. Every delete (ticket, member, resource) requires a confirmation dialog with a danger button.

**Toast:** bottom-right (bottom-center on mobile), auto-dismiss 4s (errors 6s), max 3 stacked, `role="status"`.

**Tooltip:** `canvas` background, 1px `line` border, label style, 600ms delay.

**Empty state:** icon in a 48px outlined square with corner marks, one-line title, one-line description, one primary action. Grid and gear illustration allowed here.

**Skeletons:** match the dimensions of the component they replace.

## Pages and views

**Login**

- Full viewport, centered 400px card on the blueprint grid. Title "Game Project Manager" (h1), one button "Continue with Google" (follow Google's official button branding guidelines).
- Denied state (account not invited): message in `danger` with an icon, plus a "Try another account" secondary button.

**Dashboard**

- Main band: progress card (corner marks, grid background in header only). Label "PROJECT PROGRESS", the percentage in `display`, then a 12px segmented bar: Done (`status-done`), In Progress (`status-in-progress`), remaining (`line`), with ticks every 10% below it and a legend with counts. When there are no tickets, show "—" and an empty state.
- Percentage = Done / Total, computed automatically.
- Stat tiles: Total, To Do, In Progress, Done. 4-up grid on desktop, 2-up on mobile. Each tile: label, number in mono (2rem), status icon.
- Project Hub preview: up to 6 links grouped by category with a "View all" link to the Project Hub page.
- Layout is asymmetric: progress card spans 8 of 12 columns, stat tiles the remaining 4 (stacked 2x2).

**Tasks**

- Sticky bar under the topbar: view switcher (Kanban | Calendar | Category) on the left, filters on the right.
- Filters: Member, Type, Duration (preset ranges), Status. Each is a dropdown button; active filters become removable chips with a count and a "Reset" ghost button. The Status filter is disabled in Kanban (columns already are statuses). Filters persist when switching views.

**Kanban**

- 3 columns (To Do, In Progress, Done). Column: `surface`, min-width 280px, max-width 400px, flexible. Header: status icon, label, count in `data`, and a "+" quick-add button. A 1px rule with ticks under the header.
- Each column scrolls vertically on its own; the page itself does not scroll horizontally on desktop.
- Quick add: inline input at the top of the column, Enter creates (title only), Esc cancels. Other fields are edited in the ticket panel.
- Mobile: one column visible at a time, switched by a tab control. Drag between columns is disabled, use "Move to" in the card menu.

**Calendar**

- Month and week views. Day cells min-height 112px (month). Tickets appear as compact chips: 3px type bar, truncated title, status icon. Max 3 per cell, then "+n more" opens a popover list.
- Today: 1px `accent` outline and the date number on an `accent` fill with `on-accent` text. Weekend cells use `canvas`.
- Tickets are draggable to another day. Tickets are placed by date only (no hourly slots), so a simple custom grid is acceptable if a library cannot be fully styled with the tokens.
- Mobile: month shows count badges per day, tapping a day lists its tickets; week becomes a vertical list of days.

**Category**

- One collapsible section per type: header with type icon and color, label, count. Body: responsive grid of ticket cards (`repeat(auto-fill, minmax(260px, 1fr))`). Cards show the status icon.

**Ticket panel (slide-over, 520px on desktop, full-screen on mobile)**

- Header: type chip, inline-editable title, "Saved" indicator in `text-subtle`, overflow menu (Delete with confirmation), close button.
- Body: properties list with label column (120px, label style) and control column: Status, Type, Assignees, Date, Estimated duration, Complexity (optional). Then Image (drop zone, preview, remove button), then Comments.
- Comments: list with avatar, author name, date (relative, absolute in tooltip), text. Composer pinned at the bottom with a primary "Comment" button.
- Changes autosave on blur. Every other view updates immediately.

**Team**

- "Add member" primary button. Responsive grid of member cards (`repeat(auto-fill, minmax(240px, 1fr))`): 64px avatar, name (h3), role chip, overflow menu (Edit, Delete with confirmation).

**Project Hub**

- Resources grouped by category (Design / Figma, Google Drive, Development / GitHub, Documentation, References, Assets, Other), each group a responsive card grid.
- Resource card: 40px thumbnail or category icon, name (h3, 1 line), domain in `data` + `text-subtle`, optional description (2 lines), category chip, external-link icon. Click opens the URL in a new tab (`rel="noopener noreferrer"`). Overflow menu: Edit, Delete with confirmation.
- Category icons (generic lucide): palette (Design / Figma), hard-drive (Google Drive), git-branch (Development / GitHub), book-open (Documentation), image (References), package (Assets), link (Other).

## Accessibility

- Text contrast >= 4.5:1, UI components and essential borders >= 3:1 (see Colors).
- Never convey information by color alone: statuses, types and complexity always have an icon or label.
- Full keyboard use: visible focus on everything, drag & drop has a keyboard alternative (dnd-kit keyboard sensor and the "Move to" menu).
- Semantic HTML, labelled form fields, `aria-live` for toasts, focus trapped in modals and returned on close.
- Respect `prefers-reduced-motion`.

## Do's and Don'ts

**Do**

- Do use the tokens for every color, spacing, radius and font. No hardcoded hex or px values in components.
- Do keep one primary button per view.
- Do keep data views calm: decoration only in the frame and in empty states.
- Do use monospace for numbers, labels and metadata, sans for reading text.
- Do show the same ticket data identically in every view (same card, same chips).

**Don't**

- Don't use emojis in the UI. Use lucide icons.
- Don't use pure white backgrounds, gradients, glows or oversaturated colors.
- Don't use `100vh`. Use `100dvh`.
- Don't use hotlinked placeholder images. Use inline SVG or initials fallbacks.
- Don't write marketing copy ("Elevate", "Seamless", "Unleash", "Next-Gen") or lorem ipsum. Microcopy is short and factual.
- Don't add landing-page patterns (hero split screen, zig-zag sections, testimonials).
- Don't add features or visual variants that are not described here.

## Implementation notes (Next.js + SCSS)

- Tokens live in `styles/_tokens.scss` as CSS custom properties on `:root`, named 1:1 from the front matter (`--color-canvas`, `--color-accent`, `--space-md`, `--radius-md`...). Global reset and base styles in `styles/globals.scss`. One `Component.module.scss` per component. Component files use tokens only.
- Fonts: `next/font/google` with `IBM_Plex_Mono` (400, 500, 600, 700) and `IBM_Plex_Sans` (400, 500, 600), `display: "swap"`, exposed as CSS variables.
- `:root { color-scheme: dark; }`.
- Behavior primitives: Radix Primitives or React Aria (Dialog, DropdownMenu, Select, Popover, Tooltip), styled with SCSS. Drag & drop: dnd-kit with keyboard support. Icons: lucide-react.
- Create a dev-only `/styleguide` route that shows all tokens and every component in every state (default, hover, focus, active, disabled, loading, error).

## Agent build order (validation gate)

1. Create tokens and global styles from this file.
2. Create the base components (button, input, chip, avatar, card, modal, toast, skeleton, empty state).
3. Build the `/styleguide` page.
4. Build ONE validation screen: a Kanban column with 3 ticket cards (one with an image, one with 3+ assignees, one without complexity) and the open ticket slide-over with comments.
5. STOP and wait for design validation before building the other pages.
