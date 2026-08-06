# 🎓 YASSE Learn — Premier Open Educational Web Platform

[![Live App](https://img.shields.io/badge/Live_App-yasse--learn.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://yasse-learn.vercel.app)
[![Next.js](https://img.shields.io/badge/Framework-Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Standalone_App_Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://yasse-learn.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)](LICENSE)

> **Live Production Deployment**: [https://yasse-learn.vercel.app](https://yasse-learn.vercel.app)  
> **Official GitHub Repository**: [https://github.com/yati1818/YASSE-LEARN](https://github.com/yati1818/YASSE-LEARN)

---

## 🌟 Overview

**YASSE Learn** is a production-grade, zero-cost, open-source educational powerhouse designed for students from **Class 3 to Class 12** across **CBSE, ICSE, State Board, and International** curricula. Built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**, YASSE Learn connects Students, Teachers, and AI in a seamless, zero-bug, truth-driven ecosystem.

### Key Architectural Pillars:

- 📱 **Mobile-First PWA Architecture**: Installable native app shell with offline Service Worker caching, touch bottom tabs, and instant update notifications.
- 🔑 **Strict 10-Digit Mobile OTP Authentication**: Validates Indian 10-digit mobile numbers (`^[6-9]\d{9}$`), enforces 1-Mobile-1-Account uniqueness constraints, and verifies cryptographically generated 6-digit OTP codes.
- 👤 **Unique `@username` Handle Engine**: Database-backed unique handle validation preventing duplicate handles across the platform.
- ⏱ **30-Minute Time-Gated Real-Time Daily Streak Engine**: Requires cumulative **30 minutes of active learning** per calendar day to unlock daily streak flames (🔥) and Brain Synapse XP (+100 XP).
- 🏆 **Global Streak Leaderboard & Peer Network**: Ranks learners by active streak count and allows sending/accepting peer **Friend Requests**.
- 👩‍🏫 **Strict AI-Enforced Teacher Upload Pipeline**: Multi-stage AI compliance scanner checks curriculum safety. Videos remain `pending_admin_approval` until verified by AI and approved via signed email tokens dispatched to **`yatishsathish3012@gmail.com`**.
- 💬 **Collaborative YASSE AI Companion**: Interactive slide-out assistant providing LaTeX-formatted math formula solutions (\(V = I \times R\), \(E = mc^2\)) with dual mentor personas (**Prof. Aryan** & **Dr. Ananya**).
- 🎮 **Educational Mini-Games Hub**: Embedded **Math Sprint 🧮** and **Science Element Match 🧪** games for interactive learning.
- 📊 **Zero Mock Data Baseline**: Starts completely clean (**0 lectures, 0 XP, 0 streaks**) awaiting verified educator contributions.
- 📬 **Client Diagnostic Telemetry**: Bug reports automatically capture client metadata (OS, Device, Browser, Resolution, Grade View) and route directly to **`yatishsathish3012@gmail.com`**.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS + Vanilla CSS Tokens |
| **Animations** | Framer Motion + Canvas Confetti |
| **Icons** | Lucide React |
| **Validation** | Zod 4 Schema Validation |
| **PWA** | Web App Manifest + Service Worker v2 |
| **Deployment** | Vercel Serverless Network |

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yati1818/YASSE-LEARN.git
   cd YASSE-LEARN
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📐 Project Structure

```
YASSE-LEARN/
├── app/
│   ├── api/
│   │   ├── admin/approve-video/route.ts
│   │   ├── admin/request-approval/route.ts
│   │   ├── ai/verify-video/route.ts
│   │   ├── auth/check-mobile/route.ts
│   │   ├── auth/login/route.ts
│   │   ├── auth/register/route.ts
│   │   ├── doubts/send/route.ts
│   │   ├── feedback/route.ts
│   │   ├── otp/send/route.ts
│   │   └── otp/verify/route.ts
│   ├── dashboard/page.tsx
│   ├── learn/[videoId]/page.tsx
│   ├── onboarding/page.tsx
│   ├── profile/page.tsx
│   ├── teacher/studio/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ai-assistant/YasseAiWidget.tsx
│   ├── dashboard/AdaptiveHeader.tsx
│   ├── dashboard/VideoCard.tsx
│   ├── feedback/FeedbackModal.tsx
│   ├── games/EducationalGamesModal.tsx
│   ├── layout/Footer.tsx
│   ├── layout/MobileBottomNav.tsx
│   ├── layout/Navbar.tsx
│   ├── social/StreakLeaderboardModal.tsx
│   ├── streaks/GitHubStreakHeatmap.tsx
│   ├── streaks/StudySessionTracker.tsx
│   ├── teacher/TeacherUploadModal.tsx
│   └── ui/SecurityCaptcha.tsx
├── lib/
│   ├── db.ts
│   ├── mockData.ts
│   ├── store.ts
│   ├── types.ts
│   └── validations.ts
├── public/
│   ├── manifest.json
│   └── sw.js
├── README.md
└── package.json
```

---

## 🛡️ Production Verification & Build

Verify production build cleanliness locally:

```bash
npx next build
```

Expected Output:
```bash
✓ Compiled successfully
✓ Generating static pages (18/18)
Finalizing page optimization ...
Collecting build traces ...
```

---

## 📬 Contact & Developer Telemetry Target

- **Live Application**: [https://yasse-learn.vercel.app](https://yasse-learn.vercel.app)
- **GitHub Repository**: [https://github.com/yati1818/YASSE-LEARN](https://github.com/yati1818/YASSE-LEARN)
- **Developer & Approver Email Target**: `yatishsathish3012@gmail.com`

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
