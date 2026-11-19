"use client";

import { Library, Plus } from "lucide-react";
import { useState } from "react";
import { PageBody, Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { RESOURCE_CATEGORIES } from "@/lib/constants";
import { useData } from "@/store/DataProvider";
import { ResourceCard } from "./ResourceCard";
import { ResourceFormModal } from "./ResourceFormModal";
import styles from "./HubView.module.scss";

/** Shared links, grouped by category. */
export function HubView() {
  const { resources, deleteResource } = useData();
  const toast = useToast();
  const [editing, setEditing] = useState(null); // null | "new" | resource
  const [deleting, setDeleting] = useState(null);

  const groups = RESOURCE_CATEGORIES.map((category) => ({
    ...category,
    items: resources.filter((r) => r.category === category.value),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <Topbar title="Project Hub">
        <Button variant="primary" icon={Plus} onClick={() => setEditing("new")}>
          Add link
        </Button>
      </Topbar>

      <PageBody>
        {groups.length === 0 ? (
          <EmptyState
            icon={Library}
            title="No shared links yet"
            description="Gather the Figma files, Drive folders, repos and docs the team uses every day."
            action={
              <Button variant="primary" icon={Plus} onClick={() => setEditing("new")}>
                Add link
              </Button>
            }
          />
        ) : (
          <div className={styles.groups}>
            {groups.map(({ value, label, icon: Icon, items }) => (
              <section key={value} className={styles.group} aria-labelledby={`hub-${value}`}>
                <h2 id={`hub-${value}`} className={styles.groupTitle}>
                  <Icon size={16} strokeWidth={1.5} aria-hidden />
                  {label}
                  <span className={styles.count}>{items.length}</span>
                </h2>
                <ul className={styles.grid}>
                  {items.map((resource) => (
                    <li key={resource.id}>
                      <ResourceCard resource={resource} onEdit={setEditing} onDelete={setDeleting} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </PageBody>

      <ResourceFormModal
        key={editing === "new" ? "new" : editing?.id ?? "closed"}
        open={editing !== null}
        resource={editing === "new" ? null : editing}
        onOpenChange={(open) => !open && setEditing(null)}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete “${deleting?.name ?? ""}”?`}
        description="The link will be removed from the Project Hub for the whole team."
        onConfirm={async () => {
          if (!deleting) return;
          const { ok } = await deleteResource(deleting?.id);
          if (ok) toast("Link deleted");
        }}
      />
    </>
  );
}
