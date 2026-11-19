import {
  BookOpen,
  Box,
  Brush,
  Circle,
  CircleCheck,
  CircleDot,
  Code,
  GitBranch,
  HardDrive,
  Image as ImageIcon,
  Link as LinkIcon,
  MousePointerClick,
  Music,
  Package,
  Palette,
  PenTool,
  Tag,
} from "lucide-react";

// Values are the database keys (see supabase/migrations). Labels are UI copy.

export const STATUSES = [
  { value: "todo", label: "To Do", icon: Circle, color: "--color-status-todo" },
  { value: "in_progress", label: "In Progress", icon: CircleDot, color: "--color-status-in-progress" },
  { value: "done", label: "Done", icon: CircleCheck, color: "--color-status-done" },
];

export const TYPES = [
  { value: "design", label: "Design", icon: PenTool, color: "--color-type-design" },
  { value: "development", label: "Development", icon: Code, color: "--color-type-development" },
  { value: "3d", label: "3D", icon: Box, color: "--color-type-3d" },
  { value: "2d_art", label: "2D / Art", icon: Brush, color: "--color-type-2d-art" },
  { value: "ui_ux", label: "UI/UX", icon: MousePointerClick, color: "--color-type-ui-ux" },
  { value: "audio", label: "Audio", icon: Music, color: "--color-type-audio" },
  { value: "other", label: "Other", icon: Tag, color: "--color-type-other" },
];

export const COMPLEXITIES = [
  { value: "simple", label: "Simple", level: 1 },
  { value: "medium", label: "Medium", level: 2 },
  { value: "complex", label: "Complex", level: 3 },
];

export const ROLES = [
  { value: "game_designer", label: "Game Designer" },
  { value: "developer", label: "Developer" },
  { value: "artist_3d", label: "3D Artist" },
  { value: "artist_2d", label: "2D Artist" },
  { value: "ui_ux_designer", label: "UI/UX Designer" },
  { value: "art_director", label: "Art Director" },
  { value: "sound_designer", label: "Sound Designer" },
  { value: "other", label: "Other" },
];

export const RESOURCE_CATEGORIES = [
  { value: "design", label: "Design / Figma", icon: Palette },
  { value: "drive", label: "Google Drive", icon: HardDrive },
  { value: "development", label: "Development / GitHub", icon: GitBranch },
  { value: "documentation", label: "Documentation", icon: BookOpen },
  { value: "references", label: "References", icon: ImageIcon },
  { value: "assets", label: "Assets", icon: Package },
  { value: "other", label: "Other", icon: LinkIcon },
];

/** Estimated-duration filter presets, in hours. */
export const DURATION_RANGES = [
  { value: "lte2", label: "≤ 2h", test: (h) => h != null && h <= 2 },
  { value: "2to8", label: "2h – 8h", test: (h) => h != null && h > 2 && h <= 8 },
  { value: "8to24", label: "8h – 24h", test: (h) => h != null && h > 8 && h <= 24 },
  { value: "gt24", label: "> 24h", test: (h) => h != null && h > 24 },
  { value: "none", label: "Not estimated", test: (h) => h == null },
];

const byValue = (list) => Object.fromEntries(list.map((item) => [item.value, item]));

export const STATUS = byValue(STATUSES);
export const TYPE = byValue(TYPES);
export const COMPLEXITY = byValue(COMPLEXITIES);
export const ROLE = byValue(ROLES);
export const RESOURCE_CATEGORY = byValue(RESOURCE_CATEGORIES);
export const DURATION_RANGE = byValue(DURATION_RANGES);
