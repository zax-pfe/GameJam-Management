"use client";

import { useRouter } from "next/navigation";
import { createContext, use, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { IMAGE_SIZES, prepareImage, userError } from "@/lib/images";
import { getSupabase } from "@/lib/supabase/client";
import { IMAGE_BUCKET } from "@/lib/supabase/config";
import { toDay } from "@/lib/format";
import { topPosition } from "@/lib/tickets";

/*
 * Single source of truth for the whole app.
 * - Every view reads members / tickets / resources from here.
 * - Mutations update local state first (optimistic) so every view changes instantly,
 *   then write to Supabase.
 * - Supabase Realtime tells us when anything changes (other tabs, teammates):
 *   we refetch the affected collection (tables are small: one team, one game).
 */

export const DataContext = createContext(null);

const SAVE_ERROR = "Couldn't save your changes. Please try again.";

function must({ data, error }) {
  if (error) throw error;
  return data;
}

function normalizeTicket({ ticket_assignees, ...row }) {
  return {
    ...row,
    estimate_hours: row.estimate_hours == null ? null : Number(row.estimate_hours),
    assignee_ids: (ticket_assignees ?? []).map((a) => a.member_id),
  };
}

const FETCHERS = {
  members: async (sb) => must(await sb.from("members").select("*").order("first_name").order("last_name")),
  tickets: async (sb) =>
    must(await sb.from("tickets").select("*, ticket_assignees(member_id)").order("position")).map(normalizeTicket),
  resources: async (sb) => must(await sb.from("resources").select("*").order("name")),
};

// Comments are loaded per open ticket (not kept in the global store).
/** Loads a ticket's comments (oldest first). Throws on failure. */
async function loadComments(ticketId) {
  return must(await getSupabase().from("comments").select("*").eq("ticket_id", ticketId).order("created_at"));
}

/** Calls `onChange` whenever a comment of this ticket changes. Returns an unsubscribe function. */
function watchComments(ticketId, onChange) {
  const channel = getSupabase()
    .channel(`comments:${ticketId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `ticket_id=eq.${ticketId}` }, onChange)
    .subscribe();
  return () => getSupabase().removeChannel(channel);
}

export function DataProvider({ children }) {
  const router = useRouter();
  const toast = useToast();

  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [members, setMembers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);
  const [myEmail, setMyEmail] = useState(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  // Refetches are deferred while our own writes are in flight, so a realtime
  // echo never overwrites an optimistic change with stale data.
  const pendingWrites = useRef(0);
  const staleKinds = useRef(new Set());
  const refreshRef = useRef(null);

  const setters = { members: setMembers, tickets: setTickets, resources: setResources };
  const me = members.find((m) => m.email === myEmail) ?? null;

  async function refresh(kind) {
    if (pendingWrites.current > 0) {
      staleKinds.current.add(kind);
      return;
    }
    try {
      const data = await FETCHERS[kind](getSupabase());
      // A write started meanwhile: this snapshot may be older than the optimistic state.
      if (pendingWrites.current > 0) {
        staleKinds.current.add(kind);
        return;
      }
      setters[kind](data);
    } catch (error) {
      console.error(`[data] refresh ${kind} failed`, error);
    }
  }
  useEffect(() => {
    refreshRef.current = refresh;
  });

  // Initial load + membership check.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const {
          data: { user },
        } = await getSupabase().auth.getUser();
        if (!user) {
          router.replace("/login");
          return;
        }
        const [m, t, r] = await Promise.all([
          FETCHERS.members(getSupabase()),
          FETCHERS.tickets(getSupabase()),
          FETCHERS.resources(getSupabase()),
        ]);
        if (cancelled) return;
        const email = user.email?.toLowerCase();
        if (!m.some((member) => member.email === email)) {
          await getSupabase().auth.signOut();
          router.replace("/login?error=not-invited");
          return;
        }
        setMembers(m);
        setTickets(t);
        setResources(r);
        setMyEmail(email);
        setStatus("ready");
      } catch (error) {
        console.error("[data] initial load failed", error);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, loadAttempt]);

  // Realtime sync (other tabs / teammates) + resync when the tab comes back.
  useEffect(() => {
    if (status !== "ready") return;
    const timers = {};
    const schedule = (kind) => {
      clearTimeout(timers[kind]);
      timers[kind] = setTimeout(() => refreshRef.current?.(kind), 150);
    };
    const all = () => ["members", "tickets", "resources"].forEach(schedule);
    const on = (table, kind) => (channel) =>
      channel.on("postgres_changes", { event: "*", schema: "public", table }, () => schedule(kind));

    let channel = getSupabase().channel("app-data");
    channel = on("members", "members")(channel);
    channel = on("tickets", "tickets")(channel);
    channel = on("ticket_assignees", "tickets")(channel);
    channel = on("resources", "resources")(channel);
    let firstSubscribe = true;
    channel.subscribe((state) => {
      // After a reconnection we may have missed events: resync everything.
      if (state === "SUBSCRIBED" && !firstSubscribe) all();
      if (state === "SUBSCRIBED") firstSubscribe = false;
    });

    const onVisible = () => document.visibilityState === "visible" && all();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      Object.values(timers).forEach(clearTimeout);
      document.removeEventListener("visibilitychange", onVisible);
      getSupabase().removeChannel(channel);
    };
  }, [status]);

  /**
   * Runs a write. Applies `optimistic` first, toasts on failure and resyncs.
   * Never throws: resolves to { ok, data }.
   */
  async function mutate(kinds, optimistic, write, errorMessage = SAVE_ERROR) {
    pendingWrites.current += 1;
    optimistic?.();
    try {
      const data = await write();
      return { ok: true, data };
    } catch (error) {
      console.error("[data] write failed", error);
      toast(error?.userFacing ? error.message : errorMessage, { tone: "error" });
      return { ok: false, error };
    } finally {
      // Always resync what we touched (confirms the optimistic state or rolls it back).
      kinds.forEach((k) => staleKinds.current.add(k));
      pendingWrites.current -= 1;
      if (pendingWrites.current === 0) {
        const toRefresh = [...staleKinds.current];
        staleKinds.current.clear();
        toRefresh.forEach((k) => refresh(k));
      }
    }
  }

  async function uploadImage(folder, file, maxSize) {
    const { blob, ext, contentType } = await prepareImage(file, maxSize);
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    must(await getSupabase().storage.from(IMAGE_BUCKET).upload(path, blob, { contentType, cacheControl: "31536000" }));
    return path;
  }

  function deleteImage(path) {
    if (!path) return;
    getSupabase().storage
      .from(IMAGE_BUCKET)
      .remove([path])
      .catch((error) => console.warn("[data] image cleanup failed", error));
  }

  /** `image`: File to upload, null to remove, undefined to keep. Returns the column patch. */
  async function imagePatch(column, folder, maxSize, image) {
    if (image === undefined) return {};
    return { [column]: image ? await uploadImage(folder, image, maxSize) : null };
  }

  function duplicateEmail(error) {
    return error?.code === "23505" ? userError("This email is already on the team.") : error;
  }

  // ------------------------------------------------------------------ members
  const memberActions = {
    async createMember(fields, avatar) {
      return mutate(["members"], null, async () => {
        const patch = await imagePatch("avatar_path", "avatars", IMAGE_SIZES.avatar, avatar ?? undefined);
        const res = await getSupabase()
          .from("members")
          .insert({ ...fields, ...patch })
          .select()
          .single();
        if (res.error) throw duplicateEmail(res.error);
        if (!res.data) throw new Error("Member write returned no row");
        setMembers((list) => [...list, res.data]);
        return res.data;
      });
    },

    async updateMember(id, fields, avatar) {
      const previous = members.find((m) => m.id === id);
      return mutate(["members"], null, async () => {
        const patch = await imagePatch("avatar_path", "avatars", IMAGE_SIZES.avatar, avatar);
        const res = await getSupabase()
          .from("members")
          .update({ ...fields, ...patch })
          .eq("id", id)
          .select()
          .single();
        if (res.error) throw duplicateEmail(res.error);
        if (!res.data) throw new Error("Member write returned no row");
        if ("avatar_path" in patch) deleteImage(previous?.avatar_path);
        setMembers((list) => list.map((m) => (m.id === id ? res.data : m)));
        return res.data;
      });
    },

    async deleteMember(id) {
      const previous = members.find((m) => m.id === id);
      return mutate(
        ["members", "tickets"],
        () => {
          setMembers((list) => list.filter((m) => m.id !== id));
          setTickets((list) =>
            list.map((t) => ({ ...t, assignee_ids: t.assignee_ids.filter((memberId) => memberId !== id) })),
          );
        },
        async () => {
          must(await getSupabase().from("members").delete().eq("id", id));
          deleteImage(previous?.avatar_path);
        },
      );
    },
  };

  // ------------------------------------------------------------------ tickets
  const ticketActions = {
    /** Creates a ticket at the top of its status column. Resolves to { ok, data: ticket }. */
    async createTicket({ assignee_ids = [], ...fields }) {
      const status = fields.status ?? "todo";
      const now = new Date().toISOString();
      const ticket = {
        id: crypto.randomUUID(),
        type: "other",
        estimate_hours: null,
        complexity: null,
        due_date: toDay(new Date()), // today by default
        description: null,
        image_path: null,
        created_by: me?.id ?? null,
        updated_by: me?.id ?? null,
        created_at: now,
        updated_at: now,
        ...fields,
        title: fields.title.trim(),
        status,
        position: topPosition(tickets, status),
        assignee_ids,
      };
      const row = {
        id: ticket.id,
        title: ticket.title,
        type: ticket.type,
        status,
        position: ticket.position,
        estimate_hours: ticket.estimate_hours,
        complexity: ticket.complexity,
        due_date: ticket.due_date,
        ...(ticket.description ? { description: ticket.description } : {}),
      };
      return mutate(
        ["tickets"],
        () => setTickets((list) => [...list, ticket]),
        async () => {
          must(await getSupabase().from("tickets").insert(row));
          if (assignee_ids.length) {
            must(
              await getSupabase()
                .from("ticket_assignees")
                .insert(assignee_ids.map((member_id) => ({ ticket_id: ticket.id, member_id }))),
            );
          }
          return ticket;
        },
      );
    },

    /** Partial update. `patch.assignee_ids` replaces the assignee list. */
    async updateTicket(id, patch) {
      const previous = tickets.find((t) => t.id === id);
      if (!previous) return { ok: false };
      const { assignee_ids, ...columns } = patch;
      return mutate(
        ["tickets"],
        () => setTickets((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t))),
        async () => {
          if (Object.keys(columns).length) {
            must(await getSupabase().from("tickets").update(columns).eq("id", id));
          }
          if (assignee_ids) {
            const removed = previous.assignee_ids.filter((m) => !assignee_ids.includes(m));
            const added = assignee_ids.filter((m) => !previous.assignee_ids.includes(m));
            if (removed.length) {
              must(await getSupabase().from("ticket_assignees").delete().eq("ticket_id", id).in("member_id", removed));
            }
            if (added.length) {
              must(
                await getSupabase()
                  .from("ticket_assignees")
                  .insert(added.map((member_id) => ({ ticket_id: id, member_id }))),
              );
            }
          }
        },
      );
    },

    async deleteTicket(id) {
      const previous = tickets.find((t) => t.id === id);
      return mutate(
        ["tickets"],
        () => setTickets((list) => list.filter((t) => t.id !== id)),
        async () => {
          must(await getSupabase().from("tickets").delete().eq("id", id));
          deleteImage(previous?.image_path);
        },
      );
    },

    /** `file`: File to upload, or null to remove the image. */
    async setTicketImage(id, file) {
      const previous = tickets.find((t) => t.id === id);
      return mutate(["tickets"], null, async () => {
        const path = file ? await uploadImage("tickets", file, IMAGE_SIZES.ticket) : null;
        must(await getSupabase().from("tickets").update({ image_path: path }).eq("id", id));
        setTickets((list) => list.map((t) => (t.id === id ? { ...t, image_path: path } : t)));
        deleteImage(previous?.image_path);
      });
    },

    async addComment(ticketId, body) {
      return mutate(
        [],
        null,
        async () =>
          must(await getSupabase().from("comments").insert({ ticket_id: ticketId, body: body.trim() }).select().single()),
        "Couldn't post your comment. Please try again.",
      );
    },
  };

  // ---------------------------------------------------------------- resources
  const resourceActions = {
    async createResource(fields, thumbnail) {
      return mutate(["resources"], null, async () => {
        const patch = await imagePatch("thumbnail_path", "resources", IMAGE_SIZES.thumbnail, thumbnail ?? undefined);
        const row = must(
          await getSupabase()
            .from("resources")
            .insert({ ...fields, ...patch })
            .select()
            .single(),
        );
        setResources((list) => [...list, row]);
        return row;
      });
    },

    async updateResource(id, fields, thumbnail) {
      const previous = resources.find((r) => r.id === id);
      return mutate(["resources"], null, async () => {
        const patch = await imagePatch("thumbnail_path", "resources", IMAGE_SIZES.thumbnail, thumbnail);
        const row = must(
          await getSupabase()
            .from("resources")
            .update({ ...fields, ...patch })
            .eq("id", id)
            .select()
            .single(),
        );
        if ("thumbnail_path" in patch) deleteImage(previous?.thumbnail_path);
        setResources((list) => list.map((r) => (r.id === id ? row : r)));
        return row;
      });
    },

    async deleteResource(id) {
      const previous = resources.find((r) => r.id === id);
      return mutate(
        ["resources"],
        () => setResources((list) => list.filter((r) => r.id !== id)),
        async () => {
          must(await getSupabase().from("resources").delete().eq("id", id));
          deleteImage(previous?.thumbnail_path);
        },
      );
    },
  };

  async function signOut() {
    await getSupabase().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const membersById = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);

  const value = {
    status,
    retry: () => {
      setStatus("loading");
      setLoadAttempt((n) => n + 1);
    },
    me,
    members,
    membersById,
    tickets,
    resources,
    signOut,
    loadComments,
    watchComments,
    ...memberActions,
    ...ticketActions,
    ...resourceActions,
  };

  return <DataContext value={value}>{children}</DataContext>;
}

export function useData() {
  const ctx = use(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
