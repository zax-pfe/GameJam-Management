"use client";

import { CircleAlert } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import styles from "./status-page.module.scss";

/** Last-resort error boundary. */
export default function Error({ reset }) {
  return (
    <main className={styles.page}>
      <EmptyState
        icon={CircleAlert}
        title="Something went wrong"
        description="The page crashed. Try again; your saved work is safe."
        action={
          <button type="button" className={styles.action} onClick={() => reset()}>
            Try again
          </button>
        }
      />
    </main>
  );
}
