"use client";

import { Grid, GridCol, Group, Paper, Text, Title } from "@mantine/core";
import { IconCalendarWeekFilled, IconPencilHeart } from "@tabler/icons-react";

import type { LatestTestResultData } from "@/app/mypage/actions";
type CareRecommendationCardProps = {
  data: LatestTestResultData;
};

/**
 * ケア推奨カードコンポーネント
 */
export function CareRecommendationCard({ data }: CareRecommendationCardProps) {
  const { summary } = data;

  if (!summary) {
    return (
      <Paper p="lg" radius="md" mb="lg" shadow="sm">
        <Text ta="center" c="dark" size="lg">
          まだ検査結果がありません。デバイスで検査を実行してください。
        </Text>
      </Paper>
    );
  }

  // 次回検査推奨日を計算（10日後）
  const nextTestDate = new Date();
  nextTestDate.setDate(nextTestDate.getDate() + 10);
  const formattedNextDate = nextTestDate.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  // ステータスに応じたケア推奨メッセージ
  const getCareMessage = (status: string) => {
    switch (status) {
      case "abnormal":
        return "検査結果に異常が見つかりました。速やかに獣医師の診察を受けることをお勧めします。";
      case "caution":
        return "注意が必要な項目があります。水分補給を心がけ、食事内容を見直してください。";
      default:
        return "現在の状態は良好です。引き続き適切な水分補給と規則正しい生活を心がけましょう。";
    }
  };

  return (
    <Paper p="lg" radius="md" mb="lg" shadow="sm">
      <Group mb="lg" align="center">
        <Grid>
          <GridCol span={2}>
            <IconPencilHeart color="var(--color-primary)" />
          </GridCol>
          <GridCol span={10}>
            <Title order={4} c="dark">
              今後のケア
            </Title>
          </GridCol>
        </Grid>
      </Group>
      <Text size="md" c="dark" mb="md">
        {getCareMessage(summary.overall_status)}
      </Text>
      {summary.notes && (
        <Text size="sm" c="gray" mb="md">
          備考: {summary.notes}
        </Text>
      )}

      <Group mb="lg" align="center">
        <Grid>
          <GridCol span={2}>
            <IconCalendarWeekFilled color="var(--color-primary)" />
          </GridCol>
          <GridCol span={10}>
            <Title order={4} c="dark">
              次回の検査推奨日
            </Title>
          </GridCol>
        </Grid>
      </Group>
      <Text size="md" c="dark" mb="md">
        {formattedNextDate}
      </Text>
    </Paper>
  );
}
