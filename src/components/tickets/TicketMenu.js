"use client";

import { ArrowRightLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Menu, MenuItem, MenuSeparator, SubMenu } from "@/components/ui/Menu";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { STATUSES } from "@/lib/constants";
import { topPosition } from "@/lib/tickets";
import { useData } from "@/store/DataProvider";

/**
 * Card overflow menu: Edit, Move to (keyboard / mobile alternative
 * to drag & drop), Delete (with confirmation).
 */
export function TicketMenu({ ticket, onOpen }) {
  const { tickets, updateTicket, deleteTicket } = useData();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);

  function moveTo(status) {
    // Goes to the top of the target column.
    updateTicket(ticket.id, { status, position: topPosition(tickets, status) });
  }

  return (
    // React events bubble through portals: keep the menu / dialog from
    // opening or dragging the card underneath.
    <span
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <Menu label={`Actions for ${ticket.title}`}>
        <MenuItem icon={Pencil} onSelect={() => onOpen?.(ticket.id)}>
          Edit
        </MenuItem>
        <SubMenu icon={ArrowRightLeft} label="Move to">
          {STATUSES.filter((s) => s.value !== ticket.status).map((s) => (
            <MenuItem key={s.value} icon={s.icon} onSelect={() => moveTo(s.value)}>
              {s.label}
            </MenuItem>
          ))}
        </SubMenu>
        <MenuSeparator />
        <MenuItem icon={Trash2} danger onSelect={() => setConfirming(true)}>
          Delete
        </MenuItem>
      </Menu>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Delete this ticket?"
        description={`“${ticket.title}” and its comments will be permanently deleted.`}
        onConfirm={async () => {
          const { ok } = await deleteTicket(ticket.id);
          if (ok) toast("Ticket deleted");
        }}
      />
    </span>
  );
}
