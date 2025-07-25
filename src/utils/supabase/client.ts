import type { Database } from "@/types/database";
import { createBrowserClient } from "@supabase/ssr";

export function createClient(): ReturnType<
  typeof createBrowserClient<Database>
> {
  return createBrowserClient<Database>(
    // biome-ignore lint/style/noNonNullAssertion: supabaseの初期設定のため
    // biome-ignore lint/nursery/noProcessEnv: supabaseの初期設定のため
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: supabaseの初期設定のため
    // biome-ignore lint/nursery/noProcessEnv: supabaseの初期設定のため
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
