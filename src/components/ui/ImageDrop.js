"use client";

import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { ACCEPTED_IMAGES } from "@/lib/images";
import { Button } from "./Button";
import styles from "./ImageDrop.module.scss";

/**
 * Drop zone + preview + remove. Used for ticket images (wide),
 * member photos and resource thumbnails (square).
 */
export function ImageDrop({ src, onSelect, onRemove, busy = false, shape = "wide", label = "image", id }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  function pick(files) {
    const file = files?.[0];
    if (file) onSelect(file);
  }

  return (
    <div className={cx(styles.wrap, styles[shape])}>
      {src ? (
        <div className={styles.preview}>
          <img src={src} alt="" />
          {busy && (
            <span className={styles.busy}>
              <LoaderCircle className={styles.spin} size={20} strokeWidth={1.5} aria-hidden />
            </span>
          )}
        </div>
      ) : (
        <button
          id={id}
          type="button"
          className={cx(styles.drop, over && styles.over)}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            pick(e.dataTransfer.files);
          }}
          disabled={busy}
        >
          {busy ? (
            <LoaderCircle className={styles.spin} size={20} strokeWidth={1.5} aria-hidden />
          ) : (
            <ImagePlus size={20} strokeWidth={1.5} aria-hidden />
          )}
          <span>{shape === "wide" ? `Drop an ${label} or click to browse` : "Upload"}</span>
        </button>
      )}

      {src && (
        <div className={styles.actions}>
          <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()} disabled={busy}>
            Replace
          </Button>
          <Button size="sm" variant="ghost" icon={Trash2} onClick={onRemove} disabled={busy}>
            Remove
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGES}
        className="visually-hidden"
        tabIndex={-1}
        aria-label={`Choose ${label}`}
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
