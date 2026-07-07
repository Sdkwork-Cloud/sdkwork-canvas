# SDKWork Canvas PRD

Status: active
Owner: canvas-platform
Application: canvas
Updated: 2026-07-06
Specs: REQUIREMENTS_SPEC.md, DOCUMENTATION_SPEC.md

## Document Map

- [TECH_ARCHITECTURE.md](../../architecture/tech/TECH_ARCHITECTURE.md)
- [ADR-20260706-canvas-application-root.md](../../architecture/decisions/ADR-20260706-canvas-application-root.md)

## 1. Background And Problem

Teams need a collaborative visual workspace where page content is Drive-backed, metadata is tenant-scoped, and APIs follow SDKWork platform contracts.

## 2. Target Users

- Knowledge workers creating visual boards and pages
- Tenant administrators governing workspaces
- SDKWork application integrators consuming `@sdkwork/canvas-app-sdk`

## 3. Goals And Non-Goals

**Goals:** workspaces, boards, Drive-backed content, AI suggestions, search, IAM auth, standard API envelopes.

**Non-Goals (Phase 1):** RPC/discovery, non-PC clients, direct object storage.

## 4. Scope

PC React client + Rust HTTP backend + PostgreSQL/SQLite via `sdkwork-database`.

## 5. User Scenarios

- List/create workspaces and boards
- Upload assets via Drive uploader
- Search and sync page metadata

## 6. Success Metrics

- `pnpm verify` green; API envelope checks pass; database L2+ compliance

## 7. Phases

1. Framework-aligned scaffold (current)
2. Production IAM bootstrap + commercial packaging
3. Optional RPC when split services require it

## 8. Linked Requirements

- REQ: multi-tenant isolation, Drive-only uploads, pagination at store level

## 9. Open Questions

- Desktop Tauri host timing vs browser-first launch
