import { Suspense } from "react";
import { LoginCard } from "./LoginCard";
import styles from "./login.module.scss";

export const metadata = { title: "Sign in · Game Project Manager" };

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <Suspense>
        <LoginCard />
      </Suspense>
    </main>
  );
}
