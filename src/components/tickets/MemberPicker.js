"use client";

import { DropdownMenu } from "radix-ui";
import { Plus, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { MenuCheckItem } from "@/components/ui/Menu";
import menuStyles from "@/components/ui/Menu.module.scss";
import { fullName } from "@/lib/format";
import { useData } from "@/store/DataProvider";
import styles from "./MemberPicker.module.scss";

/** Multi-select: selected members as removable chips + a checklist menu. */
export function MemberPicker({ value, onChange, id }) {
  const { members, membersById } = useData();
  const selected = value.map((memberId) => membersById.get(memberId)).filter(Boolean);

  const toggle = (memberId, checked) =>
    onChange(checked ? [...value, memberId] : value.filter((v) => v !== memberId));

  return (
    <div className={styles.picker}>
      {selected.map((m) => (
        <span key={m.id} className={styles.chip}>
          <Avatar member={m} size={16} />
          <span className={styles.name}>{fullName(m)}</span>
          <button
            type="button"
            className={styles.remove}
            aria-label={`Unassign ${fullName(m)}`}
            onClick={() => toggle(m.id, false)}
          >
            <X size={12} strokeWidth={1.5} aria-hidden />
          </button>
        </span>
      ))}

      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger id={id} className={styles.add}>
          <Plus size={14} strokeWidth={1.5} aria-hidden />
          {selected.length ? "Add" : "Assign"}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={menuStyles.menu} align="start" sideOffset={4} collisionPadding={8}>
            {members.length === 0 && <p className={styles.empty}>No team members yet.</p>}
            {members.map((m) => (
              <MenuCheckItem key={m.id} checked={value.includes(m.id)} onCheckedChange={(c) => toggle(m.id, c)}>
                <Avatar member={m} size={16} />
                {fullName(m)}
              </MenuCheckItem>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
