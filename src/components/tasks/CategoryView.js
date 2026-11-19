"use client";

import { ChevronDown, LayoutGrid, Plus } from "lucide-react";
import { useState } from "react";
import { TicketCard } from "@/components/tickets/TicketCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TYPES } from "@/lib/constants";
import { cx } from "@/lib/cx";
import { useData } from "@/store/DataProvider";
import styles from "./CategoryView.module.scss";

const STATUS_ORDER = { todo: 0, in_progress: 1, done: 2 };

/** One collapsible section per task type. Cards show their status icon. */
export function CategoryView({ tickets, filtered, onOpen, onCreate }) {
  const { tickets: allTickets } = useData();
  const [collapsed, setCollapsed] = useState(() => new Set());

  const toggle = (type) =>
    setCollapsed((set) => {
      const next = new Set(set);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });

  if (allTickets.length === 0) {
    return (
      <div className={styles.view}>
        <EmptyState
          icon={LayoutGrid}
          title="No tickets yet"
          description="Tickets will be grouped here by type of task."
          action={
            <Button variant="primary" icon={Plus} onClick={onCreate}>
              New ticket
            </Button>
          }
        />
      </div>
    );
  }

  if (filtered && tickets.length === 0) {
    return (
      <div className={styles.view}>
        <EmptyState icon={LayoutGrid} title="No ticket matches the filters" description="Change or reset the filters." compact />
      </div>
    );
  }

  return (
    <div className={styles.view}>
      {TYPES.map((type) => {
        const list = tickets
          .filter((t) => t.type === type.value)
          .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.position - b.position);
        if (filtered && list.length === 0) return null;
        const open = !collapsed.has(type.value);
        const Icon = type.icon;
        const bodyId = `category-${type.value}`;
        return (
          <section key={type.value} className={styles.section}>
            <h2>
              <button
                type="button"
                className={styles.header}
                aria-expanded={open}
                aria-controls={bodyId}
                onClick={() => toggle(type.value)}
                style={{ "--type-color": `var(${type.color})` }}
              >
                <ChevronDown className={cx(styles.chevron, !open && styles.chevronClosed)} size={16} strokeWidth={1.5} aria-hidden />
                <Icon className={styles.typeIcon} size={16} strokeWidth={1.5} aria-hidden />
                <span className={styles.label}>{type.label}</span>
                <span className={styles.count}>{list.length}</span>
              </button>
            </h2>
            {open && (
              <div id={bodyId}>
                {list.length === 0 ? (
                  <p className={styles.empty}>No {type.label} tickets.</p>
                ) : (
                  <ul className={styles.grid}>
                    {list.map((ticket) => (
                      <li key={ticket.id}>
                        <TicketCard ticket={ticket} onOpen={onOpen} showStatus />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
