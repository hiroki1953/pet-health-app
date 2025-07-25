"use client";

import type { LatestTestResultData } from "@/app/mypage/actions";
import {
  Alert,
  Box,
  Button,
  Flex,
  Group,
  List,
  ListItem,
  Paper,
  ProgressLabel,
  ProgressRoot,
  ProgressSection,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconLibrary,
} from "@tabler/icons-react";

type TestResultCardProps = {
  data: LatestTestResultData;
};

/**
 * 検査結果カードコンポーネント
 */
export function TestResultCard({ data }: TestResultCardProps) {
  const { testResult, summary, pet } = data;

  // 検査日時をフォーマット
  const testedDate = new Date(testResult.tested_at);
  const formattedDate = testedDate.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  // ステータスに応じた色とメッセージを決定
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "abnormal":
        return {
          color: "#099268",
          message:
            "放置すると危険な症状や病気があります。\nすぐに病院の受診を考えてください",
          position: 80,
        };
      case "caution":
        return {
          color: "#099268",
          message: "注意が必要な項目があります。\n経過観察をしてください",
          position: 50,
        };
      case "normal":
        return {
          color: "#099268",
          message:
            "検査結果は正常範囲内です。\n引き続き健康管理を続けてください",
          position: 20,
        };
      default:
        return {
          color: "#6c757d",
          message: "検査結果のステータスが不明です。",
          position: 50,
        };
    }
  };

  if (summary === null) {
    return (
      <Paper p="lg" radius="md" mb="lg" shadow="sm">
        <Text ta="center" c="dark" size="lg">
          検査結果がまだありません。デバイスで検査を実行してください。
        </Text>
      </Paper>
    );
  }

  const statusConfig = getStatusConfig(summary.overall_status);

  return (
    <Paper p="lg" radius="md" mb="lg" shadow="sm">
      {/* Date and Title */}
      <Group mb="lg" align="center">
        <Title order={4} c="dark">
          最新の検査結果 - {pet.pet_name}
        </Title>
        <Text size="sm" c="dark">
          {formattedDate}
        </Text>
      </Group>

      {/* Status Alert */}
      {summary.overall_status !== null && (
        <Alert
          icon={
            summary.overall_status === "normal" ? (
              <IconCircleCheck size={20} />
            ) : (
              <IconAlertTriangle size={20} />
            )
          }
          color="blue"
          radius="md"
          mb="lg"
          p="lg"
          style={{
            backgroundColor: statusConfig.color,
            color: "white",
            border: "none",
          }}
        >
          <Text fw={600} ta="center" c="white">
            {statusConfig.message}
          </Text>
        </Alert>
      )}

      {/* Risk Level Indicator */}
      <Box mb="xl">
        <Flex justify="center" mb="md">
          <Box style={{ position: "relative", width: "300px" }}>
            <ProgressRoot size="20">
              <ProgressSection value={34} color="#228be6">
                <ProgressLabel>正常</ProgressLabel>
              </ProgressSection>
              <ProgressSection value={33} color="#fab005">
                <ProgressLabel>注意</ProgressLabel>
              </ProgressSection>
              <ProgressSection value={33} color="#e64980">
                <ProgressLabel>危険</ProgressLabel>
              </ProgressSection>
            </ProgressRoot>
            <Box
              style={{
                position: "absolute",
                left: `${statusConfig.position}%`,
                top: "50%",
                transform: "translateY(-50%)",
                width: "15px",
                height: "15px",
                backgroundColor: "white",
                borderRadius: "50%",
                border: `3px solid ${statusConfig.color}`,
              }}
            />
          </Box>
        </Flex>
      </Box>

      {/* 検査結果の具体的な値を表示 */}
      <Group mb="lg" align="center">
        <List spacing="xs" size="sm" center>
          <TestResultItem
            label="尿のpH"
            value={testResult.ph_value}
            isNormal={
              testResult.ph_value !== null ? testResult.ph_value <= 3 : true
            }
          />
          <TestResultItem
            label="尿の比重"
            value={testResult.specific_gravity}
            isNormal={
              testResult.specific_gravity !== null
                ? testResult.specific_gravity <= 3
                : true
            }
          />
          <TestResultItem
            label="尿の蛋白"
            value={testResult.protein_level}
            isNormal={
              testResult.protein_level !== null
                ? testResult.protein_level <= 3
                : true
            }
          />
          <TestResultItem
            label="尿の糖"
            value={testResult.glucose_level}
            isNormal={
              testResult.glucose_level !== null
                ? testResult.glucose_level <= 3
                : true
            }
          />
          <TestResultItem
            label="ビリルビン"
            value={testResult.bilirubin_level}
            isNormal={
              testResult.bilirubin_level !== null
                ? testResult.bilirubin_level <= 3
                : true
            }
          />
        </List>
      </Group>

      <Button
        leftSection={<IconLibrary size={20} />}
        fullWidth
        radius="md"
        color="var(--color-primary)"
      >
        検査結果の詳細を見る
      </Button>
    </Paper>
  );
}

type TestResultItemProps = {
  label: string;
  value: number | null;
  isNormal?: boolean;
};

/**
 * 個別の検査項目を表示するコンポーネント
 * @param label - 項目名
 * @param value - 測定値
 * @param isNormal - 正常範囲内かどうか
 */
function TestResultItem({
  label,
  value,
  isNormal = true,
}: TestResultItemProps) {
  const getIcon = () => {
    if (isNormal) {
      return (
        <ThemeIcon color="#228be6" size={24} radius="xl">
          <IconCircleCheck size={16} />
        </ThemeIcon>
      );
    }
    return (
      <ThemeIcon color="#e64980" size={24} radius="xl">
        <IconCircleX size={16} />
      </ThemeIcon>
    );
  };

  const displayValue = value !== null ? value.toString() : "測定なし";

  return (
    <ListItem icon={getIcon()}>
      <Text c="dark" fw={500}>
        {label}: {displayValue}
      </Text>
    </ListItem>
  );
}
