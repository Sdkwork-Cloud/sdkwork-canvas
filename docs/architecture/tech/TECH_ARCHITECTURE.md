# SDKWork Canvas Technical Architecture

Status: active
Owner: canvas-platform
Application: canvas
Updated: 2026-07-06
Specs: ARCHITECTURE_DECISION_SPEC.md, WEB_FRAMEWORK_SPEC.md, DATABASE_FRAMEWORK_SPEC.md

## Architecture Overview

SDKWork Canvas is a Rust + TypeScript application repository. HTTP ingress runs through `sdkwork-api-canvas-standalone-gateway` with mandatory `sdkwork-web-framework` integration. Domain logic lives in `sdkwork-canvas-pages-service`; persistence uses `sdkwork-database` lifecycle assets under `database/` (`moduleId: canvas`).

## Technology Choices

| Layer | Choice |
| --- | --- |
| HTTP runtime | `sdkwork-web-framework` + Axum route crates |
| Persistence | PostgreSQL (primary) / SQLite (dev), SQLx repositories |
| File bytes | `sdkwork-drive` (client SDK + server uploader) |
| PC UI | React 19 + Vite under `apps/sdkwork-canvas-pc` |
| Shared utilities | `@sdkwork/utils`, `sdkwork-utils-rust` |
| Discovery/RPC | Deferred (ADR-20260706-canvas-framework-integration) |

## System Context

```text
PC React -> @sdkwork/canvas-app-sdk -> standalone-gateway
  -> web-framework -> routes-canvas-* -> pages-service -> database
  -> drive-uploader (server-side bytes)
```

## Module Boundaries

- **Route crates** — HTTP adapters only; no business rules
- **pages-service** — domain use cases
- **pages-repository-sqlx** — SQL access, store-level pagination
- **gateway-assembly** — composes route mounts for gateway binary

## API Surfaces

- App-api: `apis/app-api/canvas/canvas-app-api.openapi.json`
- Backend-api: `apis/backend-api/canvas/canvas-backend-api.openapi.json`

## Security And Operations

IAM dual-token auth, `ProblemDetail` errors, health probes via framework infra routes, deployment profiles in `deployments/deploy.yaml`.

## Related

- [PRD.md](../../product/prd/PRD.md)
- [ADR-20260706-canvas-drive-integration.md](../decisions/ADR-20260706-canvas-drive-integration.md)
