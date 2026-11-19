"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { ImageDrop } from "@/components/ui/ImageDrop";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { RESOURCE_CATEGORIES } from "@/lib/constants";
import { normalizeUrl } from "@/lib/format";
import { imageUrl } from "@/lib/images";
import { useObjectUrl } from "@/lib/useObjectUrl";
import { useData } from "@/store/DataProvider";
import styles from "./ResourceFormModal.module.scss";

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Add or edit a link. `resource` null = create. Remount with a key to reset. */
export function ResourceFormModal({ open, onOpenChange, resource }) {
  const { createResource, updateResource } = useData();
  const toast = useToast();
  const [form, setForm] = useState(() => ({
    name: resource?.name ?? "",
    url: resource?.url ?? "",
    category: resource?.category ?? "design",
    description: resource?.description ?? "",
  }));
  const [thumbnail, setThumbnail] = useState(undefined); // File | null (remove) | undefined (keep)
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const previewUrl = useObjectUrl(thumbnail || null);
  const currentSrc = thumbnail === null ? null : previewUrl ?? imageUrl(resource?.thumbnail_path);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(event) {
    event.preventDefault();
    const url = normalizeUrl(form.url);
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!isValidUrl(url)) next.url = "Enter a valid URL (https://…).";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    const fields = {
      name: form.name.trim(),
      url,
      category: form.category,
      description: form.description.trim() || null,
    };
    const { ok } = resource
      ? await updateResource(resource.id, fields, thumbnail)
      : await createResource(fields, thumbnail);
    setSaving(false);
    if (ok) {
      toast(resource ? "Link updated" : "Link added");
      onOpenChange(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={resource ? "Edit link" : "Add link"}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="resource-form" loading={saving}>
            {resource ? "Save" : "Add link"}
          </Button>
        </>
      }
    >
      <form id="resource-form" className={styles.form} onSubmit={onSubmit} noValidate>
        <Field label="Name" error={errors.name}>
          {(p) => <Input {...p} value={form.name} onChange={set("name")} maxLength={120} autoFocus autoComplete="off" />}
        </Field>
        <Field label="URL" error={errors.url}>
          {(p) => (
            <Input
              {...p}
              type="url"
              inputMode="url"
              value={form.url}
              onChange={set("url")}
              placeholder="https://"
              autoComplete="off"
            />
          )}
        </Field>
        <Field label="Category">
          {(p) => (
            <Select {...p} value={form.category} onChange={set("category")}>
              {RESOURCE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Description" optional>
          {(p) => <Textarea {...p} value={form.description} onChange={set("description")} maxLength={500} rows={3} />}
        </Field>
        <div className={styles.thumb}>
          <span className={styles.thumbLabel}>
            Icon or thumbnail <span className={styles.optional}>(optional)</span>
          </span>
          <ImageDrop
            shape="square"
            label="thumbnail"
            src={currentSrc}
            onSelect={setThumbnail}
            onRemove={() => setThumbnail(null)}
          />
        </div>
      </form>
    </Modal>
  );
}
