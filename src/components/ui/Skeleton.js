import { cx } from "@/lib/cx";
import styles from "./Skeleton.module.scss";

/** Static block with a subtle opacity pulse. Size it like the component it replaces. */
export function Skeleton({ width = "100%", height = 16, className, style }) {
  return <span aria-hidden className={cx(styles.skeleton, className)} style={{ width, height, ...style }} />;
}
