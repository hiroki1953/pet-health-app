import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(
  request: NextRequest,
): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    // biome-ignore lint/style/noNonNullAssertion: supabaseの初期設定のため
    // biome-ignore lint/nursery/noProcessEnv: supabaseの初期設定のため
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: supabaseの初期設定のため
    // biome-ignore lint/nursery/noProcessEnv: supabaseの初期設定のため
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          }
          supabaseResponse = NextResponse.next({
            request,
          });
        },
      },
    },
  );

  // createServerClient と supabase.auth.getUser() の間でコードを実行しないでください。
  // 単純なミスでも、ユーザーがランダムにログアウトされる問題のデバッグが非常に困難になる可能性があります。

  // 重要: auth.getUser() を削除しないでください。

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // ユーザーが存在しない場合、ログインページにリダイレクトする可能性があります
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 重要: supabaseResponse オブジェクトをそのまま返す必要があります。
  // NextResponse.next() を使用して新しいレスポンスオブジェクトを作成する場合は、以下を確認してください:
  // 1. リクエストを渡すこと:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. クッキーをコピーすること:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. myNewResponse オブジェクトを必要に応じて変更すること。ただし、クッキーは変更しないでください！
  // 4. 最後に:
  //    return myNewResponse
  // これを行わない場合、ブラウザとサーバーが同期を失い、ユーザーのセッションが予期せず終了する可能性があります。

  return supabaseResponse;
}
