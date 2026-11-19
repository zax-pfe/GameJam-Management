// Fake data for the dev-only styleguide. Never used by the real app.

const art = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
<rect width="320" height="180" fill="#1C4E80"/>
<g stroke="#F5F8FC" stroke-opacity=".35" fill="none">
<path d="M0 30h320M0 60h320M0 90h320M0 120h320M0 150h320M40 0v180M80 0v180M120 0v180M160 0v180M200 0v180M240 0v180M280 0v180"/>
</g>
<path d="M60 140l60-80 40 50 30-30 70 60z" fill="#4FD1C5" fill-opacity=".8"/>
<circle cx="240" cy="50" r="18" fill="#FFB547"/>
</svg>`);

export const SAMPLE_IMAGE = `data:image/svg+xml,${art}`;

const now = Date.now();
const iso = (minutesAgo) => new Date(now - minutesAgo * 60000).toISOString();

export const SAMPLE_MEMBERS = [
  { id: "m1", first_name: "Alex", last_name: "Martin", email: "alex@example.com", role: "game_designer", avatar_path: null },
  { id: "m2", first_name: "Sam", last_name: "Durand", email: "sam@example.com", role: "developer", avatar_path: null },
  { id: "m3", first_name: "Lou", last_name: "Bernard", email: "lou@example.com", role: "artist_3d", avatar_path: null },
  { id: "m4", first_name: "Noa", last_name: "Petit", email: "noa@example.com", role: "sound_designer", avatar_path: null },
  { id: "m5", first_name: "Eli", last_name: "Roux", email: "eli@example.com", role: "ui_ux_designer", avatar_path: null },
];

const base = { created_by: "m1", updated_by: "m2", created_at: iso(3000), updated_at: iso(42), due_date: null };

export const SAMPLE_TICKETS = [
  {
    ...base,
    id: "t1",
    title: "Model the harbour crane and its rigging",
    type: "3d",
    status: "todo",
    position: 1,
    estimate_hours: 12,
    complexity: "complex",
    image_path: SAMPLE_IMAGE,
    assignee_ids: ["m3"],
  },
  {
    ...base,
    id: "t2",
    title: "Player controller: wall jump, coyote time and input buffering",
    type: "development",
    status: "todo",
    position: 2,
    estimate_hours: 6,
    complexity: "medium",
    image_path: null,
    assignee_ids: ["m2", "m1", "m5", "m4"],
  },
  {
    ...base,
    id: "t3",
    title: "Main menu ambience loop",
    type: "audio",
    status: "todo",
    position: 3,
    estimate_hours: 1.5,
    complexity: null,
    image_path: null,
    assignee_ids: ["m4"],
  },
];

const day = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Extra tickets for the full-screen previews (?screen=tasks / dashboard).
export const SAMPLE_BOARD = [
  ...SAMPLE_TICKETS.map((t, i) => ({ ...t, due_date: day(i * 2) })),
  { ...base, id: "t4", title: "Level 2 greybox", type: "design", status: "in_progress", position: 1, estimate_hours: 16, complexity: "complex", image_path: null, assignee_ids: ["m1"], due_date: day(1) },
  { ...base, id: "t5", title: "Inventory screen layout", type: "ui_ux", status: "in_progress", position: 2, estimate_hours: 4, complexity: "simple", image_path: null, assignee_ids: ["m5", "m2"], due_date: day(1) },
  { ...base, id: "t6", title: "Character concept sheet", type: "2d_art", status: "done", position: 1, estimate_hours: 8, complexity: "medium", image_path: null, assignee_ids: ["m3"], due_date: day(-3) },
  { ...base, id: "t7", title: "Save system", type: "development", status: "done", position: 2, estimate_hours: 10, complexity: "complex", image_path: null, assignee_ids: ["m2"], due_date: day(-1) },
  { ...base, id: "t8", title: "Footstep sounds", type: "audio", status: "done", position: 3, estimate_hours: null, complexity: null, image_path: null, assignee_ids: [], due_date: day(1) },
  { ...base, id: "t9", title: "Build pipeline", type: "other", status: "todo", position: 4, estimate_hours: 3, complexity: null, image_path: null, assignee_ids: [], due_date: day(1) },
];

export const SAMPLE_COMMENTS = {
  t1: [
    { id: "c1", ticket_id: "t1", author_id: "m1", body: "Reference board is in the Project Hub, under References.", created_at: iso(180) },
    {
      id: "c2",
      ticket_id: "t1",
      author_id: "m3",
      body: "Blockout done. I will keep the poly count under 15k so it stays cheap on low-end hardware.",
      created_at: iso(12),
    },
  ],
};

export const SAMPLE_RESOURCES = [
  { id: "r1", name: "Game Design Document", url: "https://docs.google.com/document/d/example", category: "documentation", description: "Core loop, progression and level list.", thumbnail_path: null },
  { id: "r2", name: "UI kit", url: "https://www.figma.com/file/example", category: "design", description: null, thumbnail_path: null },
];
