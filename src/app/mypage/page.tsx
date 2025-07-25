import { CareRecommendationCard } from "@/components/features/CareRecommendationCard";
import { TestResultCard } from "@/components/features/TestResultCard";
import { createClient } from "@/utils/supabase/server";
import { Container, Paper, Stack, Text } from "@mantine/core";
import { redirect } from "next/navigation";
import { getLatestTestResult } from "./actions";

/**
 * マイページ - 最新の検査結果と推奨ケアを表示
 */
export default async function MyPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  // 最新の検査結果を取得
  const latestResult = await getLatestTestResult();

  if (!latestResult) {
    return (
      <Stack align="stretch" justify="center" gap="md">
        <Container p="md">
          <Paper p="lg" radius="md" shadow="sm">
            <Text ta="center" c="dark" size="lg">
              まだ検査結果がありません。
              <br />
              デバイスで検査を実行してください。
            </Text>
          </Paper>
        </Container>
      </Stack>
    );
  }

  return (
    <Stack align="stretch" justify="center" gap="md">
      <Container p="md">
        <TestResultCard data={latestResult} />
        <CareRecommendationCard data={latestResult} />
      </Container>
    </Stack>
  );
}
