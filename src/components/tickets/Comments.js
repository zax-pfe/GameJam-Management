"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tooltip } from "@/components/ui/Tooltip";
import { formatDateTime, formatRelative, fullName } from "@/lib/format";
import { useData } from "@/store/DataProvider";
import styles from "./Comments.module.scss";

/** Comment thread of a ticket, live-updated, with a composer pinned at the bottom. */
export function Comments({ ticketId }) {
  const { membersById, addComment, me, loadComments, watchComments } = useData();
  const [comments, setComments] = useState(null); // null = loading
  const [loadError, setLoadError] = useState(false);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let active = true;
    const load = () =>
      loadComments(ticketId)
        .then((rows) => {
          if (!active) return;
          setComments(rows);
          setLoadError(false);
        })
        .catch(() => active && setLoadError(true));
    load();

    const unwatch = watchComments(ticketId, load);

    return () => {
      active = false;
      unwatch();
    };
  }, [ticketId, loadComments, watchComments]);

  async function submit(event) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || posting) return;
    setPosting(true);
    const { ok, data } = await addComment(ticketId, body);
    setPosting(false);
    if (!ok) return;
    setDraft("");
    setComments((list) => (list?.some((c) => c.id === data.id) ? list : [...(list ?? []), data]));
  }

  return (
    <section className={styles.comments} aria-labelledby="comments-title">
      <h2 id="comments-title" className={styles.heading}>
        Comments{comments?.length ? <span className={styles.count}>{comments.length}</span> : null}
      </h2>

      {comments === null && !loadError && (
        <div className={styles.list} aria-busy="true">
          <Skeleton height={48} />
          <Skeleton height={48} />
        </div>
      )}

      {loadError && <p className={styles.error}>Couldn&apos;t load comments.</p>}

      {comments?.length === 0 && (
        <p className={styles.empty}>
          <MessageSquare size={16} strokeWidth={1.5} aria-hidden />
          No comments yet.
        </p>
      )}

      {comments?.length > 0 && (
        <ol className={styles.list}>
          {comments.map((comment) => {
            const author = comment.author_id ? membersById.get(comment.author_id) : null;
            return (
              <li key={comment.id} className={styles.comment}>
                <Avatar member={author} size={24} />
                <div className={styles.content}>
                  <p className={styles.byline}>
                    <span className={styles.author}>{fullName(author)}</span>
                    <Tooltip content={formatDateTime(comment.created_at)}>
                      <time dateTime={comment.created_at} className={styles.date} tabIndex={0}>
                        {formatRelative(comment.created_at)}
                      </time>
                    </Tooltip>
                  </p>
                  <p className={styles.body}>{comment.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <form className={styles.composer} onSubmit={submit}>
        <Avatar member={me} size={24} />
        <label htmlFor="comment-draft" className="visually-hidden">
          Write a comment
        </label>
        <textarea
          id="comment-draft"
          className={styles.input}
          placeholder="Write a comment…"
          value={draft}
          maxLength={5000}
          rows={1}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e);
          }}
        />
        <Button variant="primary" type="submit" loading={posting} disabled={!draft.trim()}>
          Comment
        </Button>
      </form>
    </section>
  );
}
