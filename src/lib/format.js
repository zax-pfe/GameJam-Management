// Small formatting helpers shared by every view.

export function fullName(member) {
  if (!member) return "Former member";
  return `${member.first_name} ${member.last_name}`.trim();
}

export function initials(member) {
  if (!member) return "?";
  return `${member.first_name?.[0] ?? ""}${member.last_name?.[0] ?? ""}`.toUpperCase() || "?";
}

/** 4 → "4h", 1.5 → "1.5h", 0.25 → "15m" */
export function formatHours(hours) {
  if (hours == null || hours === "") return null;
  const h = Number(hours);
  if (Number.isNaN(h)) return null;
  if (h > 0 && h < 1) return `${Math.round(h * 60)}m`;
  return `${Number.isInteger(h) ? h : h.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}h`;
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const shortDateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const relFmt = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "2026-11-19" (local date column) → Date at local midnight */
export function parseDay(day) {
  if (!day) return null;
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Date → "2026-11-19" in local time */
export function toDay(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDay(day) {
  const date = parseDay(day);
  return date ? dateFmt.format(date) : null;
}

export function formatShortDay(day) {
  const date = parseDay(day);
  return date ? shortDateFmt.format(date) : null;
}

export function formatDateTime(iso) {
  return iso ? dateTimeFmt.format(new Date(iso)) : "";
}

export function formatRelative(iso, now = Date.now()) {
  const diff = (new Date(iso).getTime() - now) / 1000;
  const abs = Math.abs(diff);
  if (abs < 45) return "just now";
  if (abs < 3600) return relFmt.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return relFmt.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30) return relFmt.format(Math.round(diff / 86400), "day");
  return dateFmt.format(new Date(iso));
}

export function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Adds https:// when the user typed a bare domain. */
export function normalizeUrl(value) {
  const v = value.trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}
