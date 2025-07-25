import { updateSession } from "@/utils/supabase/middleware";
import type { NextRequest, NextResponse } from "next/server";

/**
 * PetHealth ToiletアプリのセッションMiddleware
 * リクエストごとにSupabaseセッション状態を更新します
 *
 * @param request 受信したNext.jsリクエスト
 * @returns 処理後のレスポンス
 */
export async function middleware(
  request: NextRequest,
): Promise<NextResponse | undefined> {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
