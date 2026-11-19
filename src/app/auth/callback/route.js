import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * Google OAuth callback: exchanges the code for a session, then only lets
 * the user in if their email belongs to a Team member.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(`${origin}/login?error=auth`);

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/login?error=auth`);

  const { data: isMember, error: rpcError } = await supabase.rpc("is_member");
  if (rpcError || !isMember) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=not-invited`);
  }

  return NextResponse.redirect(`${origin}/`);
}
