"use client";

import { Clock } from "lucide-react";
import { AvatarStack } from "@/components/ui/Avatar";
import { ComplexityIndicator, StatusIcon, TypeChip } from "@/components/ui/Chip";
import { TYPE } from "@/lib/constants";
import { cx } from "@/lib/cx";
import { formatHours } from "@/lib/format";
import { imageUrl } from "@/lib/images";
import { useData } from "@/store/DataProvider";
import { TicketMenu } from "./TicketMenu";
import styles from "./TicketCard.module.scss";

/**
 * The one ticket card used by every view (Kanban, Category, Styleguide).
 * `dragProps` / `ref` come from dnd-kit in the Kanban.
 */
export function TicketCard({
  ticket,
  onOpen,
  showStatus = false,
  withMenu = true,
  placeholder = false,
  overlay = false,
  dragProps,
  style,
  ref,
}) {
  const { membersById } = useData();
  const assignees = ticket.assignee_ids.map((id) => membersById.get(id)).filter(Boolean);
  const duration = formatHours(ticket.estimate_hours);
  const src = imageUrl(ticket.image_path);

  function onKeyDown(event) {
    dragProps?.onKeyDown?.(event);
    if (event.key === "Enter" && !event.defaultPrevented && event.target === event.currentTarget) {
      event.preventDefault();
      onOpen?.(ticket.id);
    }
  }

  return (
    <article
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`${ticket.title}. Open ticket`}
      {...dragProps}
      onKeyDown={onKeyDown}
      onClick={() => onOpen?.(ticket.id)}
      className={cx(styles.card, placeholder && styles.placeholder, overlay && styles.overlay)}
      style={{ "--type-color": `var(${TYPE[ticket.type]?.color ?? "--color-type-other"})`, ...style }}
    >
      {src && (
        <div className={styles.image}>
          <img src={src} alt="" loading="lazy" draggable={false} />
        </div>
      )}

      <div className={styles.row}>
        <TypeChip type={ticket.type} />
        <span className={styles.meta}>
          {showStatus && <StatusIcon status={ticket.status} />}
          <ComplexityIndicator complexity={ticket.complexity} />
          {withMenu && !overlay && <TicketMenu ticket={ticket} onOpen={onOpen} />}
        </span>
      </div>

      <h3 className={styles.title}>{ticket.title}</h3>

      {(assignees.length > 0 || duration) && (
        <div className={styles.row}>
          <AvatarStack members={assignees} size={24} />
          {duration && (
            <span className={styles.duration} aria-label={`Estimated ${duration}`}>
              <Clock size={14} strokeWidth={1.5} aria-hidden />
              {duration}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
