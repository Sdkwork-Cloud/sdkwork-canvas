# SDKWORK Notes Appbase Auth Direct Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Notes auth to direct `sdkwork-appbase` PC React auth components, controller, and service contracts.

**Architecture:** `@sdkwork/canvas-auth` becomes a thin bridge around `@sdkwork/auth-pc-react`, while `@sdkwork/canvas-shell` and `@sdkwork/canvas-user` consume auth state from the Notes auth provider instead of the old core-local store. Shared auth pages own the primary workflow UI; Notes owns route wiring and host theme alignment.

**Tech Stack:** React 19, TypeScript, Vitest, React Router, `@sdkwork/auth-pc-react`, `@sdkwork/ui-pc-react`, generated `@sdkwork/app-sdk`.

---

### Task 1: Lock The New Auth Boundary

**Files:**
- Create: `<workspace-root>\sdkwork-canvas\docs\superpowers\specs\2026-04-05-sdkwork-canvas-appbase-auth-direct-integration-design.md`
- Create: `<workspace-root>\sdkwork-canvas\docs\superpowers\plans\2026-04-05-sdkwork-canvas-appbase-auth-direct-integration.md`

- [ ] **Step 1: Record the approved direct-integration architecture**
- [ ] **Step 2: Use the document as the implementation checklist**

### Task 2: Write The Failing Auth Integration Contracts

**Files:**
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\pages\AuthPage.test.tsx`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\pages\AuthOAuthCallbackPage.test.tsx`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-shell\src\application\router\AppRoutes.test.tsx`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-shell\src\application\providers\AppProviders.test.tsx`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-shell\src\application\layouts\ThemeConsistency.contract.test.ts`

- [ ] **Step 1: Assert that Notes auth pages wrap shared appbase auth pages**
- [ ] **Step 2: Assert that shell routes move to `/auth/*`**
- [ ] **Step 3: Assert that shell providers consume auth from `@sdkwork/canvas-auth`**
- [ ] **Step 4: Run the targeted tests and confirm they fail for the expected boundary reasons**

### Task 3: Build The Notes Auth Bridge

**Files:**
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\package.json`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\index.ts`
- Create: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\services\sdkworkAuthBridge.ts`
- Create: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\store\authStore.tsx`
- Create: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\store\index.ts`
- Create: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\theme\SdkworkIamThemeProvider.tsx`
- Create: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\theme\index.ts`

- [ ] **Step 1: Add direct dependencies on shared auth and UI packages**
- [ ] **Step 2: Bind the Notes app SDK client into `createSdkworkAuthService`**
- [ ] **Step 3: Expose a single Notes auth controller/provider pair**
- [ ] **Step 4: Sync the shared SDKWORK UI theme with the Notes host light/dark mode**

### Task 4: Replace Local Auth Screens With Shared Wrappers

**Files:**
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\pages\AuthPage.tsx`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\pages\AuthOAuthCallbackPage.tsx`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\pages\Auth.tsx`
- Create: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-auth\src\authMessages.ts`

- [ ] **Step 1: Replace the local auth page implementation with a themed `SdkworkAuthPage` wrapper**
- [ ] **Step 2: Replace the local OAuth callback implementation with a themed `SdkworkAuthOAuthCallbackPage` wrapper**
- [ ] **Step 3: Centralize Notes runtime config and message overrides for the shared pages**

### Task 5: Rewire Shell And Account Consumers

**Files:**
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-shell\package.json`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-user\package.json`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-shell\src\application\providers\AppProviders.tsx`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-shell\src\application\router\AppRoutes.tsx`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-shell\src\application\layouts\MainLayout.tsx`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-shell\src\application\layouts\AppHeader.tsx`
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-user\src\AccountPage.tsx`

- [ ] **Step 1: Wrap the app shell in the Notes auth provider**
- [ ] **Step 2: Switch route guards and session bootstrap to controller-backed auth state**
- [ ] **Step 3: Move header and account pages off `canvas-core` auth selectors**
- [ ] **Step 4: Normalize route redirects around `/auth/login`**

### Task 6: Tune Theme Contracts And Verify

**Files:**
- Modify: `<workspace-root>\sdkwork-canvas\sdkwork-canvas-pc-react\packages\sdkwork-canvas-shell\src\styles\index.css`

- [ ] **Step 1: Add Notes host auth CSS tuning for shared SDKWORK controls**
- [ ] **Step 2: Run targeted auth and shell tests**
  Run: `pnpm --filter @sdkwork/canvas-auth test`
  Expected: PASS
- [ ] **Step 3: Run targeted shell and user tests**
  Run: `pnpm --filter @sdkwork/canvas-shell test`
  Expected: PASS
- [ ] **Step 4: Run workspace typecheck**
  Run: `pnpm typecheck`
  Expected: PASS
