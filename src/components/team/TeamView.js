"use client";

import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { PageBody, Topbar } from "@/components/layout/Topbar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { RoleChip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Menu, MenuItem } from "@/components/ui/Menu";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { fullName } from "@/lib/format";
import { useData } from "@/store/DataProvider";
import { MemberFormModal } from "./MemberFormModal";
import styles from "./TeamView.module.scss";

export function TeamView() {
  const { members, me, deleteMember } = useData();
  const toast = useToast();
  const [editing, setEditing] = useState(null); // null | "new" | member
  const [deleting, setDeleting] = useState(null);

  return (
    <>
      <Topbar title="Team">
        <Button variant="primary" icon={Plus} onClick={() => setEditing("new")}>
          Add member
        </Button>
      </Topbar>

      <PageBody>
        <p className={styles.count}>
          {members.length} {members.length === 1 ? "member" : "members"}
        </p>

        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No team members yet"
            description="Add teammates so they can sign in and be assigned to tickets."
            action={
              <Button variant="primary" icon={Plus} onClick={() => setEditing("new")}>
                Add member
              </Button>
            }
          />
        ) : (
          <ul className={styles.grid}>
            {members.map((member) => {
              const isMe = member.id === me?.id;
              return (
                <li key={member.id} className={styles.card}>
                  <Avatar member={member} size={64} />
                  <div className={styles.info}>
                    <h3 className={styles.name}>
                      {fullName(member)}
                      {isMe && <span className={styles.you}>You</span>}
                    </h3>
                    <RoleChip role={member.role} />
                    <p className={styles.email}>{member.email}</p>
                  </div>
                  <div className={styles.menu}>
                    <Menu label={`Actions for ${fullName(member)}`}>
                      <MenuItem icon={Pencil} onSelect={() => setEditing(member)}>
                        Edit
                      </MenuItem>
                      <MenuItem
                        icon={Trash2}
                        danger
                        disabled={isMe}
                        onSelect={() => setDeleting(member)}
                      >
                        {isMe ? "Can't delete yourself" : "Delete"}
                      </MenuItem>
                    </Menu>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </PageBody>

      <MemberFormModal
        key={editing === "new" ? "new" : editing?.id ?? "closed"}
        open={editing !== null}
        member={editing === "new" ? null : editing}
        onOpenChange={(open) => !open && setEditing(null)}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${fullName(deleting)}?`}
        description="They will lose access to the app and be unassigned from every ticket. Their comments stay, shown as “Former member”."
        onConfirm={async () => {
          const { ok } = await deleteMember(deleting.id);
          if (ok) toast("Member deleted");
        }}
      />
    </>
  );
}
