import { useId } from "react";
import { ChevronDown, CircleAlert } from "lucide-react";
import { cx } from "@/lib/cx";
import styles from "./Field.module.scss";

/**
 * Label above, optional marker, error below. `children` is a render function
 * receiving the input props ({ id, aria-invalid, aria-describedby }).
 */
export function Field({ label, optional, error, hint, className, children }) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}>(optional)</span>}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          <CircleAlert size={14} strokeWidth={1.5} aria-hidden />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function Input({ className, ref, ...props }) {
  return <input ref={ref} className={cx(styles.input, className)} {...props} />;
}

export function Textarea({ className, ref, ...props }) {
  return <textarea ref={ref} className={cx(styles.input, styles.textarea, className)} {...props} />;
}

/** Native select (accessible, works everywhere) styled with the tokens. */
export function Select({ className, children, ref, ...props }) {
  return (
    <div className={cx(styles.selectWrap, className)}>
      <select ref={ref} className={cx(styles.input, styles.select)} {...props}>
        {children}
      </select>
      <ChevronDown className={styles.chevron} size={16} strokeWidth={1.5} aria-hidden />
    </div>
  );
}
