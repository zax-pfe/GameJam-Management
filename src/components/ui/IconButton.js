import { cx } from "@/lib/cx";
import { Tooltip } from "./Tooltip";
import styles from "./IconButton.module.scss";

/** 32px ghost square button. `label` is both the aria-label and the tooltip. */
export function IconButton({ icon: Icon, label, className, size = 16, tooltip = true, ref, ...props }) {
  const button = (
    <button ref={ref} type="button" aria-label={label} className={cx(styles.iconButton, className)} {...props}>
      <Icon size={size} strokeWidth={1.5} aria-hidden />
    </button>
  );
  return tooltip ? <Tooltip content={label}>{button}</Tooltip> : button;
}
