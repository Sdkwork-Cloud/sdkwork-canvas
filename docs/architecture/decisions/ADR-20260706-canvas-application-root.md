# ADR-20260706: Canvas Application Root Architecture

| Field | Value |
| --- | --- |
| Status | Accepted |
| Date | 2026-07-06 |
| Title | Canvas Application Root Architecture |

## Context

SDKWork Canvas is a greenfield application for AI-native visual workspaces. It must align with `sdkwork-specs` from day one.

## Decision

- Application code: `canvas`
- Repository kind: `application`
- Primary client: `apps/sdkwork-canvas-pc` (PC React)
- Backend: Rust route crates + `sdkwork-api-canvas-standalone-gateway`
- APIs under `apis/app-api/canvas/` and `apis/backend-api/canvas/`
- No repository-root `packages/`

## Consequences

- Predictable workspace layout per `SDKWORK_WORKSPACE_SPEC.md`
- Shared patterns with `sdkwork-notes` / `sdkwork-settings` for framework wiring
- Canvas-specific domain lives in `sdkwork-canvas-pages-*` crates
