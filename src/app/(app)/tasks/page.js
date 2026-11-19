import { Suspense } from "react";
import { TasksView } from "@/components/tasks/TasksView";

export const metadata = { title: "Tasks · Game Project Manager" };

export default function TasksPage() {
  return (
    <Suspense>
      <TasksView />
    </Suspense>
  );
}
