# Shadow Vehicle Compatibility — 前後端分離開發計畫

**版本**：v1.0
**日期**：2026-04-14
**狀態**：待 Steven 確認後交付工程師執行

---

## 一、專案目標

將現有的靜態 HTML 車種相容性網站，重構為 Next.js 16 應用。資料從 Notion 即時拉取，前端以四層架構組織，支援 i18n 多語系。

### 核心改動

| 現狀 | 目標 |
|------|------|
| 資料寫死在 HTML `<script>` 裡 | 從 Notion API server-side 拉取 |
| en/ cn/ 兩套完整複製 | 一套 component + i18n 翻譯檔 |
| 純 HTML + vanilla JS | Next.js 16 + React 19.2 |
| GitHub Pages 靜態部署 | Vercel（支援 ISR） |
| 無快取機制 | `"use cache"` + 5 分鐘 revalidate |

---

## 二、技術棧

| 層級 | 技術 | 版本 | 說明 |
|------|------|------|------|
| 框架 | Next.js | 16.2+ | App Router, Turbopack, React Compiler |
| UI | React | 19.2 | Server Components + Client Components |
| 樣式 | Tailwind CSS | v4.2+ | CSS-first 設定，`@import "tailwindcss"` |
| i18n | next-intl | v4.9+ | Server Components 原生支援 |
| 資料源 | @notionhq/client | latest | Notion 官方 SDK |
| 語言 | TypeScript | 5.x | 嚴格模式 |
| 部署 | Vercel | - | ISR + CDN |
| 套件管理 | pnpm | latest | 推薦，比 npm 快且節省空間 |

---

## 三、四層架構

```
┌─────────────────────────────────────────────────┐
│                   View Layer                     │
│         app/[locale]/page.tsx 等頁面              │
│         組合 components，傳入資料，純佈局          │
├─────────────────────────────────────────────────┤
│                Component Layer                   │
│         components/ProductCard.tsx 等             │
│         可重用 UI 元件，接收 props 渲染            │
├─────────────────────────────────────────────────┤
│                  Hook Layer                      │
│         hooks/useSearch.ts 等                    │
│         Client-side 邏輯：搜尋、篩選、分頁         │
├─────────────────────────────────────────────────┤
│                Server Layer                      │
│         lib/notion.ts + server actions           │
│         Notion API 呼叫、資料轉換、快取            │
└─────────────────────────────────────────────────┘
```

### 各層職責與規則

**Server Layer** (`src/lib/`)
- 唯一接觸 Notion API 的地方
- 所有函式標記 `"use cache"` + `cacheLife({ revalidate: 300 })`（5 分鐘）
- 負責資料轉換：Notion raw → 乾淨的 TypeScript 型別
- API Key 只存在此層，不會暴露到 client

**Hook Layer** (`src/hooks/`)
- 只處理 client-side 邏輯
- 搜尋、篩選、排序、分頁等互動行為
- 不直接呼叫 Notion API
- 資料由 View Layer 透過 props 傳入

**Component Layer** (`src/components/`)
- 純 UI 渲染，不含業務邏輯
- Server Component 為預設，需要互動才加 `"use client"`
- 接收 typed props，回傳 JSX

**View Layer** (`src/app/[locale]/`)
- 頁面級組合：呼叫 Server Layer 取資料 → 傳給 Components
- 設定 metadata、快取策略
- 盡量保持為 Server Component

---

## 四、專案結構

```
web/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx              ← 共用 layout（nav + footer）
│   │   │   ├── page.tsx                ← 首頁（產品卡片列表）
│   │   │   ├── [product]/
│   │   │   │   └── page.tsx            ← 產品相容性表頁面
│   │   │   └── not-found.tsx
│   │   ├── layout.tsx                  ← Root layout（html, body）
│   │   └── globals.css                 ← Tailwind 入口 + 主題變數
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              ← 導覽列（含語系切換）
│   │   │   ├── Footer.tsx
│   │   │   └── TopBar.tsx              ← 頂部橘色漸層條
│   │   ├── home/
│   │   │   ├── HeroSection.tsx         ← 首頁 hero 區塊
│   │   │   ├── ProductCard.tsx         ← 產品卡片
│   │   │   ├── ProductGrid.tsx         ← 卡片 grid 容器
│   │   │   └── StoryBanner.tsx         ← 品牌故事橫幅
│   │   └── product/
│   │       ├── CompatibilityTable.tsx  ← 車種相容性表格（Server Component）
│   │       ├── SearchBar.tsx           ← 搜尋輸入框（Client Component）
│   │       ├── BrandFilter.tsx         ← 品牌篩選器（Client Component）
│   │       ├── VehicleRow.tsx          ← 單行車種資料
│   │       └── StatsHeader.tsx         ← 產品頁 hero 統計數字
│   │
│   ├── hooks/
│   │   ├── useSearch.ts               ← 模糊搜尋 + debounce
│   │   ├── useFilter.ts              ← 品牌/區域篩選
│   │   ├── usePagination.ts          ← 分頁邏輯
│   │   └── useCompatibility.ts       ← 整合搜尋+篩選+分頁
│   │
│   ├── lib/
│   │   ├── notion.ts                  ← Notion client 初始化
│   │   ├── queries/
│   │   │   ├── vehicles.ts            ← 車種主表查詢
│   │   │   ├── products.ts            ← 各產品 DB 查詢
│   │   │   └── stats.ts              ← 統計數字查詢
│   │   ├── transformers/
│   │   │   ├── vehicle.ts             ← Notion → Vehicle 型別轉換
│   │   │   └── product.ts            ← Notion → Product 型別轉換
│   │   └── types/
│   │       ├── vehicle.ts             ← Vehicle 相關型別
│   │       └── product.ts            ← Product 相關型別
│   │
│   ├── i18n/
│   │   ├── routing.ts                 ← defineRouting() 設定
│   │   └── request.ts                ← setRequestLocale()
│   │
│   └── messages/
│       ├── en.json                    ← 英文翻譯
│       └── zh-TW.json                ← 繁體中文翻譯
│
├── public/
│   └── images/                        ← 產品圖片（如需本地化）
│
├── .env.local                         ← NOTION_API_KEY（不進 git）
├── .env.example                       ← 環境變數範本（進 git）
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

---

## 五、Notion 資料源對照

### Database ID 對照表

| 產品 | Database ID | 對應前端路由 slug |
|------|------------|-----------------|
| 車種主表 | `31f0520b-2dc7-8093-9752-f1110f9e2675` | （不直接對外，僅供 server 端 join） |
| E-Drive 4S | `31f0520b-2dc7-80b4-bc04-f1f7084a22ba` | `/4s` |
| FD-EVO | `31f0520b-2dc7-807f-bfe4-dc7d02687ea9` | `/fdevo` |
| D-Meter 2Plus | `31f0520b-2dc7-80a9-afd2-e145a8efa8f8` | `/dmeter2plus` |
| IBOOST2 | `31f0520b-2dc7-80c4-82ce-de42463e681e` | `/iboost2` |
| 閥門控制器 | `31f0520b-2dc7-8062-9590-cf728d01b84c` | `/valve` |
| ST-Filter | **無 Notion DB，使用 JSON 檔案** | `/stfilter` |

### 車種主表 Schema

| 欄位 | Property ID | 類型 | 前端顯示名稱 |
|------|------------|------|-------------|
| 車種 (title) | `title` | title | Vehicle |
| Brand | `IEg\` | rich_text | Brand |
| Model | `g[\|@` | rich_text | Model |
| Chassis | `UV_<` | rich_text | Chassis |
| Model Year | `pjmZ` | rich_text | Year |
| Engine Type | `h>\>` | rich_text | Engine |
| 原廠馬力 | `QNQg` | rich_text | Power |
| Area | `FnzA` | multi_select | Region |

### 注意事項（從 CLAUDE.md 搬過來的規則）

1. **分頁上限 100 筆/頁**，4S 有 1,076 筆需要分多頁取完
2. **Notion API 速率限制**：每秒 3 個請求。Server Layer 需加上重試和間隔
3. **ST-Filter 資料**：不在 Notion 裡，維持從 `data/stfilter_data.json` 讀取
4. **品牌查詢用 `contains` 不用 `equals`**

---

## 六、TypeScript 型別定義

```typescript
// src/lib/types/vehicle.ts

/** 車種主表的基本資料 */
export interface Vehicle {
  id: string            // Notion page ID
  brand: string         // 品牌（英文大寫）
  model: string         // 車型
  chassis: string       // 底盤代號（如 G20, FK8）
  year: string          // 生產年份
  engine: string        // 引擎型號
  power: string         // 原廠馬力
  area: string[]        // 區域（multi_select）
}

/** 各產品的相容性資料 */
export interface ProductCompatibility {
  vehicle: Vehicle
  harness?: string      // 線組型號（4S 專有）
  waterTee?: string     // 水三通（4S 專有）
  turboAdapter?: string // 渦輪轉接座
  oilPressure?: string  // 油壓感應器
  note?: string         // 備註
}

/** ST-Filter 專用型別 */
export interface STFilterVehicle {
  brand: string
  model: string
  chassis: string
  year: string
  engine: string
  knNumber: string      // K&N 料號
  swCode: string | null // Shadow 料號
  inStock: boolean      // 是否有庫存
  note: string | null
}

/** 產品定義 */
export interface Product {
  slug: string          // URL slug: '4s', 'fdevo', etc.
  name: string          // 顯示名稱 key（i18n 用）
  subtitle: string      // 副標題 key（i18n 用）
  databaseId: string    // Notion database ID
  vehicleCount: number  // 車種數量
  brandCount: number    // 品牌數量
  image: string         // 產品圖片 URL
}

/** 首頁統計 */
export interface SiteStats {
  totalVehicles: number
  totalProducts: number
  totalBrands: number
}
```

---

## 七、分階段實施計畫

### Phase 0：專案初始化（1 天）

**目標**：建立可運行的空專案骨架

**任務清單**：

- [ ] 0.1 — 用 `create-next-app@16` 建立專案
  ```bash
  npx create-next-app@16 web-next --typescript --tailwind --eslint --app --turbopack
  ```
- [ ] 0.2 — 確認 Tailwind v4 設定正確
  - `postcss.config.mjs` 使用 `@tailwindcss/postcss`
  - `globals.css` 使用 `@import "tailwindcss"`
  - 在 `@theme` 區塊定義 Shadow 品牌色系：
    ```css
    @import "tailwindcss";

    @theme {
      --color-orange: #EA5504;
      --color-orange-dim: #ea550420;
      --color-orange-glow: #ea550466;
      --color-bg: #0a0a0a;
      --color-bg2: #111211;
      --color-bg3: #1a1a1a;
      --color-card: #141414;
      --color-border: #222222;
      --color-text: #f0f0f0;
      --color-text2: #aaaaaa;
      --color-text3: #666666;
    }
    ```
- [ ] 0.3 — 安裝額外依賴
  ```bash
  pnpm add @notionhq/client next-intl
  ```
- [ ] 0.4 — 建立 `.env.local` 和 `.env.example`
  ```env
  # .env.example
  NOTION_API_KEY=your_notion_integration_token_here
  ```
- [ ] 0.5 — 建立 `src/` 完整目錄結構（按第四節的樹狀圖）
- [ ] 0.6 — 設定 next-intl
  - `src/i18n/routing.ts`：`locales: ['en', 'zh-TW']`, `defaultLocale: 'en'`
  - `src/i18n/request.ts`：`setRequestLocale()`
  - `middleware.ts`：語系路由攔截
  - `src/messages/en.json` 和 `zh-TW.json`：先放空殼
- [ ] 0.7 — 確認 `pnpm dev` 可正常啟動，首頁顯示 "Hello World" + 語系切換可運作

**驗收條件**：
- `pnpm dev` 無錯誤
- 訪問 `/en` 和 `/zh-TW` 各顯示對應語系文字
- Tailwind 樣式正常套用（背景色 #0a0a0a）

---

### Phase 1：Server Layer（2 天）

**目標**：完成所有 Notion 資料取得與轉換邏輯

**任務清單**：

- [ ] 1.1 — `src/lib/notion.ts`：初始化 Notion client
  ```typescript
  import { Client } from '@notionhq/client'

  export const notion = new Client({
    auth: process.env.NOTION_API_KEY,
  })
  ```

- [ ] 1.2 — `src/lib/types/vehicle.ts` 和 `product.ts`：定義所有型別（見第六節）

- [ ] 1.3 — `src/lib/transformers/vehicle.ts`：Notion response → Vehicle 型別
  - 處理 rich_text 取值（Notion 回傳格式是 array of rich_text objects）
  - 處理 multi_select 轉 string[]
  - 處理空值和 edge cases

- [ ] 1.4 — `src/lib/queries/vehicles.ts`：車種主表查詢
  - `getAllVehicles()`：分頁取全部（每頁 100 筆，遞迴取完）
  - `getVehiclesByBrand(brand)`：按品牌取
  - 所有函式加 `"use cache"` + `cacheLife({ revalidate: 300 })`

- [ ] 1.5 — `src/lib/queries/products.ts`：各產品 DB 查詢
  - `getProductData(databaseId)`：取特定產品的所有車種
  - 產品 config 常數對照表（slug → databaseId mapping）
  - 分頁處理（4S 有 1,076 筆）
  - Notion API rate limit 防護（每秒 3 請求，失敗重試 3 次）

- [ ] 1.6 — `src/lib/queries/stats.ts`：統計數字
  - `getSiteStats()`：回傳 SiteStats 型別
  - 各產品車種數、品牌數

- [ ] 1.7 — ST-Filter 特殊處理
  - 從 `public/data/stfilter_data.json` 讀取（移到 public）
  - 轉換為統一的 STFilterVehicle 型別

**驗收條件**：
- 寫一個臨時測試頁面 `/en/test`，呼叫每個 query 函式並印出結果
- 所有 6 個產品的資料都能正確取回
- 第二次載入明顯更快（命中快取）
- console 無 API Key 暴露警告

---

### Phase 2：Component Layer（3 天）

**目標**：把現有 HTML 設計拆成可重用 React components

**設計參考**：完全沿用現有設計語言（深色底 + Shadow Orange），只是從 HTML 轉為 React + Tailwind

**任務清單**：

- [ ] 2.1 — Layout 類
  - `TopBar.tsx` — 頂部 4px 橘色漸層條（Server Component）
  - `Navbar.tsx` — 固定導覽列 + 語系切換（Client Component，需要互動）
  - `Footer.tsx` — 頁尾版權資訊（Server Component）

- [ ] 2.2 — 首頁類
  - `HeroSection.tsx` — hero 區塊，接收 `stats: SiteStats` props
  - `ProductCard.tsx` — 單張產品卡片，接收 `product: Product` props
  - `ProductGrid.tsx` — 卡片 grid 容器，接收 `products: Product[]`
  - `StoryBanner.tsx` — "Along With Shadow" 品牌故事橫幅

- [ ] 2.3 — 產品頁類
  - `StatsHeader.tsx` — 產品頁頂部（產品名稱 + 統計數字），Server Component
  - `SearchBar.tsx` — 搜尋輸入框，`"use client"` + debounce 300ms
  - `BrandFilter.tsx` — 品牌按鈕篩選器，`"use client"`
  - `VehicleRow.tsx` — 表格單行，Server Component
  - `CompatibilityTable.tsx` — 表格容器，組合 SearchBar + BrandFilter + VehicleRow

- [ ] 2.4 — 共用類
  - `Badge.tsx` — 狀態標籤（harness 型號、庫存狀態等）
  - `StatBlock.tsx` — 數字 + 標籤的統計區塊

**每個 component 的標準**：
- TypeScript props interface 定義完整
- 不含業務邏輯（邏輯放 hooks）
- 預設為 Server Component，只在需要 useState / useEffect 時加 `"use client"`
- 使用 Tailwind v4 class（不寫 inline style）

**驗收條件**：
- 每個 component 可獨立渲染（不依賴外部資料即可看到 UI）
- 視覺效果與現有 HTML 頁面一致（深色主題、Shadow Orange 配色、卡片動畫）
- 手機版 RWD 正常

---

### Phase 3：Hook Layer（1.5 天）

**目標**：封裝所有 client-side 互動邏輯

**任務清單**：

- [ ] 3.1 — `useSearch.ts`
  ```typescript
  interface UseSearchProps<T> {
    data: T[]
    searchFields: (keyof T)[]  // 要搜尋的欄位
    debounceMs?: number        // 預設 300ms
  }

  interface UseSearchReturn<T> {
    query: string
    setQuery: (q: string) => void
    results: T[]
    isSearching: boolean
  }
  ```
  - 模糊搜尋（不區分大小寫）
  - debounce 防抖
  - 空字串回傳全部

- [ ] 3.2 — `useFilter.ts`
  ```typescript
  interface UseFilterReturn {
    activeBrand: string | null
    setActiveBrand: (brand: string | null) => void
    activeArea: string | null
    setActiveArea: (area: string | null) => void
    applyFilters: <T extends { brand: string; area?: string[] }>(data: T[]) => T[]
  }
  ```

- [ ] 3.3 — `usePagination.ts`
  - 接收 `totalItems` 和 `pageSize`（預設 50）
  - 回傳 `currentPage`, `totalPages`, `paginatedData`, `goToPage`, `nextPage`, `prevPage`

- [ ] 3.4 — `useCompatibility.ts`
  - 組合 useSearch + useFilter + usePagination
  - 一個 hook 完成「搜尋 → 篩選 → 分頁」的完整流程
  - 回傳最終顯示的資料 + 所有控制函式

**驗收條件**：
- 搜尋輸入 "BMW" 即時篩出 BMW 車種
- 點品牌按鈕可切換篩選
- 分頁切換正常
- 清除搜尋和篩選後回到全部資料

---

### Phase 4：View Layer — 組合頁面（2 天）

**目標**：把 Server Layer + Components + Hooks 組合成完整頁面

**任務清單**：

- [ ] 4.1 — Root Layout (`src/app/layout.tsx`)
  ```typescript
  // 設定 metadata、字體、語系 provider
  ```

- [ ] 4.2 — Locale Layout (`src/app/[locale]/layout.tsx`)
  ```typescript
  // 包裹 NextIntlClientProvider
  // 渲染 TopBar + Navbar + children + Footer
  ```

- [ ] 4.3 — 首頁 (`src/app/[locale]/page.tsx`)
  ```typescript
  "use cache"
  // 1. 呼叫 getSiteStats() 取統計數字
  // 2. 呼叫 getAllProducts() 取產品列表
  // 3. 組合 HeroSection + ProductGrid + StoryBanner
  ```

- [ ] 4.4 — 產品頁 (`src/app/[locale]/[product]/page.tsx`)
  ```typescript
  "use cache"
  // 1. 從 params 取 product slug
  // 2. 呼叫 getProductData(databaseId) 取車種資料
  // 3. generateStaticParams() 預生成所有產品頁
  // 4. 組合 StatsHeader + CompatibilityTable
  ```

- [ ] 4.5 — 產品頁的 Client Wrapper
  - 表格互動部分（搜尋+篩選+分頁）需要 `"use client"`
  - 模式：Server Component 取資料 → 傳給 Client Component 做互動
  ```
  page.tsx (Server) → 取 Notion 資料
    └─ CompatibilityClient.tsx (Client) → useCompatibility hook
         └─ SearchBar + BrandFilter + Table (渲染)
  ```

- [ ] 4.6 — 404 頁面 (`src/app/[locale]/not-found.tsx`)

- [ ] 4.7 — `generateStaticParams()`
  - 預生成所有 locale × product 組合
  - `['en', 'zh-TW']` × `['4s', 'fdevo', 'dmeter2plus', 'iboost2', 'valve', 'stfilter']`
  - = 12 個靜態頁面 + 2 個首頁 = 14 頁

**驗收條件**：
- 所有頁面可正常載入
- 資料正確從 Notion 取得
- 搜尋、篩選、分頁功能正常
- 語系切換正常（URL 從 `/en/4s` 切到 `/zh-TW/4s`）
- 首次載入後刷新頁面明顯更快（ISR 快取生效）

---

### Phase 5：i18n 翻譯（1 天）

**目標**：完成中英文翻譯

**任務清單**：

- [ ] 5.1 — `messages/en.json` 結構
  ```json
  {
    "nav": {
      "officialSite": "Official Site",
      "products": "Products"
    },
    "home": {
      "eyebrow": "Shadow Performance",
      "title": "Find Your {accent} Products",
      "titleAccent": "Compatible",
      "description": "Complete vehicle compatibility database covering six product lines.",
      "statVehicles": "Vehicles",
      "statProducts": "Products",
      "statBrands": "Brands",
      "selectProduct": "Select a Product",
      "productLines": "{count} product lines"
    },
    "product": {
      "searchPlaceholder": "Search by brand, model, chassis code...",
      "allBrands": "All Brands",
      "vehicles": "Vehicles",
      "brands": "Brands",
      "viewList": "View List",
      "noResults": "No matching vehicles found",
      "page": "Page {current} of {total}"
    },
    "story": {
      "eyebrow": "Along With Shadow",
      "title": "Gonna Be Remarkable.",
      "description": "Precision engineering for racing and street performance.",
      "cta": "About Us"
    },
    "products": {
      "4s": { "name": "E-Drive 4S", "subtitle": "Throttle Controller", "description": "..." },
      "fdevo": { "name": "FD-EVO", "subtitle": "Multi-Function Display", "description": "..." },
      "dmeter2plus": { "name": "D-Meter 2Plus", "subtitle": "OBD2 Digital Display", "description": "..." },
      "iboost2": { "name": "IBOOST2", "subtitle": "Tuning Box", "description": "..." },
      "valve": { "name": "Valve Controller", "subtitle": "E-VALVE2 / X-FLAP", "description": "..." },
      "stfilter": { "name": "ST-Filter", "subtitle": "High Flow Air Filter", "description": "..." }
    },
    "footer": {
      "copyright": "© {year} Shadow Performance Electronics — AUTO JAW CO., LTD."
    }
  }
  ```

- [ ] 5.2 — `messages/zh-TW.json`（同結構，繁體中文翻譯）

- [ ] 5.3 — 所有 component 中的硬編碼文字替換為 `useTranslations()` 或 `getTranslations()`

**驗收條件**：
- 頁面上無硬編碼的中英文（除了品牌名、車型名等資料欄位）
- `/en` 和 `/zh-TW` 各顯示正確語系
- 語系切換不觸發完整頁面重載

---

### Phase 6：部署與遷移（1 天）

**目標**：部署到 Vercel，替換現有 GitHub Pages

**任務清單**：

- [ ] 6.1 — Vercel 專案設定
  - 連結 GitHub repo
  - 設定環境變數 `NOTION_API_KEY`
  - Framework Preset: Next.js
  - Build Command: `pnpm build`

- [ ] 6.2 — 自訂域名
  - 目前 CNAME 指向 GitHub Pages，改指向 Vercel
  - 在 Vercel Dashboard 加入自訂域名
  - 等 DNS 生效

- [ ] 6.3 — 驗證清單
  - [ ] 所有 6 個產品頁資料正確
  - [ ] 首頁統計數字正確
  - [ ] 搜尋功能正常
  - [ ] 品牌篩選正常
  - [ ] 中英文切換正常
  - [ ] 手機版 RWD 正常
  - [ ] 頁面載入速度 < 1 秒（Lighthouse Performance > 90）
  - [ ] ISR 運作正常（修改 Notion 後 5 分鐘內網站更新）

- [ ] 6.4 — 舊檔案清理
  - 保留舊 HTML 在 `archive/` 分支（不刪除，保留備份）
  - 更新 `README.md`

---

## 八、時程估算

| Phase | 內容 | 估計天數 | 前置依賴 |
|-------|------|---------|---------|
| 0 | 專案初始化 | 1 | 無 |
| 1 | Server Layer | 2 | Phase 0 |
| 2 | Component Layer | 3 | Phase 0（可與 Phase 1 平行） |
| 3 | Hook Layer | 1.5 | Phase 2 |
| 4 | View Layer（組合） | 2 | Phase 1 + 2 + 3 |
| 5 | i18n 翻譯 | 1 | Phase 4 |
| 6 | 部署與遷移 | 1 | Phase 5 |
| **合計** | | **~10 個工作天** | |

**可平行的工作**：Phase 1（Server）和 Phase 2（Component）可以兩個人同時做，壓縮到 3 天。

```
Timeline（單人）:
Day 1        ── Phase 0: 初始化
Day 2-3      ── Phase 1: Server Layer
Day 2-5      ── Phase 2: Components（Day 2-3 可與 Phase 1 平行）
Day 5-6      ── Phase 3: Hooks
Day 7-8      ── Phase 4: 組合頁面
Day 9        ── Phase 5: i18n
Day 10       ── Phase 6: 部署

Timeline（雙人，1 做 Server + Hooks，2 做 Components）:
Day 1        ── Phase 0: 初始化（一起）
Day 2-3      ── 人1: Phase 1 / 人2: Phase 2
Day 4        ── 人1: Phase 3 / 人2: Phase 2 收尾
Day 5-6      ── Phase 4: 組合（一起）
Day 7        ── Phase 5 + 6（一起）
= 7 個工作天
```

---

## 九、環境變數

| 變數名 | 說明 | 範例 |
|--------|------|------|
| `NOTION_API_KEY` | Notion Integration Token | `ntn_xxxxxxxxxxxxxxxx` |

**取得方式**：
1. 到 https://www.notion.so/profile/integrations 建立 Internal Integration
2. 在每個 database 頁面點「...」→「Connections」→ 加入該 Integration
3. 複製 token 到 `.env.local`

---

## 十、風險與注意事項

| 風險 | 影響 | 對策 |
|------|------|------|
| Notion API 速率限制（3 req/s） | build 時間長，4S 有 1,076 筆 | 加入 retry + 間隔 350ms，分頁遞迴 |
| Notion API 偶爾回傳不完整 | 頁面資料缺漏 | transformer 加上 fallback 空值處理 |
| Next.js 16 `"use cache"` 尚新 | 文件可能不夠完整 | 先測試 ISR 行為，備案用 `unstable_cache` |
| ST-Filter 不在 Notion | 資料來源不一致 | 獨立 loader，統一輸出型別 |
| Notion 欄位格式不一致 | 轉換錯誤 | transformer 中做嚴格型別檢查 + 日誌 |

---

## 十一、未來擴展（本期不做，記錄備查）

- [ ] 全文搜尋（Algolia / Meilisearch）
- [ ] 車種比較功能
- [ ] 使用者回報「我的車也可以用」
- [ ] 更多語系（日文、韓文）
- [ ] Notion Webhook → 主動 revalidate（取代 5 分鐘輪詢）
- [ ] ST-Filter 資料遷移到 Notion

---

*本文件由 Claude 產出，經 Steven 確認後交付工程師執行。*
*工程師有任何架構疑問請先回報，不要自行改動四層架構的分層邏輯。*
