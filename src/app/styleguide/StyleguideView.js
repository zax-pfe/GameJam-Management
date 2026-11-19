"use client";

import { CircleCheck, Plus, SquareKanban, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ResourceCard } from "@/components/hub/ResourceCard";
import { TicketCard } from "@/components/tickets/TicketCard";
import { TicketPanel } from "@/components/tickets/TicketPanel";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { CategoryChip, ComplexityIndicator, RoleChip, StatusChip, TypeChip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { RESOURCE_CATEGORIES, ROLES, STATUSES, TYPES } from "@/lib/constants";
import { DataContext } from "@/store/DataProvider";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { HubView } from "@/components/hub/HubView";
import shellStyles from "@/components/layout/AppShell.module.scss";
import { BottomNav, Sidebar } from "@/components/layout/Sidebar";
import { TasksView } from "@/components/tasks/TasksView";
import { TeamView } from "@/components/team/TeamView";
import { SAMPLE_BOARD, SAMPLE_COMMENTS, SAMPLE_MEMBERS, SAMPLE_RESOURCES, SAMPLE_TICKETS } from "./sampleData";

// ?screen=… renders a real page with the sample data (visual QA without Supabase).
const SCREENS = { dashboard: DashboardView, tasks: TasksView, team: TeamView, hub: HubView };
import styles from "./styleguide.module.scss";

const COLOR_TOKENS = [
  "canvas", "surface", "surface-raised", "primary", "text", "text-muted", "text-subtle", "accent", "accent-hover",
  "accent-text", "on-accent", "guide", "line", "line-strong", "danger", "status-todo", "status-in-progress",
  "status-done", "type-design", "type-development", "type-3d", "type-2d-art", "type-ui-ux", "type-audio", "type-other",
];

const TYPE_SCALE = [
  ["display", "72%", { fontFamily: "var(--font-mono)", fontSize: "var(--text-display)", fontWeight: 700 }],
  ["h1", "Page title", { fontFamily: "var(--font-mono)", fontSize: "var(--text-h1)", fontWeight: 600 }],
  ["h2", "Section title", { fontFamily: "var(--font-mono)", fontSize: "var(--text-h2)", fontWeight: 600 }],
  ["h3", "Card title", { fontFamily: "var(--font-sans)", fontSize: "var(--text-h3)", fontWeight: 600 }],
  ["body", "Body text for descriptions and comments.", { fontSize: "var(--text-body)" }],
  ["body-sm", "Secondary text and metadata.", { fontSize: "var(--text-body-sm)" }],
  ["label", "LABEL / METADATA", { fontFamily: "var(--font-mono)", fontSize: "var(--text-label)", fontWeight: 500, letterSpacing: "0.06em" }],
  ["data", "12h · 19 Nov 2026 · 42", { fontFamily: "var(--font-mono)", fontSize: "var(--text-data)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }],
];

/** Fake store so real components render without Supabase. Writes stay local. */
function SampleData({ children, tickets: initialTickets }) {
  const [tickets, setTickets] = useState(initialTickets);
  const toast = useToast();
  const ok = async () => ({ ok: true });
  const notSaved = async () => {
    toast("Styleguide: changes are not saved");
    return { ok: false };
  };
  const value = {
    status: "ready",
    me: SAMPLE_MEMBERS[0],
    members: SAMPLE_MEMBERS,
    membersById: new Map(SAMPLE_MEMBERS.map((m) => [m.id, m])),
    tickets,
    resources: SAMPLE_RESOURCES,
    updateTicket: async (id, patch) => {
      setTickets((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)));
      return ok();
    },
    loadComments: async (id) => SAMPLE_COMMENTS[id] ?? [],
    watchComments: () => () => {},
    createTicket: notSaved,
    deleteTicket: notSaved,
    setTicketImage: notSaved,
    addComment: notSaved,
    signOut: notSaved,
  };
  return <DataContext value={value}>{children}</DataContext>;
}

export function StyleguideView() {
  const Screen = SCREENS[useSearchParams().get("screen")];
  return (
    <TooltipProvider>
      <ToastProvider>
        <SampleData tickets={Screen ? SAMPLE_BOARD : SAMPLE_TICKETS}>
          {Screen ? (
            <div className={shellStyles.shell}>
              <Sidebar />
              <div className={shellStyles.main}>
                <Screen />
              </div>
              <BottomNav />
            </div>
          ) : (
            <Styleguide />
          )}
        </SampleData>
      </ToastProvider>
    </TooltipProvider>
  );
}

function Styleguide() {
  const toast = useToast();
  const [segment, setSegment] = useState("kanban");
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  // ?panel=t1 opens the ticket panel directly (design validation).
  const [panel, setPanel] = useState(useSearchParams().get("panel"));

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Styleguide</h1>
      <p className={styles.lead}>Dev only. Tokens and components from DESIGN.MD, in every state.</p>

      <Section title="Colors">
        <div className={styles.swatches}>
          {COLOR_TOKENS.map((name) => (
            <div key={name} className={styles.swatch}>
              <span className={styles.swatchColor} style={{ background: `var(--color-${name})` }} />
              <code>--color-{name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className={styles.stack}>
          {TYPE_SCALE.map(([name, sample, style]) => (
            <div key={name} className={styles.typeRow}>
              <code>{name}</code>
              <span style={style}>{sample}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div className={styles.row}>
          <Button variant="primary" icon={Plus}>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger" icon={Trash2}>Danger</Button>
          <IconButton icon={Plus} label="Icon button" />
        </div>
        <div className={styles.row}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Inputs">
        <div className={styles.formGrid}>
          <Field label="Default">{(p) => <Input {...p} placeholder="Placeholder" />}</Field>
          <Field label="Optional" optional hint="Helper text below the field.">{(p) => <Input {...p} defaultValue="Value" />}</Field>
          <Field label="Error" error="This field is required.">{(p) => <Input {...p} />}</Field>
          <Field label="Disabled">{(p) => <Input {...p} disabled defaultValue="Disabled" />}</Field>
          <Field label="Select">
            {(p) => (
              <Select {...p} defaultValue="developer">
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </Select>
            )}
          </Field>
          <Field label="Date">{(p) => <Input {...p} type="date" defaultValue="2026-11-19" />}</Field>
          <Field label="Textarea" className={styles.full}>{(p) => <Textarea {...p} placeholder="Write a comment…" />}</Field>
        </div>
      </Section>

      <Section title="Chips">
        <div className={styles.row}>{TYPES.map((t) => <TypeChip key={t.value} type={t.value} />)}</div>
        <div className={styles.row}>{STATUSES.map((s) => <StatusChip key={s.value} status={s.value} />)}</div>
        <div className={styles.row}>
          {ROLES.slice(0, 4).map((r) => <RoleChip key={r.value} role={r.value} />)}
          {RESOURCE_CATEGORIES.slice(0, 3).map((c) => <CategoryChip key={c.value} category={c.value} />)}
        </div>
        <div className={styles.row}>
          <ComplexityIndicator complexity="simple" />
          <ComplexityIndicator complexity="medium" />
          <ComplexityIndicator complexity="complex" />
        </div>
      </Section>

      <Section title="Avatars">
        <div className={styles.row}>
          {[16, 24, 32, 64].map((size) => <Avatar key={size} member={SAMPLE_MEMBERS[1]} size={size} />)}
          <AvatarStack members={SAMPLE_MEMBERS} />
        </div>
      </Section>

      <Section title="Controls and feedback">
        <div className={styles.row}>
          <SegmentedControl
            label="View"
            value={segment}
            onChange={setSegment}
            options={[{ value: "kanban", label: "Kanban" }, { value: "calendar", label: "Calendar" }, { value: "category", label: "Category" }]}
          />
          <Button onClick={() => toast("Ticket saved")}>Toast</Button>
          <Button onClick={() => toast("Couldn't save your changes.", { tone: "error" })}>Error toast</Button>
          <Button onClick={() => setModal(true)}>Modal</Button>
          <Button onClick={() => setConfirm(true)}>Confirm dialog</Button>
        </div>
        <div className={styles.twoCols}>
          <EmptyState
            icon={SquareKanban}
            title="No tickets yet"
            description="Create the first task of the game."
            action={<Button variant="primary" icon={Plus}>New ticket</Button>}
          />
          <div className={styles.stack}>
            <Skeleton height={24} width="60%" />
            <Skeleton height={96} />
            <Skeleton height={16} width="40%" />
          </div>
        </div>
      </Section>

      <Section title="Resource cards">
        <div className={styles.cards}>
          {SAMPLE_RESOURCES.map((r) => <ResourceCard key={r.id} resource={r} onEdit={() => {}} onDelete={() => {}} />)}
        </div>
      </Section>

      <Section title="Validation screen: Kanban column + ticket panel">
        <p className={styles.lead}>
          Image card, card with 4 assignees, card without complexity. Click a card to open the panel with comments.
        </p>
        <div className={styles.column}>
          <header className={styles.columnHeader}>
            <CircleCheck size={16} strokeWidth={1.5} aria-hidden style={{ color: "var(--color-status-todo)" }} />
            <span>To Do</span>
            <span className={styles.count}>{SAMPLE_TICKETS.length}</span>
          </header>
          <div className={styles.columnBody}>
            <TicketCard ticket={SAMPLE_TICKETS[0]} onOpen={setPanel} />
            <TicketCard ticket={SAMPLE_TICKETS[1]} onOpen={setPanel} />
            <TicketCard ticket={SAMPLE_TICKETS[2]} onOpen={setPanel} />
            <TicketCard ticket={SAMPLE_TICKETS[1]} placeholder />
          </div>
        </div>
      </Section>

      <Modal
        open={modal}
        onOpenChange={setModal}
        title="Form modal"
        footer={<><Button onClick={() => setModal(false)}>Cancel</Button><Button variant="primary">Save</Button></>}
      >
        <Field label="Name">{(p) => <Input {...p} />}</Field>
      </Modal>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Delete this ticket?"
        description="“Main menu ambience loop” and its comments will be permanently deleted."
        onConfirm={async () => {}}
      />
      <TicketPanel ticketId={panel} onClose={() => setPanel(null)} />
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}
