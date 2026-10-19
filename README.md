# Flintzy — Multi-Channel Social Media Post Scheduler
> **Positioning**: *"Never publish something broken."*

A production-grade, multi-channel social media scheduler engineered for creators, marketers, and social teams. Flintzy eliminates the #1 frustration in social media operations: silent platform publishing rejections, truncated character limits, broken media dimensions, and timezone scheduling errors.

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript (Strict)**, **Tailwind CSS**, **TanStack Query v5**, **Framer Motion**, and **Vitest**.

---

## ⚡ Quick Start

### Prerequisites
* **Node.js**: `v20.x` or `v22.x+` (Node 22 or 24 recommended)
* **Package Manager**: **`pnpm`** `v9.x` or `v10.x` (recommended)
  * If you don't have `pnpm` installed: `npm install -g pnpm`

### 1. Clone the repository
```bash
git clone https://github.com/bakshiyogesh/socialmedia-posts-schedular-flintzy.git
cd socialmedia-posts-schedular-flintzy
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Run the development server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts local Next.js development server with Turbopack / HMR at `localhost:3000` |
| `pnpm build` | Creates an optimized production build |
| `pnpm start` | Runs the compiled Next.js production server |
| `pnpm test` | Runs the complete Vitest unit test suite (38 passing tests) |
| `pnpm test:watch` | Runs Vitest in interactive watch mode for TDD |
| `pnpm typecheck` | Runs TypeScript compiler (`tsc --noEmit`) to verify strict type safety |
| `pnpm lint` | Runs Next.js ESLint rules |

---

## ✨ Key Features

### 1. 🛡️ Pre-Flight Validation Engine
Catch publishing errors **before** the post is queued:
* **Real-time Character Limits**: Instant validation across platforms (e.g., X 280-char ceiling vs. LinkedIn 3,000 chars).
* **Media Enforcement**: Requires media for visual-first platforms (Instagram, TikTok) while allowing text-only posts on X, Facebook, and LinkedIn.
* **Timestamp Invariant**: Prevents scheduling in the past; enforces future UTC timestamps.
* **Format & Aspect Ratio Checks**: Validates images and videos with progressive feedback.

### 2. 📱 Multi-Platform Live Feed Previews
* Live, pixel-accurate previews simulating **X (Twitter)**, **Instagram** (with verified badges and bottom captioning), **TikTok**, **Facebook**, and **LinkedIn**.
* Per-platform caption customization overrides.

### 3. 📅 Interactive Calendar & Date-Based Scheduling
* **Calendar View**: Monthly grid showing daily scheduled post counters.
* **Click-to-Schedule**: Clicking an empty calendar day pre-fills that date in the composer; clicking a day with existing posts lets you inspect or edit.
* **Smart Day Grouping**: Posts are automatically categorized under **Today**, **Tomorrow**, upcoming dates, or **Earlier** (historical/failed) computed against local midnight boundaries.

### 4. 🔄 1-Click Failure Recovery & Bulk Operations
* Categorized error badges for failed posts (`token_expired`, `media_rejected`, `rate_limited`).
* **Optimistic Single Retry**: Instant visual feedback with a simulated 20% failure probability to test rollback and toast recovery.
* **Bulk Retry Banner**: Recover all failed posts across the queue in one click.
* **Bulk Reschedule & Bulk Delete**: Reschedule or delete multiple posts with confirmation modals and a 5-second **Undo** toast window.

### 5. 💾 Crash-Proof Draft Persistence
* **Text & Settings**: Saved in `localStorage` in real time.
* **Media Assets**: Large images, videos, and Base64 uploads are saved to **IndexedDB** (`draftMediaDb`) to bypass the 5MB localStorage quota.
* **Unload Guard**: Warns users if they attempt to navigate away with unsaved composer changes.

---

## 🗂️ Project Directory Structure

```text
socialmedia-posts-schedular-flintzy/
├── ARCHITECTURE.md                  # Comprehensive architectural decision records (ADRs)
├── public/                          # Static assets and favicons
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── api/posts/               # REST API Route Handlers (GET, POST, retry, bulk)
│   │   ├── layout.tsx               # Root application layout with TanStack Query provider
│   │   ├── page.tsx                 # Main dashboard view (URL state, filters, queue, composer)
│   │   └── globals.css              # Tailwind CSS base tokens & custom scrollbars
│   ├── config/
│   │   └── platforms.ts             # Declarative platform rules (limits, requirements, badges)
│   ├── features/                    # Feature-sliced modular architecture
│   │   ├── calendar/                # Calendar view, month grid, click-to-schedule routing
│   │   ├── composer/                # Multi-platform composer, live preview, pre-flight panel
│   │   ├── drafts/                  # Draft recovery prompts & unload guards
│   │   ├── filters/                 # URL-synced search, platform chips, date filter popover
│   │   └── posts/                   # PostCard, PostQueue, StatusBadge, RescheduleModal, DeleteModal
│   ├── lib/
│   │   ├── api/                     # In-memory post store seeded with 32 realistic posts
│   │   ├── media/                   # Progressive image loader, video detector, URL normalizer
│   │   ├── storage/                 # IndexedDB draft media binary cache (draftMediaDb)
│   │   └── time/                    # UTC converters, local midnight grouping, relative timestamps
│   └── types/
│       └── index.ts                 # Strict TypeScript domain models (Post, PlatformId, Status)
├── tests/
│   └── unit.test.ts                 # 38 Vitest tests covering timezones, filters, validation, & UI
├── package.json
└── pnpm-lock.yaml
```

For in-depth details on system design, data flow diagrams, and architectural decision records, see **[`ARCHITECTURE.md`](file:///home/thirdweb/work/socialmedia-posts-schedular-flintzy/ARCHITECTURE.md)**.

---

## 📊 Platform Limits Matrix

| Platform | Character Ceiling | Media Required? | Supported Media Formats |
| :--- | :---: | :---: | :--- |
| **X (Twitter)** | 280 chars | No | Images (JPEG/PNG), MP4 Videos |
| **Instagram** | 2,200 chars | **Yes** | Single Image, Carousel, Reels Video |
| **TikTok** | 2,200 chars | **Yes** | Vertical Video (9:16) |
| **Facebook** | 5,000 chars | No | Images, Video, Text |
| **LinkedIn** | 3,000 chars | No | Articles, Images, Documents, Video |

---

## 🧪 Testing & Quality Assurance

Flintzy includes a comprehensive test suite written in **Vitest**:

```bash
# Run all unit tests
pnpm test
```

### Covered Test Suites (38 tests):
1. **Timezone & Local Midnight Grouping**: Validates that posts scheduled across UTC midnight remain strictly grouped by local user calendar days.
2. **Filtering & Search Engine**: Case-insensitive search, multi-platform intersection, and status counting.
3. **Pre-Flight Validation Engine**: Enforces character caps, media checks, URL parsing, and future-date constraints.
4. **Media Utilities**: Protocol normalization (`blob:`, `data:`, external HTTP) and video container detection.
5. **Relative Timestamping**: Short social media relative notations (`1hr ago`, `1d`, `1w`).
6. **IndexedDB Draft Recovery**: Verifies SSR safety and non-browser fallback handling.
7. **Popover Auto-Flip Collision**: Viewport boundary detection and vertical flip calculation.
8. **Selection & Deletion State**: Bulk ID management, single-post deletion filtering, and cleanup.
9. **Date Filtering Engine**: `today`, `tomorrow`, `earlier`, and exact `YYYY-MM-DD` matching.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>C</kbd> | Open Post Composer |
| <kbd>/</kbd> | Focus Search Bar |
| <kbd>Cmd</kbd> / <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Submit & Schedule Post (when pre-flight checks pass) |
| <kbd>Esc</kbd> | Close Modal or Drawer |

---

## 🚀 Deployment (Vercel)

Flintzy is optimized for seamless deployment on **Vercel**:

1. Push your repository to GitHub.
2. Import the project into your Vercel Dashboard.
3. Vercel automatically detects `pnpm-lock.yaml` and executes:
   - **Install Command**: `pnpm install`
   - **Build Command**: `pnpm run build`
4. Deploy! Zero additional configuration required.
