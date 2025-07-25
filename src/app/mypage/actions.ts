import type { Database } from "@/types/database";
import { createClient } from "@/utils/supabase/server";

type TestResult = Database["public"]["Tables"]["test_results"]["Row"];
type TestResultSummary =
  Database["public"]["Tables"]["test_results_summary"]["Row"];
type Pet = Database["public"]["Tables"]["pets"]["Row"];

export interface LatestTestResultData {
  testResult: TestResult;
  summary: TestResultSummary;
  pet: Pet;
}

/**
 * 検査結果の異常判定を行う
 * @param testResult - 検査結果データ
 * @returns 異常項目数と総項目数
 */
function analyzeTestResult(testResult: TestResult): {
  abnormalCount: number;
  totalCount: number;
} {
  const threshold = 3;
  let abnormalCount = 0;
  let totalCount = 0;

  // 各項目をチェック
  const checkValue = (value: number | null): boolean => {
    if (value === null) return false; // null は正常扱い
    totalCount++;
    return value > threshold;
  };

  if (checkValue(testResult.ph_value)) abnormalCount++;
  if (checkValue(testResult.protein_level)) abnormalCount++;
  if (checkValue(testResult.glucose_level)) abnormalCount++;
  if (checkValue(testResult.bilirubin_level)) abnormalCount++;
  if (checkValue(testResult.specific_gravity)) abnormalCount++;

  return { abnormalCount, totalCount };
}

/**
 * overall_statusを判定する
 * @param abnormalCount - 異常項目数
 * @param totalCount - 検査項目総数
 * @returns overall_status
 */
function determineOverallStatus(
  abnormalCount: number,
  totalCount: number,
): "normal" | "caution" | "abnormal" {
  if (totalCount === 0) return "normal"; // 測定項目がない場合は正常

  const abnormalRatio = abnormalCount / totalCount;

  if (abnormalCount === 0) {
    return "normal"; // すべて正常
  }
  if (abnormalRatio >= 0.5) {
    return "abnormal"; // 半数以上が異常
  }
  return "caution"; // 1つでも異常があれば注意
}

/**
 * 検査結果サマリーを生成・保存する
 * @param testResultId - 検査結果ID
 * @returns 生成されたサマリー、またはnull
 */
async function createTestResultSummary(
  testResultId: string,
): Promise<TestResultSummary | null> {
  const supabase = await createClient();

  // 検査結果を取得
  const { data: testResult, error: testError } = await supabase
    .from("test_results")
    .select("*")
    .eq("id", testResultId)
    .single();

  if (testError || !testResult) {
    console.error("Failed to fetch test result:", testError);
    return null;
  }

  // 異常判定を実行
  const { abnormalCount, totalCount } = analyzeTestResult(testResult);
  const overallStatus = determineOverallStatus(abnormalCount, totalCount);

  // ノート生成
  const generateNotes = (
    status: string,
    abnormalCount: number,
    totalCount: number,
  ): string => {
    switch (status) {
      case "abnormal":
        return `${totalCount}項目中${abnormalCount}項目で異常値を検出しました。速やかに獣医師の診察を受けることをお勧めします。`;
      case "caution":
        return `${totalCount}項目中${abnormalCount}項目で注意が必要な値を検出しました。経過観察を続けてください。`;
      case "normal":
        return "全ての検査項目が正常範囲内です。引き続き健康管理を続けてください。";
      default:
        return "検査結果を確認してください。";
    }
  };

  const notes = generateNotes(overallStatus, abnormalCount, totalCount);

  // サマリーをDBに保存
  const { data: summary, error: summaryError } = await supabase
    .from("test_results_summary")
    .insert({
      test_result_id: testResultId,
      overall_status: overallStatus,
      notes,
      determined_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (summaryError) {
    console.error("Failed to create summary:", summaryError);
    return null;
  }

  return summary;
}

/**
 * 最新の検査結果を取得する（サマリーがない場合は自動生成）
 * @returns 最新の検査結果データ、または null
 */
export async function getLatestTestResult(): Promise<LatestTestResultData | null> {
  const supabase = await createClient();

  // 現在のユーザーを取得
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("User not authenticated:", userError);
    return null;
  }

  // 最新の検査結果を取得（ペット情報と結合）
  const { data: testResult, error: testError } = await supabase
    .from("test_results")
    .select(`
      *,
      pets!inner(*)
    `)
    .eq("pets.user_id", user.id)
    .order("tested_at", { ascending: false })
    .limit(1)
    .single();

  if (testError || !testResult) {
    console.error("No test results found:", testError);
    return null;
  }

  // 既存のサマリーを確認
  const { data: existingSummary, error: summaryError } = await supabase
    .from("test_results_summary")
    .select("*")
    .eq("test_result_id", testResult.id)
    .single();

  let summary: TestResultSummary;

  if (summaryError && summaryError.code === "PGRST116") {
    // サマリーが存在しない場合は新規作成
    console.log("Creating new summary for test result:", testResult.id);
    const newSummary = await createTestResultSummary(testResult.id);
    if (!newSummary) {
      console.error("Failed to create summary");
      return null;
    }
    summary = newSummary;
  } else if (summaryError) {
    console.error("Error fetching summary:", summaryError);
    return null;
  } else {
    summary = existingSummary;
  }

  return {
    testResult,
    summary,
    pet: testResult.pets,
  };
}
