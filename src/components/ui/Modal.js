"use client";

import { AlertDialog, Dialog } from "radix-ui";
import { X } from "lucide-react";
import { useState } from "react";
import { cx } from "@/lib/cx";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import styles from "./Modal.module.scss";

/** Form modal (560px). Becomes a bottom sheet on mobile. */
export function Modal({ open, onOpenChange, title, description, children, footer, size = "form" }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={cx(styles.modal, size === "confirm" && styles.confirm)}
          // Radix warns when there is no Description unless this is explicitly undefined.
          {...(description ? {} : { "aria-describedby": undefined })}
        >
          <header className={styles.header}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            <Dialog.Close asChild>
              <IconButton icon={X} label="Close" tooltip={false} />
            </Dialog.Close>
          </header>
          {description && <Dialog.Description className={styles.description}>{description}</Dialog.Description>}
          <div className={styles.body}>{children}</div>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * Every delete goes through this dialog. `onConfirm` may be async;
 * the dialog stays open with a loading button until it resolves.
 */
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Delete", onConfirm }) {
  const [busy, setBusy] = useState(false);

  async function handleConfirm(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={styles.overlay} />
        <AlertDialog.Content className={cx(styles.modal, styles.confirm)}>
          <header className={styles.header}>
            <AlertDialog.Title className={styles.title}>{title}</AlertDialog.Title>
          </header>
          <AlertDialog.Description className={styles.description}>{description}</AlertDialog.Description>
          <footer className={styles.footer}>
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" disabled={busy}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="danger" loading={busy} onClick={handleConfirm}>
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </footer>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
