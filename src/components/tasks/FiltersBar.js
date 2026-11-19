"use client";

import { DropdownMenu } from "radix-ui";
import { ChevronDown, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { MenuCheckItem } from "@/components/ui/Menu";
import menuStyles from "@/components/ui/Menu.module.scss";
import { Tooltip } from "@/components/ui/Tooltip";
import { DURATION_RANGES, DURATION_RANGE, STATUSES, STATUS, TYPES, TYPE } from "@/lib/constants";
import { cx } from "@/lib/cx";
import { fullName } from "@/lib/format";
import { EMPTY_FILTERS, countActiveFilters } from "@/lib/tickets";
import { useData } from "@/store/DataProvider";
import styles from "./FiltersBar.module.scss";

/** Member / Type / Duration / Status dropdowns + removable chips + Reset. */
export function FiltersBar({ filters, onChange, statusDisabled }) {
  const { members, membersById } = useData();

  const toggle = (group, value, checked) =>
    onChange({
      ...filters,
      [group]: checked ? [...filters[group], value] : filters[group].filter((v) => v !== value),
    });

  const groups = [
    {
      key: "members",
      label: "Member",
      options: members.map((m) => ({ value: m.id, label: fullName(m), member: m })),
      labelOf: (v) => fullName(membersById.get(v)),
    },
    { key: "types", label: "Type", options: TYPES, labelOf: (v) => TYPE[v]?.label },
    { key: "durations", label: "Duration", options: DURATION_RANGES, labelOf: (v) => DURATION_RANGE[v]?.label },
    {
      key: "statuses",
      label: "Status",
      options: STATUSES,
      labelOf: (v) => STATUS[v]?.label,
      disabled: statusDisabled,
      disabledHint: "Columns already are statuses in the Kanban",
    },
  ];

  const activeCount = countActiveFilters(filters, { ignoreStatus: statusDisabled });

  return (
    <div className={styles.bar}>
      <div className={styles.buttons} role="group" aria-label="Filters">
        {groups.map((g) => (
          <FilterMenu
            key={g.key}
            group={g}
            selected={filters[g.key]}
            onToggle={(value, checked) => toggle(g.key, value, checked)}
          />
        ))}
      </div>

      {activeCount > 0 && (
        <div className={styles.chips}>
          {groups
            .filter((g) => !g.disabled)
            .flatMap((g) =>
              filters[g.key].map((value) => (
                <span key={`${g.key}:${value}`} className={styles.chip}>
                  <span className={styles.chipGroup}>{g.label}</span>
                  {g.labelOf(value)}
                  <button
                    type="button"
                    className={styles.chipRemove}
                    aria-label={`Remove filter ${g.label}: ${g.labelOf(value)}`}
                    onClick={() => toggle(g.key, value, false)}
                  >
                    <X size={12} strokeWidth={1.5} aria-hidden />
                  </button>
                </span>
              )),
            )}
          <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}

function FilterMenu({ group, selected, onToggle }) {
  const count = group.disabled ? 0 : selected.length;
  const trigger = (
    <DropdownMenu.Trigger className={cx(styles.trigger, count > 0 && styles.triggerActive)} disabled={group.disabled}>
      {group.label}
      {count > 0 && <span className={styles.count}>{count}</span>}
      <ChevronDown size={14} strokeWidth={1.5} aria-hidden />
    </DropdownMenu.Trigger>
  );

  return (
    <DropdownMenu.Root modal={false}>
      {group.disabled ? (
        <Tooltip content={group.disabledHint}>
          <span tabIndex={0} className={styles.disabledWrap}>
            {trigger}
          </span>
        </Tooltip>
      ) : (
        trigger
      )}
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={menuStyles.menu} align="start" sideOffset={4} collisionPadding={8}>
          {group.options.length === 0 && <p className={styles.empty}>Nothing to filter yet.</p>}
          {group.options.map((option) => {
            const Icon = option.icon;
            return (
              <MenuCheckItem
                key={option.value}
                checked={selected.includes(option.value)}
                onCheckedChange={(checked) => onToggle(option.value, checked)}
              >
                {option.member && <Avatar member={option.member} size={16} />}
                {Icon && <Icon size={16} strokeWidth={1.5} style={{ color: `var(${option.color})` }} aria-hidden />}
                {option.label}
              </MenuCheckItem>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
