"use client";

import { Dialog } from "radix-ui";
import { Check, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TypeChip } from "@/components/ui/Chip";
import { Input, Select } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { ImageDrop } from "@/components/ui/ImageDrop";
import { Menu, MenuItem } from "@/components/ui/Menu";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Tooltip } from "@/components/ui/Tooltip";
import { COMPLEXITIES, STATUSES, TYPES } from "@/lib/constants";
import { formatDateTime, formatRelative, fullName } from "@/lib/format";
import { imageUrl } from "@/lib/images";
import { useData } from "@/store/DataProvider";
import { Comments } from "./Comments";
import { MemberPicker } from "./MemberPicker";
import styles from "./TicketPanel.module.scss";

/** Slide-over (520px, full screen on mobile). Every change autosaves. */
export function TicketPanel({ ticketId, onClose }) {
  const { tickets } = useData();
  const ticket = tickets.find((t) => t.id === ticketId);

  return (
    <Dialog.Root open={Boolean(ticketId)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.panel} aria-describedby={undefined}>
          {ticket ? (
            <PanelContent key={ticket.id} ticket={ticket} onClose={onClose} />
          ) : (
            <MissingTicket onClose={onClose} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MissingTicket({ onClose }) {
  return (
    <>
      <header className={styles.header}>
        <Dialog.Title className={styles.missingTitle}>Ticket not found</Dialog.Title>
        <Dialog.Close asChild>
          <IconButton icon={X} label="Close" tooltip={false} />
        </Dialog.Close>
      </header>
      <p className={styles.missing}>It may have been deleted by a teammate.</p>
      <div className={styles.missing}>
        <button type="button" className={styles.link} onClick={onClose}>
          Back to tasks
        </button>
      </div>
    </>
  );
}

function PanelContent({ ticket, onClose }) {
  const { updateTicket, deleteTicket, setTicketImage, membersById } = useData();
  const toast = useToast();
  const [saved, setSaved] = useState(false);
  const [titleError, setTitleError] = useState(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const savedTimer = useRef(null);

  useEffect(() => () => clearTimeout(savedTimer.current), []);

  async function save(patch) {
    const { ok } = await updateTicket(ticket.id, patch);
    if (!ok) return;
    setSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2000);
  }

  function saveTitle(event) {
    const value = event.target.value.trim();
    if (!value) {
      setTitleError("Task name is required.");
      event.target.value = ticket.title;
      return;
    }
    setTitleError(null);
    if (value !== ticket.title) save({ title: value });
  }

  function saveEstimate(event) {
    const raw = event.target.value.trim();
    const value = raw === "" ? null : Math.max(0, Math.round(Number(raw) * 100) / 100);
    if (Number.isNaN(value)) {
      event.target.value = ticket.estimate_hours ?? "";
      return;
    }
    if (value !== ticket.estimate_hours) save({ estimate_hours: value });
  }

  async function changeImage(file) {
    setImageBusy(true);
    const { ok } = await setTicketImage(ticket.id, file);
    setImageBusy(false);
    if (ok) toast(file ? "Image added" : "Image removed");
  }

  const creator = ticket.created_by ? membersById.get(ticket.created_by) : null;
  const editor = ticket.updated_by ? membersById.get(ticket.updated_by) : null;

  return (
    <>
      <header className={styles.header}>
        <TypeChip type={ticket.type} />
        <span className={styles.saved} aria-live="polite">
          {saved && (
            <>
              <Check size={14} strokeWidth={1.5} aria-hidden /> Saved
            </>
          )}
        </span>
        <Menu label="Ticket actions">
          <MenuItem icon={Trash2} danger onSelect={() => setConfirmDelete(true)}>
            Delete ticket
          </MenuItem>
        </Menu>
        <Dialog.Close asChild>
          <IconButton icon={X} label="Close" tooltip={false} />
        </Dialog.Close>
      </header>

      <div className={styles.body}>
        <Dialog.Title className="visually-hidden">{ticket.title}</Dialog.Title>
        <div className={styles.titleWrap}>
          <label htmlFor="ticket-title" className="visually-hidden">
            Task name
          </label>
            <textarea
              id="ticket-title"
              key={ticket.title}
              className={styles.title}
              defaultValue={ticket.title}
              rows={1}
              maxLength={200}
              aria-invalid={titleError ? true : undefined}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
            />
          {titleError && <p className={styles.error}>{titleError}</p>}
        </div>

        <dl className={styles.props}>
          <Prop label="Status" htmlFor="ticket-status">
            <Select id="ticket-status" value={ticket.status} onChange={(e) => save({ status: e.target.value })}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Prop>

          <Prop label="Type" htmlFor="ticket-type">
            <Select id="ticket-type" value={ticket.type} onChange={(e) => save({ type: e.target.value })}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Prop>

          <Prop label="Assignees" htmlFor="ticket-assignees">
            <MemberPicker
              id="ticket-assignees"
              value={ticket.assignee_ids}
              onChange={(ids) => save({ assignee_ids: ids })}
            />
          </Prop>

          <Prop label="Date" htmlFor="ticket-date">
            <Input
              id="ticket-date"
              type="date"
              value={ticket.due_date ?? ""}
              onChange={(e) => save({ due_date: e.target.value || null })}
            />
          </Prop>

          <Prop label="Estimate" htmlFor="ticket-estimate">
            <div className={styles.estimate}>
              <Input
                id="ticket-estimate"
                key={ticket.estimate_hours ?? "none"}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                placeholder="—"
                defaultValue={ticket.estimate_hours ?? ""}
                onBlur={saveEstimate}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
              />
              <span className={styles.unit}>hours</span>
            </div>
          </Prop>

          <Prop label="Complexity" htmlFor="ticket-complexity" optional>
            <Select
              id="ticket-complexity"
              value={ticket.complexity ?? ""}
              onChange={(e) => save({ complexity: e.target.value || null })}
            >
              <option value="">Not set</option>
              {COMPLEXITIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Prop>
        </dl>

        <section className={styles.section} aria-labelledby="ticket-image-label">
          <h2 id="ticket-image-label" className={styles.sectionTitle}>
            Image <span className={styles.optional}>(optional)</span>
          </h2>
          <ImageDrop
            src={imageUrl(ticket.image_path)}
            busy={imageBusy}
            onSelect={changeImage}
            onRemove={() => changeImage(null)}
          />
        </section>

        <p className={styles.meta}>
          Created by {fullName(creator)} ·{" "}
          <Tooltip content={formatDateTime(ticket.created_at)}>
            <time dateTime={ticket.created_at} tabIndex={0}>
              {formatRelative(ticket.created_at)}
            </time>
          </Tooltip>
          {ticket.updated_at !== ticket.created_at && (
            <>
              {" "}
              · Last edited by {fullName(editor)} {formatRelative(ticket.updated_at)}
            </>
          )}
        </p>

        <Comments ticketId={ticket.id} />
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this ticket?"
        description={`“${ticket.title}” and its comments will be permanently deleted.`}
        onConfirm={async () => {
          const { ok } = await deleteTicket(ticket.id);
          if (ok) {
            toast("Ticket deleted");
            onClose();
          }
        }}
      />
    </>
  );
}

function Prop({ label, htmlFor, optional, children }) {
  return (
    <div className={styles.prop}>
      <dt>
        <label htmlFor={htmlFor} className={styles.propLabel}>
          {label}
          {optional && <span className={styles.optional}> (optional)</span>}
        </label>
      </dt>
      <dd className={styles.propValue}>{children}</dd>
    </div>
  );
}
