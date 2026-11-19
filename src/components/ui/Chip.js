import { COMPLEXITY, RESOURCE_CATEGORY, ROLE, STATUS, TYPE } from "@/lib/constants";
import { cx } from "@/lib/cx";
import styles from "./Chip.module.scss";

function ColorChip({ item, className }) {
  if (!item) return null;
  const Icon = item.icon;
  return (
    <span className={cx(styles.chip, styles.tinted, className)} style={{ "--chip-color": `var(${item.color})` }}>
      <Icon className={styles.icon} size={14} strokeWidth={1.5} aria-hidden />
      {item.label}
    </span>
  );
}

export function TypeChip({ type, className }) {
  return <ColorChip item={TYPE[type]} className={className} />;
}

export function StatusChip({ status, className }) {
  return <ColorChip item={STATUS[status]} className={className} />;
}

/** Status icon alone (calendar / category cards). Labelled for screen readers. */
export function StatusIcon({ status, size = 16 }) {
  const item = STATUS[status];
  if (!item) return null;
  const Icon = item.icon;
  return (
    <Icon
      size={size}
      strokeWidth={1.5}
      role="img"
      aria-label={`Status: ${item.label}`}
      style={{ color: `var(${item.color})`, flexShrink: 0 }}
    />
  );
}

/** Roles are neutral, never color-coded. */
export function RoleChip({ role, className }) {
  return <span className={cx(styles.chip, styles.neutral, className)}>{ROLE[role]?.label ?? "Other"}</span>;
}

export function CategoryChip({ category, className }) {
  const item = RESOURCE_CATEGORY[category] ?? RESOURCE_CATEGORY.other;
  const Icon = item.icon;
  return (
    <span className={cx(styles.chip, styles.neutral, className)}>
      <Icon size={14} strokeWidth={1.5} aria-hidden />
      {item.label}
    </span>
  );
}

/** 3 vertical bars, 1/2/3 filled. Hidden when complexity is empty. */
export function ComplexityIndicator({ complexity }) {
  const item = COMPLEXITY[complexity];
  if (!item) return null;
  return (
    <span className={styles.complexity} role="img" aria-label={`Complexity: ${item.label}`} title={`Complexity: ${item.label}`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={cx(styles.bar, n <= item.level && styles.barFilled)} />
      ))}
    </span>
  );
}
