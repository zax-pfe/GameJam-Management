"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "@/components/ui/Tooltip";
import { cx } from "@/lib/cx";
import { NAV_ITEMS, isActive } from "./nav";
import styles from "./Sidebar.module.scss";

/** 240px sidebar on desktop, 64px icon rail on tablet. Hidden on mobile. */
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand} aria-label="Game Project Manager, dashboard">
        <span className={styles.mark} aria-hidden>
          GPM
        </span>
        <span className={styles.brandName}>Game Project Manager</span>
      </Link>
      <nav aria-label="Main">
        <ul className={styles.list}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Tooltip content={label} side="right">
                  <Link
                    href={href}
                    className={cx(styles.item, active && styles.active)}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={20} strokeWidth={1.5} aria-hidden />
                    <span className={styles.label}>{label}</span>
                  </Link>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

/** Mobile bottom tab bar (4 items). */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.bottom} aria-label="Main">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={cx(styles.tab, active && styles.tabActive)}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={20} strokeWidth={1.5} aria-hidden />
            <span>{label === "Project Hub" ? "Hub" : label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
