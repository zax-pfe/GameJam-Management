import { DURATION_RANGE, STATUSES } from "./constants";

export const EMPTY_FILTERS = { members: [], types: [], durations: [], statuses: [] };

export function countActiveFilters(filters, { ignoreStatus = false } = {}) {
  return (
    filters.members.length +
    filters.types.length +
    filters.durations.length +
    (ignoreStatus ? 0 : filters.statuses.length)
  );
}

/** Every filter group is an OR inside the group, AND between groups. */
export function applyFilters(tickets, filters, { ignoreStatus = false } = {}) {
  return tickets.filter((t) => {
    if (filters.members.length && !t.assignee_ids.some((id) => filters.members.includes(id))) return false;
    if (filters.types.length && !filters.types.includes(t.type)) return false;
    if (filters.durations.length && !filters.durations.some((d) => DURATION_RANGE[d]?.test(t.estimate_hours)))
      return false;
    if (!ignoreStatus && filters.statuses.length && !filters.statuses.includes(t.status)) return false;
    return true;
  });
}

/** { todo: [...], in_progress: [...], done: [...] } sorted by position. */
export function groupByStatus(tickets) {
  const groups = Object.fromEntries(STATUSES.map((s) => [s.value, []]));
  for (const t of tickets) groups[t.status]?.push(t);
  for (const list of Object.values(groups)) list.sort((a, b) => a.position - b.position);
  return groups;
}

/** Position for an item dropped between two neighbours (either may be missing). */
export function positionBetween(before, after) {
  if (before == null && after == null) return 0;
  if (before == null) return after - 1;
  if (after == null) return before + 1;
  return (before + after) / 2;
}

/** Position at the top of a status column. */
export function topPosition(tickets, status) {
  return tickets.filter((t) => t.status === status).reduce((min, t) => Math.min(min, t.position), 0) - 1;
}
