"use client";

import { login, signup } from "@/app/login/action";
import {
  Alert,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconLock, IconMail } from "@tabler/icons-react";
import { useState } from "react";

/**
 * ログイン・サインアップページ
 * Mantine UIを使用したモダンなフォームデザイン
 */
export default function LoginPage() {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * フォーム送信処理
   * @param formData - フォームデータ
   */
  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isSignupMode) {
        await signup(formData);
      } else {
        await login(formData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" py={80}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #dee2e6",
        }}
      >
        <Stack gap="lg">
          {/* ヘッダー */}
          <div style={{ textAlign: "center" }}>
            <Title
              order={2}
              style={{
                color: "#212529",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              {isSignupMode ? "アカウント作成" : "ログイン"}
            </Title>
            <Text
              size="sm"
              style={{
                color: "#6c757d",
              }}
            >
              PetHealth Toiletへ{isSignupMode ? "ようこそ" : "おかえりなさい"}
            </Text>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          {/* フォーム */}
          <form action={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="メールアドレス"
                name="email"
                type="email"
                placeholder="your-email@example.com"
                required
                leftSection={<IconMail size={16} />}
                styles={{
                  label: {
                    color: "#212529",
                    fontWeight: 500,
                    marginBottom: "4px",
                  },
                  input: {
                    borderColor: "#ced4da",
                    "&:focus": {
                      borderColor: "#099268",
                    },
                  },
                }}
              />

              <PasswordInput
                label="パスワード"
                name="password"
                placeholder={
                  isSignupMode
                    ? "8文字以上で入力してください"
                    : "パスワードを入力"
                }
                required
                leftSection={<IconLock size={16} />}
                styles={{
                  label: {
                    color: "#212529",
                    fontWeight: 500,
                    marginBottom: "4px",
                  },
                  input: {
                    borderColor: "#ced4da",
                    "&:focus": {
                      borderColor: "#099268",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                loading={isLoading}
                style={{
                  backgroundColor: "#099268",
                  "&:hover": {
                    backgroundColor: "#066149",
                  },
                }}
              >
                {isSignupMode ? "アカウントを作成" : "ログイン"}
              </Button>
            </Stack>
          </form>

          {/* 切り替えセクション */}
          <Divider
            label={
              <Text size="sm" style={{ color: "#6c757d" }}>
                または
              </Text>
            }
            labelPosition="center"
          />

          <Group justify="center">
            <Text size="sm" style={{ color: "#6c757d" }}>
              {isSignupMode
                ? "すでにアカウントをお持ちですか？"
                : "アカウントをお持ちでない方"}
            </Text>
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setIsSignupMode(!isSignupMode)}
              style={{
                color: "#099268",
                "&:hover": {
                  backgroundColor: "#e6f5ee",
                },
              }}
            >
              {isSignupMode ? "ログインする" : "アカウントを作成"}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
