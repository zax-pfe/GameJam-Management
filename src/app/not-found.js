import { Compass } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import styles from "./status-page.module.scss";

export const metadata = { title: "Page not found · Game Project Manager" };

export default function NotFound() {
  return (
    <main className={styles.page}>
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="This page doesn't exist or was moved."
        action={
          <Link href="/" className={styles.action}>
            Back to dashboard
          </Link>
        }
      />
    </main>
  );
}
