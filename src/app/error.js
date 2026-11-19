"use client";

import { CircleAlert } from "lucide-react";
import { useEffect } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import styles from "./status-page.module.scss";

/** Last-resort error boundary. Shows the technical details in development only. */
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isDev = process.env.NODE_ENV !== "production";

  return (
    <main className={styles.page}>
      <div>
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
        {isDev && error?.stack && <pre className={styles.details}>{error.stack}</pre>}
      </div>
    </main>
  );
}
