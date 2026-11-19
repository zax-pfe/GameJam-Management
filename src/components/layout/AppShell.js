"use client";

import { CircleAlert, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ToastProvider } from "@/components/ui/Toast";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { DataProvider, useData } from "@/store/DataProvider";
import { BottomNav, Sidebar } from "./Sidebar";
import styles from "./AppShell.module.scss";

export function AppShell({ children }) {
  return (
    <TooltipProvider>
      <ToastProvider>
        <DataProvider>
          <div className={styles.shell}>
            <Sidebar />
            <div className={styles.main}>
              <DataGate>{children}</DataGate>
            </div>
            <BottomNav />
          </div>
        </DataProvider>
      </ToastProvider>
    </TooltipProvider>
  );
}

/** Pages render only once the shared data is loaded. */
function DataGate({ children }) {
  const { status, retry } = useData();

  if (status === "ready") return children;

  if (status === "error") {
    return (
      <div className={styles.state}>
        <EmptyState
          icon={CircleAlert}
          title="Couldn't load the project"
          description="Check your connection, then try again."
          action={
            <Button variant="primary" icon={RotateCcw} onClick={retry}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div aria-busy="true" aria-label="Loading">
      <div className={styles.topbarSkeleton}>
        <Skeleton width={160} height={24} />
        <Skeleton width={32} height={32} />
      </div>
      <div className={styles.state}>
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} height={120} />
          ))}
        </div>
      </div>
    </div>
  );
}
