"use client";

import { Tooltip as RadixTooltip } from "radix-ui";
import styles from "./Tooltip.module.scss";

export function TooltipProvider({ children }) {
  return (
    <RadixTooltip.Provider delayDuration={600} skipDelayDuration={200}>
      {children}
    </RadixTooltip.Provider>
  );
}

/** Wraps a single focusable child. */
export function Tooltip({ content, children, side = "top" }) {
  if (!content) return children;
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content className={styles.tooltip} side={side} sideOffset={6} collisionPadding={8}>
          {content}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
