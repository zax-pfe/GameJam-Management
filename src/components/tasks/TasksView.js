"use client";

import { Calendar, LayoutGrid, Plus, SquareKanban } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { TicketPanel } from "@/components/tickets/TicketPanel";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { EMPTY_FILTERS, applyFilters } from "@/lib/tickets";
import { useData } from "@/store/DataProvider";
import { CategoryView } from "./CategoryView";
import { FiltersBar } from "./FiltersBar";
import { KanbanBoard } from "./KanbanBoard";
import { NewTicketModal } from "./NewTicketModal";
import styles from "./TasksView.module.scss";

// FullCalendar is heavy: only load it when the Calendar view is opened.
const CalendarView = dynamic(() => import("./CalendarView").then((m) => m.CalendarView), {
  loading: () => <Skeleton height="100%" className={styles.calendarSkeleton} />,
});

const VIEWS = [
  { value: "kanban", label: "Kanban", icon: SquareKanban },
  { value: "calendar", label: "Calendar", icon: Calendar },
  { value: "category", label: "Category", icon: LayoutGrid },
];

/**
 * Tasks page: one filtered ticket list shared by the three views.
 * View and open ticket live in the URL (?view=…&ticket=…) so links can be shared.
 * Filters persist while switching views.
 */
export function TasksView() {
  const { tickets } = useData();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [creating, setCreating] = useState(false);

  const view = VIEWS.some((v) => v.value === searchParams.get("view")) ? searchParams.get("view") : "kanban";
  const openTicketId = searchParams.get("ticket");

  function setParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === "view" && value === "kanban") params.delete("view");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const openTicket = (id) => setParam("ticket", id);
  const closeTicket = () => setParam("ticket", null);

  // Status is already the column in the Kanban.
  const ignoreStatus = view === "kanban";
  const visible = applyFilters(tickets, filters, { ignoreStatus });

  return (
    <div className={styles.page}>
      <Topbar title="Tasks">
        <Button variant="primary" icon={Plus} onClick={() => setCreating(true)}>
          New ticket
        </Button>
      </Topbar>

      <div className={styles.toolbar}>
        <SegmentedControl label="View" options={VIEWS} value={view} onChange={(v) => setParam("view", v)} />
        <FiltersBar filters={filters} onChange={setFilters} statusDisabled={ignoreStatus} />
      </div>

      <div className={styles.content}>
        {view === "kanban" && (
          <KanbanBoard
            tickets={visible}
            filtered={visible.length !== tickets.length}
            onOpen={openTicket}
            onCreate={() => setCreating(true)}
          />
        )}
        {view === "calendar" && <CalendarView tickets={visible} onOpen={openTicket} />}
        {view === "category" && (
          <CategoryView
            tickets={visible}
            filtered={visible.length !== tickets.length}
            onOpen={openTicket}
            onCreate={() => setCreating(true)}
          />
        )}
      </div>

      <TicketPanel ticketId={openTicketId} onClose={closeTicket} />
      <NewTicketModal
        open={creating}
        onOpenChange={setCreating}
        onCreated={(ticket) => openTicket(ticket.id)}
      />
    </div>
  );
}
