"use client";

import { DropdownMenu } from "radix-ui";
import { Check, ChevronRight, Ellipsis } from "lucide-react";
import { cx } from "@/lib/cx";
import { IconButton } from "./IconButton";
import styles from "./Menu.module.scss";

/** Overflow (…) menu. `trigger` defaults to an icon button. */
export function Menu({ label = "More actions", trigger, children, align = "end" }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        {trigger ?? (
          <IconButton
            icon={Ellipsis}
            label={label}
            tooltip={false}
            // Don't start a drag / open the card when using the menu.
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={styles.menu}
          align={align}
          sideOffset={4}
          collisionPadding={8}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function MenuItem({ icon: Icon, children, danger, onSelect, disabled }) {
  return (
    <DropdownMenu.Item className={cx(styles.item, danger && styles.danger)} onSelect={onSelect} disabled={disabled}>
      {Icon && <Icon size={16} strokeWidth={1.5} aria-hidden />}
      {children}
    </DropdownMenu.Item>
  );
}

export function MenuSeparator() {
  return <DropdownMenu.Separator className={styles.separator} />;
}

export function MenuLabel({ children }) {
  return <DropdownMenu.Label className={styles.label}>{children}</DropdownMenu.Label>;
}

export function SubMenu({ icon: Icon, label, children }) {
  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger className={styles.item}>
        {Icon && <Icon size={16} strokeWidth={1.5} aria-hidden />}
        {label}
        <ChevronRight className={styles.chevron} size={16} strokeWidth={1.5} aria-hidden />
      </DropdownMenu.SubTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.SubContent className={styles.menu} sideOffset={4} collisionPadding={8}>
          {children}
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  );
}

/** Checkbox item that keeps the menu open (used by filters). */
export function MenuCheckItem({ checked, onCheckedChange, children }) {
  return (
    <DropdownMenu.CheckboxItem
      className={styles.item}
      checked={checked}
      onCheckedChange={onCheckedChange}
      onSelect={(e) => e.preventDefault()}
    >
      <span className={cx(styles.check, checked && styles.checked)} aria-hidden>
        {checked && <Check size={12} strokeWidth={2} />}
      </span>
      {children}
    </DropdownMenu.CheckboxItem>
  );
}
