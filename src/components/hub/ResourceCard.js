"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { CategoryChip } from "@/components/ui/Chip";
import { Menu, MenuItem } from "@/components/ui/Menu";
import { RESOURCE_CATEGORY } from "@/lib/constants";
import { cx } from "@/lib/cx";
import { domainOf } from "@/lib/format";
import { imageUrl } from "@/lib/images";
import styles from "./ResourceCard.module.scss";

/** Link card. Opens the URL in a new tab; overflow menu for Edit / Delete. */
export function ResourceCard({ resource, onEdit, onDelete, compact = false }) {
  const category = RESOURCE_CATEGORY[resource.category] ?? RESOURCE_CATEGORY.other;
  const Icon = category.icon;
  const thumb = imageUrl(resource.thumbnail_path);

  return (
    <div className={cx(styles.card, compact && styles.compact)}>
      <a href={resource.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        <span className={styles.thumb} aria-hidden>
          {thumb ? <img src={thumb} alt="" loading="lazy" /> : <Icon size={20} strokeWidth={1.5} />}
        </span>
        <span className={styles.text}>
          <span className={styles.name}>
            {resource.name}
            <ExternalLink className={styles.external} size={14} strokeWidth={1.5} aria-hidden />
            <span className="visually-hidden">(opens in a new tab)</span>
          </span>
          <span className={styles.domain}>{domainOf(resource.url)}</span>
          {!compact && resource.description && <span className={styles.description}>{resource.description}</span>}
          {!compact && <CategoryChip category={resource.category} className={styles.chip} />}
        </span>
      </a>
      {onEdit && (
        <div className={styles.menu}>
          <Menu label={`Actions for ${resource.name}`}>
            <MenuItem icon={Pencil} onSelect={() => onEdit(resource)}>
              Edit
            </MenuItem>
            <MenuItem icon={Trash2} danger onSelect={() => onDelete(resource)}>
              Delete
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
}
