"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { ImageDrop } from "@/components/ui/ImageDrop";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { ROLES } from "@/lib/constants";
import { imageUrl } from "@/lib/images";
import { useObjectUrl } from "@/lib/useObjectUrl";
import { useData } from "@/store/DataProvider";
import styles from "./MemberFormModal.module.scss";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Add or edit a member. `member` null = create. Remount with a key to reset. */
export function MemberFormModal({ open, onOpenChange, member }) {
  const { createMember, updateMember, me } = useData();
  // Changing your own email would lock you out (access is tied to the Google email).
  const isMe = Boolean(member) && member?.id === me?.id;
  const toast = useToast();
  const [form, setForm] = useState(() => ({
    first_name: member?.first_name ?? "",
    last_name: member?.last_name ?? "",
    email: member?.email ?? "",
    role: member?.role ?? "developer",
  }));
  const [avatar, setAvatar] = useState(undefined); // File | null (remove) | undefined (keep)
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const previewUrl = useObjectUrl(avatar || null);

  const currentSrc = avatar === null ? null : previewUrl ?? imageUrl(member?.avatar_path);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate() {
    const next = {};
    if (!form.first_name.trim()) next.first_name = "First name is required.";
    if (!form.last_name.trim()) next.last_name = "Last name is required.";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const fields = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
    };
    const { ok } = member ? await updateMember(member?.id, fields, avatar) : await createMember(fields, avatar);
    setSaving(false);
    if (ok) {
      toast(member ? "Member updated" : "Member added");
      onOpenChange(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={member ? "Edit member" : "Add member"}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="member-form" loading={saving}>
            {member ? "Save" : "Add member"}
          </Button>
        </>
      }
    >
      <form id="member-form" className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.photo}>
          <span className={styles.photoLabel}>
            Photo <span className={styles.optional}>(optional)</span>
          </span>
          <div className={styles.photoRow}>
            {!currentSrc && <Avatar member={{ first_name: form.first_name, last_name: form.last_name }} size={64} />}
            <ImageDrop
              shape="square"
              label="photo"
              src={currentSrc}
              onSelect={setAvatar}
              onRemove={() => setAvatar(null)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <Field label="First name" error={errors.first_name}>
            {(p) => <Input {...p} value={form.first_name} onChange={set("first_name")} autoComplete="off" autoFocus />}
          </Field>
          <Field label="Last name" error={errors.last_name}>
            {(p) => <Input {...p} value={form.last_name} onChange={set("last_name")} autoComplete="off" />}
          </Field>
        </div>

        <Field
          label="Google account email"
          error={errors.email}
          hint={isMe ? "You can't change your own sign-in email." : "Only this account can sign in as this member."}
        >
          {(p) => (
            <Input
              {...p}
              type="email"
              value={form.email}
              onChange={set("email")}
              disabled={isMe}
              autoComplete="off"
              placeholder="name@gmail.com"
            />
          )}
        </Field>

        <Field label="Role">
          {(p) => (
            <Select {...p} value={form.role} onChange={set("role")}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </form>
    </Modal>
  );
}
