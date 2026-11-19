import { AppShell } from "@/components/layout/AppShell";

// Every page here is behind the login and renders once the shared data is
// loaded in the browser (see DataGate), so none of them can be validated as
// instantly prerendered by Next.js.
export const instant = false;

export default function AppLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
