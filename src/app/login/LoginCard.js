"use client";

import { CircleAlert, Settings2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import styles from "./login.module.scss";

const ERRORS = {
  "not-invited": "This Google account is not on the team. Ask a teammate to add your email on the Team page.",
  auth: "Sign-in failed. Please try again.",
};

export function LoginCard() {
  const params = useSearchParams();
  const errorKey = params.get("error");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const error = localError ?? ERRORS[errorKey] ?? null;
  const denied = errorKey === "not-invited";

  async function signIn(selectAccount = false) {
    setLoading(true);
    setLocalError(null);
    const { error: oauthError } = await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: selectAccount ? { prompt: "select_account" } : undefined,
      },
    });
    if (oauthError) {
      setLoading(false);
      setLocalError(ERRORS.auth);
    }
  }

  return (
    <section className={styles.card} aria-labelledby="login-title">
      <span className={styles.cornerTop} aria-hidden />
      <span className={styles.cornerBottom} aria-hidden />
      <p className={styles.kicker}>Team workspace</p>
      <h1 id="login-title" className={styles.title}>
        Game Project Manager
      </h1>

      {!isSupabaseConfigured ? (
        <p className={styles.notice}>
          <Settings2 size={16} strokeWidth={1.5} aria-hidden />
          <span>
            Supabase is not configured. Fill <code>.env.local</code> (see README), then restart the dev server.
          </span>
        </p>
      ) : (
        <>
          {error && (
            <p className={styles.error} role="alert">
              <CircleAlert size={16} strokeWidth={1.5} aria-hidden />
              <span>{error}</span>
            </p>
          )}

          {denied ? (
            <Button variant="secondary" size="lg" onClick={() => signIn(true)} loading={loading}>
              Try another account
            </Button>
          ) : (
            <button type="button" className={styles.google} onClick={() => signIn()} disabled={loading}>
              <GoogleLogo />
              <span>{loading ? "Redirecting…" : "Continue with Google"}</span>
            </button>
          )}
        </>
      )}
    </section>
  );
}

/** Official multicolor "G" (Google sign-in branding guidelines). */
function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
