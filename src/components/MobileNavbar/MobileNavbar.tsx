"use client";

import { Box, Flex, Group, Text, rem } from "@mantine/core";
import {
  IconChartHistogram,
  IconDog,
  IconHome,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * モバイル表示用のフッターナビゲーション
 * PetHealth Toiletの主要機能へのアクセスを提供
 *
 * @returns モバイル用ナビゲーションコンポーネント
 */
export function MobileNavbar() {
  const pathname = usePathname();

  const navItems = [
    { icon: IconHome, label: "ホーム", href: "/mypage/dashboard" },
    { icon: IconChartHistogram, label: "履歴", href: "/mypage/test-results" },
    { icon: IconDog, label: "ペット", href: "/mypage/pets" },
    { icon: IconSettings, label: "設定", href: "/mypage/settings" },
  ];

  return (
    <Group justify="space-around" w="100%">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Box
            key={item.href}
            component={Link}
            href={item.href}
            style={{
              textDecoration: "none",
              color: isActive ? "#9AD1B2" : "#4A5568",
              textAlign: "center",
              minWidth: rem(50),
            }}
          >
            <Flex direction="column" align="center">
              <item.icon
                size={24}
                color={isActive ? "#9AD1B2" : "#4A5568"}
                stroke={1.5}
              />
              <Text size="xs" mt={4}>
                {item.label}
              </Text>
            </Flex>
          </Box>
        );
      })}
    </Group>
  );
}
