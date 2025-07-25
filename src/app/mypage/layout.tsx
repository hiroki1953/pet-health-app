"use client";

import { MobileNavbar } from "@/components/MobileNavbar/MobileNavbar";
import { Navbar } from "@/components/Navbar/Navbar";
import { AppShell, Group, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconDroplet } from "@tabler/icons-react";
import classes from "./Layout.module.css";

/**
 * アプリケーションのルートレイアウト
 * デスクトップではサイドバー、モバイルではボトムナビゲーションを表示
 *
 * @param children - ページコンテンツ
 * @returns レイアウト済みのアプリケーション
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width } = useViewportSize();
  const isMobile = width < 768; // sm ブレイクポイント

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 320, breakpoint: "sm", collapsed: { mobile: true } }}
      footer={isMobile ? { height: 60 } : { height: 0, collapsed: true }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" align="center">
          <IconDroplet size={24} fill="#9AD1B2" color="#9AD1B2" />
          <Text fw={700}>
            PetHealth{" "}
            <Text span c="teal.4" inherit>
              Toilet
            </Text>
          </Text>
        </Group>
      </AppShell.Header>

      {/* デスクトップ表示時のサイドナビゲーション */}
      <AppShell.Navbar p="md" className={classes.navbar}>
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>

      {/* モバイル表示時のフッターナビゲーション */}
      {isMobile && (
        <AppShell.Footer p="xs">
          <MobileNavbar />
        </AppShell.Footer>
      )}
    </AppShell>
  );
}
