import type { Database } from "@/types/database";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient(): Promise<
  ReturnType<typeof createServerClient>
> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    // biome-ignore lint/style/noNonNullAssertion: supabaseの初期設定のため
    // biome-ignore lint/nursery/noProcessEnv: supabaseの初期設定のため
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: supabaseの初期設定のため
    // biome-ignore lint/nursery/noProcessEnv: supabaseの初期設定のため
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
