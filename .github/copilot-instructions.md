# PetHealth Toilet ─ Copilot Instructions

These guidelines are automatically injected into GitHub Copilot Chat & completions. Keep them **up‑to‑date** whenever the domain model or coding standards change.

---

## 📌 Project Summary

*IoT トイレ × スマホアプリ* で犬・猫の尿を自動検査し、健康異常を早期発見します。主要機能は検査結果の可視化、異常アラート、ペット／端末管理、データ共有。

---

## 🗄️ Domain Entities（PostgreSQL @ Supabase）

### Core Tables

| Table                        | 目的            | 主要カラム                                                                                                                                                                                |
| ---------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **auth.users**               | 認証（Supabase） | Supabase Auth管理 - パスワード等は auth.users で自動管理                                                                                                                                              |
| **devices**                  | IoT端末情報       | `id UUID PK`, `user_id FK → auth.users`, `device_name`, `device_serial UNIQUE`, `device_type DEFAULT 'toilet_analyzer'`, `last_data_received_at`                                    |
| **pets**                     | ペット基本情報       | `id UUID PK`, `user_id FK → auth.users`, `pet_name`, `species`, `breed`, `gender`, `birth_date DATE`, `weight NUMERIC`, `photo_url TEXT`                                            |
| **test_results**             | 検査生データ        | `id UUID PK`, `device_id FK`, `pet_id FK`, `tested_at`, `ph_value NUMERIC`, `protein_level INTEGER`, `glucose_level INTEGER`, `bilirubin_level INTEGER`, `specific_gravity NUMERIC` |
| **test_results_summary**     | 検査判定結果        | `id UUID PK`, `test_result_id UNIQUE FK`, `overall_status VARCHAR`, `determined_at`, `notes TEXT`                                                                                    |
| **user_settings**            | ユーザー個人設定      | `id UUID PK`, `user_id UNIQUE FK → auth.users`, `push_notifications_enabled BOOLEAN`, `email_notifications_enabled BOOLEAN`, `timezone`, `language`                               |

### Schema Details

#### Devices（端末情報）
```sql
CREATE TABLE public.devices (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    device_name character varying NOT NULL,
    device_serial character varying NOT NULL UNIQUE,
    device_type character varying DEFAULT 'toilet_analyzer'::character varying,
    last_data_received_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT devices_pkey PRIMARY KEY (id),
    CONSTRAINT devices_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
```

#### Pets（ペット情報）
```sql
CREATE TABLE public.pets (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    pet_name character varying NOT NULL,
    species character varying NOT NULL,
    breed character varying,
    gender character varying,
    birth_date date,
    weight numeric,
    photo_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT pets_pkey PRIMARY KEY (id),
    CONSTRAINT pets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
```

#### Test Results（検査結果）
```sql
CREATE TABLE public.test_results (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    device_id uuid,
    pet_id uuid,
    tested_at timestamp with time zone NOT NULL,
    ph_value numeric,
    protein_level integer,
    glucose_level integer,
    bilirubin_level integer,
    specific_gravity numeric,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT test_results_pkey PRIMARY KEY (id),
    CONSTRAINT test_results_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id),
    CONSTRAINT test_results_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id)
);
```

#### Test Results Summary（検査サマリー）
```sql
CREATE TABLE public.test_results_summary (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    test_result_id uuid UNIQUE,
    overall_status character varying NOT NULL,
    determined_at timestamp with time zone DEFAULT now(),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT test_results_summary_pkey PRIMARY KEY (id),
    CONSTRAINT test_results_summary_test_result_id_fkey FOREIGN KEY (test_result_id) REFERENCES public.test_results(id)
);
```

#### User Settings（ユーザー設定）
```sql
CREATE TABLE public.user_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE,
    push_notifications_enabled boolean DEFAULT true,
    email_notifications_enabled boolean DEFAULT true,
    notification_time_start time without time zone DEFAULT '08:00:00'::time without time zone,
    notification_time_end time without time zone DEFAULT '22:00:00'::time without time zone,
    timezone character varying DEFAULT 'Asia/Tokyo'::character varying,
    language character varying DEFAULT 'ja'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_settings_pkey PRIMARY KEY (id),
    CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
```

> *共通規約*: すべて `snake_case`、`created_at`/`updated_at` `TIMESTAMP WITH TIME ZONE DEFAULT NOW()`、外部キーは `ON DELETE CASCADE`。

### 🔒 RLS セキュリティポリシー

すべてのテーブルで Row Level Security (RLS) を有効化し、`auth.uid()` でユーザースコープを制限：

```sql
-- Devices: ユーザーは自分のデバイスのみ管理可能
CREATE POLICY "Users can manage own devices" ON devices
    FOR ALL USING (user_id = auth.uid());

-- Pets: ユーザーは自分のペットのみ管理可能
CREATE POLICY "Users can manage own pets" ON pets
    FOR ALL USING (user_id = auth.uid());

-- Test Results: ユーザーは自分のペットの検査結果のみアクセス可能
CREATE POLICY "Users can view own pet test results" ON test_results
    FOR SELECT USING (
        pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid())
    );

-- Test Results Summary: ユーザーは自分のペットの検査サマリーのみアクセス可能
CREATE POLICY "Users can view own pet test results summary" ON test_results_summary
    FOR SELECT USING (
        test_result_id IN (
            SELECT id FROM test_results WHERE pet_id IN (
                SELECT id FROM pets WHERE user_id = auth.uid()
            )
        )
    );
```

> ⚠️ **重要**: RLS を無効化する SQL は生成しないこと。すべてのクエリは適切なユーザースコープ内で動作する必要があります。

---

## 🏗️ Tech Stack & Architecture

| レイヤ              | 技術スタック                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------- |
| **Frontend**     | Next.js 14 (App Router, TypeScript, RSC) / Mantine UI / Tabler Icons / Zustand              |
| **Backend**      | Supabase (PostgreSQL + Auth + Storage + Edge Functions) / Supabase JS v2 / Row Level Security |
| **Testing**      | Vitest (+ Testing Library React) / Playwright E2E                                            |
| **Development**  | GitHub Actions / ESLint / TypeScript                                                  |

### ディレクトリ構成

```
src/
├─ app/                    # Next.js App Router
│  ├─ (auth)/             # 認証関連ページ
│  ├─ mypage/             # マイページ (検査結果表示)
│  └─ layout.tsx          # ルートレイアウト
├─ components/
│  ├─ ui/                 # 汎用UIコンポーネント
│  └─ features/           # 機能別コンポーネント
├─ utils/supabase/        # Supabase クライアント & ヘルパー
├─ hooks/                 # カスタム React Hooks
├─ types/                 # TypeScript 型定義
└─ tests/                 # テスト
```

---

## ✍️ Code Generation Rules

### 1. 型安全性の確保
```typescript
// Database型の生成例
export type Database = {
  public: {
    Tables: {
      pets: {
        Row: {
          id: string;
          user_id: string | null;
          pet_name: string;
          species: string;
          breed: string | null;
          // ...
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          pet_name: string;
          // ...
        };
        Update: {
          // ...
        };
      };
      // 他のテーブル定義...
    };
  };
};

// 使用例
export type Pet = Database['public']['Tables']['pets']['Row'];
```

### 2. Server Actions パターン
```typescript
/**
 * 最新の検査結果を取得
 * @returns 最新の検査結果とサマリー、またはnull
 */
export async function getLatestTestResult(): Promise<LatestTestResultData | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) return null;

  // RLSにより自動的にuser_idでフィルタされる
  const { data: result } = await supabase
    .from('test_results')
    .select(`
      *,
      pets!inner(*),
      test_results_summary(*)
    `)
    .order('tested_at', { ascending: false })
    .limit(1)
    .single();

  return result;
}
```

### 3. コンポーネント設計
```typescript
'use client';

/**
 * 検査結果カードコンポーネント
 * @param data - 検査結果データ
 */
export function TestResultCard({ data }: { data: LatestTestResultData }) {
  // 閾値判定ロジック (3以下が正常)
  const isNormal = (value: number | null) => value === null || value <= 3;

  return (
    <Paper p="lg" radius="md" shadow="sm">
      {/* コンポーネント実装 */}
    </Paper>
  );
}
```

### 4. 必須ルール
- **JSDoc**: すべての関数に引数・戻り値・副作用を記載
- **async/await**: Promise処理は必ずasync/awaitを使用
- **エラーハンドリング**: Supabaseクエリは必ずerrorをチェック
- **型定義**: `any`型の使用を避け、適切な型を定義

---

## 🧪 Testing Guidelines

### Unit Testing
```typescript
// actions.test.ts
import { vi, describe, it, expect } from 'vitest';
import { getLatestTestResult } from './actions';

// Supabaseクライアントをモック
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: vi.fn() },
    from: vi.fn(() => ({ select: vi.fn(), order: vi.fn() }))
  }))
}));

describe('getLatestTestResult', () => {
  it('should return latest test result for authenticated user', async () => {
    // テスト実装
  });
});
```

### E2E Testing
```typescript
// mypage.spec.ts
import { test, expect } from '@playwright/test';

test('displays latest test results for logged in user', async ({ page }) => {
  await page.goto('/mypage');
  await expect(page.locator('[data-testid="test-result-card"]')).toBeVisible();
});
```

---

## 🎨 Design System

### Color Tokens
```typescript
const designTokens = {
  // Primary & Secondary Colors
  primary: '#099268',      // グリーン（プライマリ）
  primaryLight: '#9AD1B2', // プライマリライト
  primaryDark: '#066149',  // プライマリダーク
  secondary: '#228be6',    // セカンダリブルー

  // Status Colors
  warning: '#fab005',      // イエロー（注意）
  danger: '#e64980',       // レッド（危険）
  success: '#40c057',      // グリーン（成功）
  info: '#339af0',         // インフォブルー

  // Background Colors
  background: '#f8f9fa',   // 全体背景色（ライトグレー）
  cardBackground: '#ffffff', // カード背景色（ホワイト）
  sectionBackground: '#e9f0e9', // セクション背景色（薄いグリーン）
  overlay: 'rgba(0, 0, 0, 0.5)', // オーバーレイ

  // Text Colors
  textPrimary: '#212529',    // メインテキスト（ダークグレー）
  textSecondary: '#6c757d',  // サブテキスト（グレー）
  textMuted: '#adb5bd',      // 補助テキスト（ライトグレー）
  textInverse: '#ffffff',    // 反転テキスト（ホワイト）
  textLink: '#099268',       // リンクテキスト（プライマリ）
  textLinkHover: '#066149',  // リンクホバー（プライマリダーク）

  // Border Colors
  borderLight: '#dee2e6',    // 薄いボーダー
  borderDefault: '#ced4da',  // 標準ボーダー
  borderDark: '#adb5bd',     // 濃いボーダー
  borderPrimary: '#099268',  // プライマリボーダー

  // Component Specific Colors
  inputBackground: '#ffffff',     // 入力フィールド背景
  inputBorder: '#ced4da',        // 入力フィールドボーダー
  inputFocus: '#099268',         // 入力フィールドフォーカス
  buttonPrimary: '#099268',      // プライマリボタン
  buttonSecondary: '#6c757d',    // セカンダリボタン
  buttonDisabled: '#e9ecef',     // 無効ボタン

  // Health Status Colors (Pet Health Specific)
  healthNormal: '#40c057',       // 健康状態：正常
  healthCaution: '#fab005',      // 健康状態：注意
  healthAbnormal: '#e64980',     // 健康状態：異常
  healthUnknown: '#adb5bd',      // 健康状態：不明

  // Gradient Colors
  gradientPrimary: 'linear-gradient(135deg, #9AD1B2 0%, #099268 100%)',
  gradientWarning: 'linear-gradient(135deg, #ffd43b 0%, #fab005 100%)',
  gradientDanger: 'linear-gradient(135deg, #ff8cc8 0%, #e64980 100%)',

  // Shadow Colors
  shadowLight: 'rgba(0, 0, 0, 0.1)',   // 薄い影
  shadowDefault: 'rgba(0, 0, 0, 0.15)', // 標準影
  shadowDark: 'rgba(0, 0, 0, 0.25)',    // 濃い影
};

// Mantine Theme Integration
const mantineColorExtensions = {
  // Gray Scale (Background & Text)
  gray: [
    '#f8f9fa', // 0: 全体背景
    '#e9ecef', // 1: セクション背景
    '#dee2e6', // 2: 薄いボーダー
    '#ced4da', // 3: 標準ボーダー
    '#adb5bd', // 4: 補助テキスト
    '#6c757d', // 5: サブテキスト
    '#495057', // 6: テキスト
    '#343a40', // 7: ダークテキスト
    '#212529', // 8: メインテキスト
    '#000000', // 9: 最も濃いテキスト
  ],

  // Primary Green Scale
  teal: [
    '#e6f5ee', // 0: 最も薄いプライマリ
    '#ccece0', // 1: 薄いプライマリ
    '#b3e2d1', // 2: ライトプライマリ
    '#9AD1B2', // 3: プライマリライト
    '#099268', // 4: メインプライマリ ⭐
    '#07785a', // 5: プライマリダーク
    '#066149', // 6: より濃いプライマリ
    '#044d3a', // 7: 濃いプライマリ
    '#03382b', // 8: 最も濃いプライマリ
    '#01241d', // 9: 最暗プライマリ
  ],

  // Status Colors
  red: [
    '#fff0f6', '#ffdeeb', '#fcc2d7', '#faa2c1',
    '#f783ac', '#f06595', '#e64980', '#d6336c',
    '#c2255c', '#a61e4d'
  ],

  yellow: [
    '#fff9db', '#fff3bf', '#ffec99', '#ffe066',
    '#ffd43b', '#fcc419', '#fab005', '#f59f00',
    '#f08c00', '#e67700'
  ],

  blue: [
    '#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc',
    '#4dabf7', '#339af0', '#228be6', '#1c7ed6',
    '#1971c2', '#1864ab'
  ]
};

// Usage Example
const statusColors = {
  normal: mantineColorExtensions.teal[4],      // #099268
  caution: mantineColorExtensions.yellow[6],   // #fab005
  abnormal: mantineColorExtensions.red[6],     // #e64980
  info: mantineColorExtensions.blue[6],        // #228be6
};
```

### 使用例（コンポーネント内）
```typescript
// Status Alert Component
const getStatusStyle = (status: 'normal' | 'caution' | 'abnormal') => ({
  normal: {
    backgroundColor: designTokens.healthNormal,
    color: designTokens.textInverse,
    borderColor: designTokens.healthNormal,
  },
  caution: {
    backgroundColor: designTokens.healthCaution,
    color: designTokens.textInverse,
    borderColor: designTokens.healthCaution,
  },
  abnormal: {
    backgroundColor: designTokens.healthAbnormal,
    color: designTokens.textInverse,
    borderColor: designTokens.healthAbnormal,
  }
});

// Typography Component
const textStyles = {
  heading: {
    color: designTokens.textPrimary,
    fontWeight: 600,
  },
  body: {
    color: designTokens.textSecondary,
    fontWeight: 400,
  },
  caption: {
    color: designTokens.textMuted,
    fontSize: '0.875rem',
  },
  link: {
    color: designTokens.textLink,
    '&:hover': {
      color: designTokens.textLinkHover,
    }
  }
};
```

### Mantine Theme
```typescript
const theme = createTheme({
  primaryColor: 'teal',
  forceColorScheme: 'light', // ハイドレーション問題を回避
  colors: {
    // Primary Green Scale
    teal: [
      '#e6f5ee', // 0: 最も薄いプライマリ
      '#ccece0', // 1: 薄いプライマリ
      '#b3e2d1', // 2: ライトプライマリ
      '#9AD1B2', // 3: プライマリライト
      '#099268', // 4: メインプライマリ ⭐
      '#07785a', // 5: プライマリダーク
      '#066149', // 6: より濃いプライマリ
      '#044d3a', // 7: 濃いプライマリ
      '#03382b', // 8: 最も濃いプライマリ
      '#01241d', // 9: 最暗プライマリ
    ],

    // Gray Scale (Background & Text)
    gray: [
      '#f8f9fa', // 0: 全体背景
      '#e9ecef', // 1: セクション背景
      '#dee2e6', // 2: 薄いボーダー
      '#ced4da', // 3: 標準ボーダー
      '#adb5bd', // 4: 補助テキスト
      '#6c757d', // 5: サブテキスト
      '#495057', // 6: テキスト
      '#343a40', // 7: ダークテキスト
      '#212529', // 8: メインテキスト
      '#000000', // 9: 最も濃いテキスト
    ],

    // Status Colors - Red (Danger/Abnormal)
    red: [
      '#fff0f6', '#ffdeeb', '#fcc2d7', '#faa2c1',
      '#f783ac', '#f06595', '#e64980', '#d6336c',
      '#c2255c', '#a61e4d'
    ],

    // Status Colors - Yellow (Warning/Caution)
    yellow: [
      '#fff9db', '#fff3bf', '#ffec99', '#ffe066',
      '#ffd43b', '#fcc419', '#fab005', '#f59f00',
      '#f08c00', '#e67700'
    ],

    // Status Colors - Blue (Info/Secondary)
    blue: [
      '#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc',
      '#4dabf7', '#339af0', '#228be6', '#1c7ed6',
      '#1971c2', '#1864ab'
    ],

    // Success Colors - Green
    green: [
      '#ebfbee', '#d3f9d8', '#b2f2bb', '#8ce99a',
      '#69db7c', '#51cf66', '#40c057', '#37b24d',
      '#2f9e44', '#2b8a3e'
    ]
  },

  // コンポーネントデフォルト設定
  components: {
    Paper: {
      defaultProps: {
        bg: 'gray.0', // 全体背景色
        shadow: 'sm',
      },
    },
    Button: {
      defaultProps: {
        color: 'teal.4', // メインプライマリ
      },
    },
    Alert: {
      defaultProps: {
        radius: 'md',
      },
    },
    Text: {
      defaultProps: {
        c: 'gray.8', // メインテキスト色
      },
    },
    Title: {
      defaultProps: {
        c: 'gray.8', // メインテキスト色
      },
    },
  },

  // その他の設定
  defaultRadius: 'md',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

// テーマ色の使用例
const themeColors = {
  // 健康状態カラー
  healthNormal: theme.colors.green[6],      // #40c057
  healthCaution: theme.colors.yellow[6],    // #fab005
  healthAbnormal: theme.colors.red[6],      // #e64980

  // UI要素カラー
  primary: theme.colors.teal[4],            // #099268
  primaryLight: theme.colors.teal[3],       // #9AD1B2
  primaryDark: theme.colors.teal[6],        // #066149

  // テキストカラー
  textPrimary: theme.colors.gray[8],        // #212529
  textSecondary: theme.colors.gray[5],      // #6c757d
  textMuted: theme.colors.gray[4],          // #adb5bd

  // 背景カラー
  background: theme.colors.gray[0],         // #f8f9fa
  cardBackground: '#ffffff',
  sectionBackground: theme.colors.teal[0],  // #e6f5ee
};
```

### アイコン使用例
```typescript
import {
  IconCircleCheck,    // 正常
  IconAlertTriangle,  // 注意・危険
  IconDog,           // 犬
  IconCat,           // 猫
} from '@tabler/icons-react';
```

---

## ❗️ Important Notes

### データベース操作時の注意点
1. **RLS**: すべてのクエリは自動的にユーザーフィルタが適用される
2. **外部キー**: `auth.users(id)`への参照は必ず`auth.uid()`を使用
3. **タイムゾーン**: すべての日時は`TIMESTAMP WITH TIME ZONE`で管理
4. **カラム命名**: データベースは`snake_case`、TypeScriptは`camelCase`に変換

### 開発時のベストプラクティス
- コメントに `// TODO: confirm schema` を残す
- 不明な点は `@workspace` で確認
- 新機能追加時は必ずテストを同時作成
- デザイントークンから逸脱しない

---

> **更新手順**: スキーマ・要件・技術スタック変更時はこのファイルを修正し、チーム全体に共有してください。
