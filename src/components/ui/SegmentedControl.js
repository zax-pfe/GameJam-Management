"use client";

import { cx } from "@/lib/cx";
import styles from "./SegmentedControl.module.scss";

/** Tabs-like segmented control (Kanban | Calendar | Category, Month | Week). */
export function SegmentedControl({ label, options, value, onChange, className }) {
  function onKeyDown(event) {
    const index = options.findIndex((o) => o.value === value);
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = options[(index + delta + options.length) % options.length];
    onChange(next.value);
    event.currentTarget.querySelector(`[data-value="${next.value}"]`)?.focus();
  }

  return (
    <div role="radiogroup" aria-label={label} className={cx(styles.track, className)} onKeyDown={onKeyDown}>
      {options.map(({ value: v, label: l, icon: Icon }) => {
        const selected = v === value;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            data-value={v}
            className={cx(styles.segment, selected && styles.selected)}
            onClick={() => onChange(v)}
          >
            {Icon && <Icon size={16} strokeWidth={1.5} aria-hidden />}
            <span>{l}</span>
          </button>
        );
      })}
    </div>
  );
}
