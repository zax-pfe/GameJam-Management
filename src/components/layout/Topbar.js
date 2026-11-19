"use client";

import { DropdownMenu } from "radix-ui";
import { LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { MenuItem } from "@/components/ui/Menu";
import menuStyles from "@/components/ui/Menu.module.scss";
import { RoleChip } from "@/components/ui/Chip";
import { fullName } from "@/lib/format";
import { useData } from "@/store/DataProvider";
import styles from "./Topbar.module.scss";

/** Page title (h1) on the left, primary action + user menu on the right. */
export function Topbar({ title, children }) {
  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        {children}
        <UserMenu />
      </div>
    </header>
  );
}

function UserMenu() {
  const { me, signOut } = useData();
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className={styles.userButton} aria-label={`Account: ${fullName(me)}`}>
        <Avatar member={me} size={32} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={menuStyles.menu} align="end" sideOffset={6} collisionPadding={8}>
          <div className={styles.identity}>
            <Avatar member={me} size={32} />
            <div className={styles.identityText}>
              <span className={styles.name}>{fullName(me)}</span>
              <span className={styles.email}>{me?.email}</span>
            </div>
          </div>
          {me && (
            <div className={styles.role}>
              <RoleChip role={me.role} />
            </div>
          )}
          <DropdownMenu.Separator className={menuStyles.separator} />
          <MenuItem icon={LogOut} onSelect={signOut}>
            Sign out
          </MenuItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

/** Centered content column (Dashboard, Team, Project Hub). */
export function PageBody({ children, wide = false }) {
  return <div className={wide ? styles.bodyWide : styles.body}>{children}</div>;
}
