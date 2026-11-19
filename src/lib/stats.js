/**
 * Project progress, always derived from the current ticket list
 * (so it stays right after any status change, creation or deletion).
 */
export function ticketStats(tickets) {
  const total = tickets.length;
  const todo = tickets.filter((t) => t.status === "todo").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const done = tickets.filter((t) => t.status === "done").length;
  const percent = total === 0 ? null : Math.round((done / total) * 100);
  return { total, todo, inProgress, done, percent };
}
