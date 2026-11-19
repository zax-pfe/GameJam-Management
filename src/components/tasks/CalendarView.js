"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { StatusIcon } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TYPE } from "@/lib/constants";
import { MOBILE_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { useData } from "@/store/DataProvider";
import styles from "./CalendarView.module.scss";

const MODES = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
];

/**
 * Month / week calendar (FullCalendar, styled with the tokens).
 * Tickets sit on their date and can be dragged to another day.
 * Mobile: month shows a count per day (tap to list), week is a vertical list.
 */
export function CalendarView({ tickets, onOpen }) {
  const { updateTicket } = useData();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const calendarRef = useRef(null);
  const [mode, setMode] = useState("month");
  const [title, setTitle] = useState("");

  const viewName = mode === "month" ? "dayGridMonth" : isMobile ? "listWeek" : "dayGridWeek";
  const api = () => calendarRef.current?.getApi();

  const dated = tickets.filter((t) => t.due_date);
  const undated = tickets.length - dated.length;
  const events = dated.map((t) => ({
    id: t.id,
    title: t.title,
    start: t.due_date,
    allDay: true,
    extendedProps: { ticket: t },
  }));

  function changeMode(next) {
    setMode(next);
    api()?.changeView(next === "month" ? "dayGridMonth" : isMobile ? "listWeek" : "dayGridWeek");
  }

  async function onEventDrop({ event, revert }) {
    const { ok } = await updateTicket(event.id, { due_date: event.startStr });
    if (!ok) revert();
  }

  return (
    <div className={styles.view}>
      <div className={styles.toolbar}>
        <div className={styles.nav}>
          <IconButton icon={ChevronLeft} label={mode === "month" ? "Previous month" : "Previous week"} onClick={() => api()?.prev()} />
          <IconButton icon={ChevronRight} label={mode === "month" ? "Next month" : "Next week"} onClick={() => api()?.next()} />
          <Button size="sm" variant="secondary" onClick={() => api()?.today()}>
            Today
          </Button>
          <h2 className={styles.title} aria-live="polite">
            {title}
          </h2>
        </div>
        <div className={styles.right}>
          {undated > 0 && (
            <p className={styles.undated}>
              {undated} {undated === 1 ? "ticket has" : "tickets have"} no date
            </p>
          )}
          <SegmentedControl label="Calendar range" options={MODES} value={mode} onChange={changeMode} />
        </div>
      </div>

      <div className={styles.calendar}>
        <FullCalendar
          key={isMobile ? "mobile" : "desktop"}
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView={viewName}
          headerToolbar={false}
          firstDay={1}
          height={isMobile ? "auto" : "100%"}
          fixedWeekCount={false}
          events={events}
          editable={!isMobile}
          eventDurationEditable={false}
          eventDrop={onEventDrop}
          eventClick={({ event, jsEvent }) => {
            jsEvent.preventDefault();
            onOpen(event.id);
          }}
          dayMaxEvents={isMobile ? 0 : 3}
          moreLinkContent={({ num }) => (isMobile ? `${num}` : `+${num} more`)}
          moreLinkHint={(num) => `Show ${num} tickets`}
          eventContent={({ event }) => <CalendarChip ticket={event.extendedProps.ticket} />}
          dayCellClassNames={({ date }) => ([0, 6].includes(date.getDay()) ? [styles.weekend] : [])}
          datesSet={({ view }) => setTitle(view.title)}
          noEventsContent="No dated tickets this week."
          eventOrder="title"
        />
      </div>
    </div>
  );
}

function CalendarChip({ ticket }) {
  const type = TYPE[ticket.type] ?? TYPE.other;
  return (
    <span className={styles.chip} style={{ "--type-color": `var(${type.color})` }} title={ticket.title}>
      <span className={styles.chipTitle}>{ticket.title}</span>
      <StatusIcon status={ticket.status} size={14} />
    </span>
  );
}
