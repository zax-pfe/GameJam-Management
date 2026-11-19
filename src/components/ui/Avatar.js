import { cx } from "@/lib/cx";
import { fullName, initials } from "@/lib/format";
import { imageUrl } from "@/lib/images";
import { Tooltip } from "./Tooltip";
import styles from "./Avatar.module.scss";

/** Rounded-square avatar (16 / 24 / 32 / 64) with initials fallback. */
export function Avatar({ member, size = 24, className, withTooltip = false }) {
  const src = imageUrl(member?.avatar_path);
  const name = fullName(member);
  const node = (
    <span
      className={cx(styles.avatar, className)}
      style={{ "--avatar-size": `${size}px` }}
      role="img"
      aria-label={name}
      tabIndex={withTooltip ? 0 : undefined}
    >
      {src ? (
        <img src={src} alt="" loading="lazy" />
      ) : (
        // Small avatars only fit one letter at the 12px minimum text size.
        <span aria-hidden>{size <= 24 ? initials(member).slice(0, 1) : initials(member)}</span>
      )}
    </span>
  );
  return withTooltip ? <Tooltip content={name}>{node}</Tooltip> : node;
}

/** Overlapping avatars, max 3 then "+n". */
export function AvatarStack({ members, size = 24, max = 3 }) {
  if (!members.length) return null;
  const shown = members.slice(0, max);
  const rest = members.length - shown.length;
  const names = members.map(fullName).join(", ");
  return (
    <span className={styles.stack} style={{ "--avatar-size": `${size}px` }} aria-label={`Assigned: ${names}`} role="img">
      {shown.map((m) => (
        <Avatar key={m.id} member={m} size={size} className={styles.stacked} />
      ))}
      {rest > 0 && <span className={cx(styles.avatar, styles.stacked, styles.more)}>+{rest}</span>}
    </span>
  );
}
