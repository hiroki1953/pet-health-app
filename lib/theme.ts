import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "teal",
  colors: {
    // Primary Green Scale
    teal: [
      "#e6f5ee", // 0: 最も薄いプライマリ
      "#ccece0", // 1: 薄いプライマリ
      "#b3e2d1", // 2: ライトプライマリ
      "#9AD1B2", // 3: プライマリライト
      "#099268", // 4: メインプライマリ ⭐
      "#07785a", // 5: プライマリダーク
      "#066149", // 6: より濃いプライマリ
      "#044d3a", // 7: 濃いプライマリ
      "#03382b", // 8: 最も濃いプライマリ
      "#01241d", // 9: 最暗プライマリ
    ],

    // Gray Scale (Background & Text)
    gray: [
      "#f8f9fa", // 0: 全体背景
      "#e9ecef", // 1: セクション背景
      "#dee2e6", // 2: 薄いボーダー
      "#ced4da", // 3: 標準ボーダー
      "#adb5bd", // 4: 補助テキスト
      "#6c757d", // 5: サブテキスト
      "#495057", // 6: テキスト
      "#343a40", // 7: ダークテキスト
      "#212529", // 8: メインテキスト
      "#000000", // 9: 最も濃いテキスト
    ],

    // Status Colors - Red (Danger/Abnormal)
    red: [
      "#fff0f6",
      "#ffdeeb",
      "#fcc2d7",
      "#faa2c1",
      "#f783ac",
      "#f06595",
      "#e64980",
      "#d6336c",
      "#c2255c",
      "#a61e4d",
    ],

    // Status Colors - Yellow (Warning/Caution)
    yellow: [
      "#fff9db",
      "#fff3bf",
      "#ffec99",
      "#ffe066",
      "#ffd43b",
      "#fcc419",
      "#fab005",
      "#f59f00",
      "#f08c00",
      "#e67700",
    ],

    // Status Colors - Blue (Info/Secondary)
    blue: [
      "#e7f5ff",
      "#d0ebff",
      "#a5d8ff",
      "#74c0fc",
      "#4dabf7",
      "#339af0",
      "#228be6",
      "#1c7ed6",
      "#1971c2",
      "#1864ab",
    ],

    // Success Colors - Green
    green: [
      "#ebfbee",
      "#d3f9d8",
      "#b2f2bb",
      "#8ce99a",
      "#69db7c",
      "#51cf66",
      "#40c057",
      "#37b24d",
      "#2f9e44",
      "#2b8a3e",
    ],
  },

  // コンポーネントデフォルト設定
  components: {
    Paper: {
      defaultProps: {
        bg: "gray.0", // 全体背景色
        shadow: "sm",
      },
    },
    Button: {
      defaultProps: {
        color: "teal.4", // メインプライマリ
      },
    },
    Alert: {
      defaultProps: {
        radius: "md",
      },
    },
    Text: {
      defaultProps: {
        c: "gray.8", // メインテキスト色
      },
    },
    Title: {
      defaultProps: {
        c: "gray.8", // メインテキスト色
      },
    },
  },

  // その他の設定
  defaultRadius: "md",
  fontFamily: "system-ui, -apple-system, sans-serif",
});
