import { cx } from "@/lib/cx";
import styles from "./EmptyState.module.scss";

/** Icon in an outlined square with corner marks, one-line title + description, one action. */
export function EmptyState({ icon: Icon, title, description, action, compact = false, className }) {
  return (
    <div className={cx(styles.empty, compact && styles.compact, className)}>
      <span className={styles.iconBox} aria-hidden>
        <Icon size={20} strokeWidth={1.5} />
      </span>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
