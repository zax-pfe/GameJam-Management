import { LoaderCircle } from "lucide-react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.scss";

/**
 * variant: primary (one per view) | secondary | ghost | danger (confirm dialogs only)
 * size: sm | md | lg
 */
export function Button({
  variant = "secondary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ref,
  ...props
}) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.button, styles[variant], styles[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <LoaderCircle className={styles.spinner} size={16} strokeWidth={1.5} aria-hidden />
      ) : (
        Icon && <Icon size={16} strokeWidth={1.5} aria-hidden />
      )}
      {children}
    </button>
  );
}
