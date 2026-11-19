"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { STATUSES, TYPES } from "@/lib/constants";
import { toDay } from "@/lib/format";
import { useData } from "@/store/DataProvider";
import styles from "./NewTicketModal.module.scss";

const emptyForm = () => ({ title: "", type: "other", status: "todo", due_date: toDay(new Date()) });

/** Creates a ticket with its essentials, then opens it for the other fields. */
export function NewTicketModal({ open, onOpenChange, onCreated }) {
  const { createTicket } = useData();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function close(next) {
    if (!next) {
      setForm(emptyForm());
      setError(null);
    }
    onOpenChange(next);
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Task name is required.");
      return;
    }
    setSaving(true);
    const { ok, data } = await createTicket({
      title: form.title,
      type: form.type,
      status: form.status,
      due_date: form.due_date || null,
    });
    setSaving(false);
    if (!ok) return;
    close(false);
    onCreated?.(data);
  }

  return (
    <Modal
      open={open}
      onOpenChange={close}
      title="New ticket"
      footer={
        <>
          <Button variant="secondary" onClick={() => close(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="new-ticket-form" loading={saving}>
            Create ticket
          </Button>
        </>
      }
    >
      <form id="new-ticket-form" className={styles.form} onSubmit={onSubmit} noValidate>
        <Field label="Task name" error={error}>
          {(p) => (
            <Input {...p} value={form.title} onChange={set("title")} maxLength={200} autoFocus autoComplete="off" />
          )}
        </Field>
        <div className={styles.row}>
          <Field label="Type">
            {(p) => (
              <Select {...p} value={form.type} onChange={set("type")}>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Status">
            {(p) => (
              <Select {...p} value={form.status} onChange={set("status")}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
        <Field label="Date" optional hint="Needed to show the ticket on the calendar.">
          {(p) => <Input {...p} type="date" value={form.due_date} onChange={set("due_date")} />}
        </Field>
      </form>
    </Modal>
  );
}
