"use client";

import { ArrowRight, Library, Plus, SquareKanban } from "lucide-react";
import Link from "next/link";
import { ResourceCard } from "@/components/hub/ResourceCard";
import { PageBody, Topbar } from "@/components/layout/Topbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { RESOURCE_CATEGORIES, STATUS } from "@/lib/constants";
import { ticketStats } from "@/lib/stats";
import { useData } from "@/store/DataProvider";
import styles from "./DashboardView.module.scss";

const HUB_PREVIEW_COUNT = 6;

export function DashboardView() {
  const { tickets, resources } = useData();
  const stats = ticketStats(tickets);

  return (
    <>
      <Topbar title="Dashboard" />
      <PageBody>
        <div className={styles.top}>
          <ProgressCard stats={stats} />
          <div className={styles.tiles}>
            <StatTile label="Total" value={stats.total} icon={SquareKanban} />
            <StatTile label={STATUS.todo.label} value={stats.todo} status="todo" />
            <StatTile label={STATUS.in_progress.label} value={stats.inProgress} status="in_progress" />
            <StatTile label={STATUS.done.label} value={stats.done} status="done" />
          </div>
        </div>
        <HubPreview resources={resources} />
      </PageBody>
    </>
  );
}

function ProgressCard({ stats }) {
  const { total, done, inProgress, todo, percent } = stats;
  const share = (n) => (total ? (n / total) * 100 : 0);

  return (
    <section className={styles.progress} aria-labelledby="progress-title">
      <span className={styles.cornerTop} aria-hidden />
      <span className={styles.cornerBottom} aria-hidden />
      <div className={styles.progressHeader}>
        <h2 id="progress-title" className={styles.kicker}>
          Project progress
        </h2>
        <p className={styles.percent}>
          {percent === null ? "—" : <>{percent}<span className={styles.unit}>%</span></>}
        </p>
        <p className={styles.caption}>
          {total === 0 ? "No tickets yet" : `${done} of ${total} tickets done`}
        </p>
      </div>

      {total === 0 ? (
        <EmptyState
          compact
          icon={SquareKanban}
          title="Nothing to measure yet"
          description="Progress appears as soon as the first ticket exists."
          action={
            <Link href="/tasks" className={styles.cta}>
              <Plus size={16} strokeWidth={1.5} aria-hidden />
              Create tickets
            </Link>
          }
        />
      ) : (
        <div className={styles.progressBody}>
          <div
            className={styles.bar}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="Project progress"
          >
            <span className={styles.segDone} style={{ width: `${share(done)}%` }} />
            <span className={styles.segProgress} style={{ width: `${share(inProgress)}%` }} />
          </div>
          <div className={styles.ticks} aria-hidden>
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i} className={styles.tick}>
                {i % 5 === 0 && <span className={styles.tickLabel}>{i * 10}</span>}
              </span>
            ))}
          </div>
          <ul className={styles.legend}>
            <LegendItem status="done" count={done} />
            <LegendItem status="in_progress" count={inProgress} />
            <LegendItem status="todo" count={todo} />
          </ul>
        </div>
      )}
    </section>
  );
}

function LegendItem({ status, count }) {
  const item = STATUS[status];
  const Icon = item.icon;
  return (
    <li className={styles.legendItem}>
      <Icon size={14} strokeWidth={1.5} style={{ color: `var(${item.color})` }} aria-hidden />
      {item.label}
      <span className={styles.legendCount}>{count}</span>
    </li>
  );
}

function StatTile({ label, value, status, icon }) {
  const item = status ? STATUS[status] : null;
  const Icon = item?.icon ?? icon;
  return (
    <div className={styles.tile}>
      <p className={styles.tileLabel}>
        <Icon size={16} strokeWidth={1.5} style={item ? { color: `var(${item.color})` } : undefined} aria-hidden />
        {label}
      </p>
      <p className={styles.tileValue}>{value}</p>
    </div>
  );
}

function HubPreview({ resources }) {
  // Up to 6 links, grouped by category (category order).
  const shown = RESOURCE_CATEGORIES.flatMap((c) => resources.filter((r) => r.category === c.value)).slice(
    0,
    HUB_PREVIEW_COUNT,
  );
  const groups = RESOURCE_CATEGORIES.map((c) => ({ ...c, items: shown.filter((r) => r.category === c.value) })).filter(
    (g) => g.items.length,
  );

  return (
    <section className={styles.hub} aria-labelledby="hub-title">
      <header className={styles.hubHeader}>
        <h2 id="hub-title" className={styles.sectionTitle}>
          Project Hub
        </h2>
        <Link href="/hub" className={styles.viewAll}>
          View all{resources.length ? ` (${resources.length})` : ""}
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
        </Link>
      </header>

      {groups.length === 0 ? (
        <EmptyState
          compact
          icon={Library}
          title="No shared links yet"
          description="Add the team's Figma, Drive, repo and docs links in the Project Hub."
        />
      ) : (
        <div className={styles.hubGroups}>
          {groups.map(({ value, label, items }) => (
            <div key={value} className={styles.hubGroup}>
              <h3 className={styles.hubGroupTitle}>{label}</h3>
              <ul className={styles.hubGrid}>
                {items.map((r) => (
                  <li key={r.id}>
                    <ResourceCard resource={r} compact />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
