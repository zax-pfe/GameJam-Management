import { LayoutDashboard, Library, SquareKanban, Users } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: SquareKanban },
  { href: "/team", label: "Team", icon: Users },
  { href: "/hub", label: "Project Hub", icon: Library },
];

export function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
