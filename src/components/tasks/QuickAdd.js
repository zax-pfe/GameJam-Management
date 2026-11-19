"use client";

import { useState } from "react";
import { STATUS } from "@/lib/constants";
import { useData } from "@/store/DataProvider";
import styles from "./QuickAdd.module.scss";

/**
 * Inline input at the top of a column. Enter creates (title only) and stays
 * open for the next one, Esc or blurring an empty input closes it.
 */
export function QuickAdd({ status, onClose }) {
  const { createTicket } = useData();
  const [title, setTitle] = useState("");

  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const value = title.trim();
      if (!value) return;
      createTicket({ title: value, status });
      setTitle("");
    }
  }

  return (
    <div className={styles.quickAdd}>
      <label htmlFor={`quick-add-${status}`} className="visually-hidden">
        New ticket in {STATUS[status].label}
      </label>
      <input
        id={`quick-add-${status}`}
        className={styles.input}
        placeholder="Task name, then Enter"
        value={title}
        maxLength={200}
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => !title.trim() && onClose()}
      />
      <p className={styles.hint}>Enter to add · Esc to cancel</p>
    </div>
  );
}
