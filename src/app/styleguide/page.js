import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StyleguideView } from "./StyleguideView";

export const metadata = { title: "Styleguide · Game Project Manager" };

/** Dev-only: every token and component in every state (DESIGN.MD). */
export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <Suspense>
      <StyleguideView />
    </Suspense>
  );
}
