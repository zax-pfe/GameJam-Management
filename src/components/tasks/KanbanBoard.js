"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, SquareKanban } from "lucide-react";
import { useId, useState } from "react";
import { TicketCard } from "@/components/tickets/TicketCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { STATUSES } from "@/lib/constants";
import { cx } from "@/lib/cx";
import { groupByStatus, positionBetween } from "@/lib/tickets";
import { MOBILE_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { useData } from "@/store/DataProvider";
import { QuickAdd } from "./QuickAdd";
import styles from "./KanbanBoard.module.scss";

const COLUMN_PREFIX = "column:";
const idsByStatus = (groups) => Object.fromEntries(Object.entries(groups).map(([s, list]) => [s, list.map((t) => t.id)]));

/**
 * 3 status columns. Drag & drop between columns and inside a column
 * (pointer + keyboard: Space to pick up / drop, arrows to move, Esc to cancel).
 * Mobile: one column at a time, no drag (use the card's "Move to" menu).
 */
export function KanbanBoard({ tickets, filtered, onOpen, onCreate }) {
  const { tickets: allTickets, updateTicket } = useData();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const dndId = useId(); // stable ids for dnd-kit's a11y attributes (no hydration mismatch)
  const [mobileStatus, setMobileStatus] = useState("todo");
  const [quickAdd, setQuickAdd] = useState(null); // status with an open quick-add input
  const [activeId, setActiveId] = useState(null);
  const [dragColumns, setDragColumns] = useState(null); // { status: [ids] } while dragging

  const groups = groupByStatus(tickets);
  const columns = dragColumns ?? idsByStatus(groups);
  const byId = new Map(allTickets.map((t) => [t.id, t]));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      // Enter opens the ticket, Space picks it up.
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space", "Enter"] },
    }),
  );

  const containerOf = (cols, id) =>
    id.startsWith(COLUMN_PREFIX) ? id.slice(COLUMN_PREFIX.length) : Object.keys(cols).find((s) => cols[s].includes(id));

  function onDragStart({ active }) {
    setActiveId(active.id);
    setDragColumns(idsByStatus(groups));
  }

  function onDragOver({ active, over }) {
    if (!over) return;
    setDragColumns((cols) => {
      if (!cols) return cols;
      const from = containerOf(cols, active.id);
      const to = containerOf(cols, over.id);
      if (!from || !to || from === to) return cols;
      const target = cols[to].filter((id) => id !== active.id);
      let index = target.length;
      if (!over.id.startsWith(COLUMN_PREFIX)) {
        const overIndex = target.indexOf(over.id);
        const translated = active.rect.current.translated;
        const below = translated && translated.top > over.rect.top + over.rect.height / 2;
        index = overIndex + (below ? 1 : 0);
      }
      target.splice(index, 0, active.id);
      return { ...cols, [from]: cols[from].filter((id) => id !== active.id), [to]: target };
    });
  }

  function onDragEnd({ active, over }) {
    const cols = dragColumns;
    setActiveId(null);
    setDragColumns(null);
    if (!over || !cols) return;

    const status = containerOf(cols, active.id);
    let list = cols[status];
    if (!over.id.startsWith(COLUMN_PREFIX) && containerOf(cols, over.id) === status) {
      list = arrayMove(list, list.indexOf(active.id), list.indexOf(over.id));
    }

    const ticket = byId.get(active.id);
    const original = groups[status].map((t) => t.id);
    const unchanged = ticket.status === status && list.join() === original.join();
    if (unchanged) return;

    const index = list.indexOf(active.id);
    const before = byId.get(list[index - 1])?.position;
    const after = byId.get(list[index + 1])?.position;
    updateTicket(active.id, { status, position: positionBetween(before, after) });
  }

  function onDragCancel() {
    setActiveId(null);
    setDragColumns(null);
  }

  const overColumn = activeId ? containerOf(columns, activeId) : null;
  const activeTicket = activeId ? byId.get(activeId) : null;

  if (allTickets.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <EmptyState
          icon={SquareKanban}
          title="No tickets yet"
          description="Create the first task of the game. You can also add one from a column."
          action={
            <Button variant="primary" icon={Plus} onClick={onCreate}>
              New ticket
            </Button>
          }
        />
      </div>
    );
  }

  const renderColumn = (status, { draggable }) => {
    const ids = columns[status];
    return (
      <Column
        key={status}
        status={status}
        count={ids.length}
        highlighted={overColumn === status && activeTicket?.status !== status}
        onQuickAdd={() => setQuickAdd(status)}
        hideHeader={isMobile}
      >
        {quickAdd === status && <QuickAdd status={status} onClose={() => setQuickAdd(null)} />}
        <SortableContext items={ids} strategy={verticalListSortingStrategy} disabled={!draggable}>
          <ul className={styles.list}>
            {ids.map((id) => {
              const ticket = byId.get(id);
              return ticket ? (
                <li key={id}>
                  {draggable ? (
                    <SortableTicket ticket={ticket} onOpen={onOpen} />
                  ) : (
                    <TicketCard ticket={ticket} onOpen={onOpen} />
                  )}
                </li>
              ) : null;
            })}
          </ul>
        </SortableContext>
        {ids.length === 0 && quickAdd !== status && (
          <p className={styles.columnEmpty}>{filtered ? "No ticket matches the filters." : "Nothing here yet."}</p>
        )}
      </Column>
    );
  };

  if (isMobile) {
    return (
      <div className={styles.mobile}>
        <div className={styles.mobileTabs}>
          <SegmentedControl
            label="Column"
            value={mobileStatus}
            onChange={setMobileStatus}
            options={STATUSES.map((s) => ({ value: s.value, label: `${s.label} ${columns[s.value].length}` }))}
          />
          <IconButton icon={Plus} label="Quick add" onClick={() => setQuickAdd(mobileStatus)} />
        </div>
        {renderColumn(mobileStatus, { draggable: false })}
      </div>
    );
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className={styles.board}>{STATUSES.map((s) => renderColumn(s.value, { draggable: true }))}</div>
      <DragOverlay dropAnimation={{ duration: 160, easing: "cubic-bezier(0.2, 0, 0, 1)" }}>
        {activeTicket ? <TicketCard ticket={activeTicket} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function Column({ status, count, highlighted, onQuickAdd, hideHeader, children }) {
  const { setNodeRef } = useDroppable({ id: `${COLUMN_PREFIX}${status}` });
  const item = STATUSES.find((s) => s.value === status);
  const Icon = item.icon;
  return (
    <section
      ref={setNodeRef}
      className={cx(styles.column, highlighted && styles.columnOver)}
      aria-label={`${item.label}, ${count} tickets`}
    >
      {!hideHeader && (
        <header className={styles.columnHeader}>
          <Icon size={16} strokeWidth={1.5} style={{ color: `var(${item.color})` }} aria-hidden />
          <h2 className={styles.columnTitle}>{item.label}</h2>
          <span className={styles.columnCount}>{count}</span>
          <IconButton icon={Plus} label={`Add a ticket to ${item.label}`} onClick={onQuickAdd} />
        </header>
      )}
      {!hideHeader && <div className={styles.rule} aria-hidden />}
      <div className={styles.columnBody}>{children}</div>
    </section>
  );
}

function SortableTicket({ ticket, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: ticket.id });
  return (
    <TicketCard
      ref={setNodeRef}
      ticket={ticket}
      onOpen={isDragging ? undefined : onOpen}
      placeholder={isDragging}
      dragProps={{ ...attributes, ...listeners }}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    />
  );
}
