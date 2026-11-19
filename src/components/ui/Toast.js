"use client";

import { Toast as RadixToast } from "radix-ui";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { createContext, use, useCallback, useState } from "react";
import { cx } from "@/lib/cx";
import styles from "./Toast.module.scss";

const ToastContext = createContext(null);
let nextId = 0;

/** Bottom-right toasts, max 3, auto-dismiss 4s (errors 6s). */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, { tone = "info" } = {}) => {
    const id = ++nextId;
    setToasts((list) => [...list.slice(-2), { id, message, tone }]);
  }, []);

  const remove = (id) => setToasts((list) => list.filter((t) => t.id !== id));

  return (
    <ToastContext value={toast}>
      <RadixToast.Provider swipeDirection="right" label="Notification">
        {children}
        {toasts.map((t) => (
          <RadixToast.Root
            key={t.id}
            className={cx(styles.toast, t.tone === "error" && styles.error)}
            duration={t.tone === "error" ? 6000 : 4000}
            type={t.tone === "error" ? "foreground" : "background"}
            onOpenChange={(open) => !open && remove(t.id)}
          >
            {t.tone === "error" ? (
              <CircleAlert className={styles.icon} size={16} strokeWidth={1.5} aria-hidden />
            ) : (
              <CircleCheck className={styles.icon} size={16} strokeWidth={1.5} aria-hidden />
            )}
            <RadixToast.Description className={styles.message}>{t.message}</RadixToast.Description>
            <RadixToast.Close className={styles.close} aria-label="Dismiss">
              <X size={14} strokeWidth={1.5} aria-hidden />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className={styles.viewport} />
      </RadixToast.Provider>
    </ToastContext>
  );
}

/** `toast("Saved")` or `toast("Could not save", { tone: "error" })` */
export function useToast() {
  return use(ToastContext);
}
