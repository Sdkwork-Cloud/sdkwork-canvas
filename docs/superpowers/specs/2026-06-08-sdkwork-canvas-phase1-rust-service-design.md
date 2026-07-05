# SDKWork Canvas Phase 1 Rust Service Design

Date: 2026-06-08
Status: Approved implementation checkpoint
Owner: sdkwork-canvas
Related standards:

- `../sdkwork-specs/SOUL.md`
- `../sdkwork-specs/CODE_STYLE_SPEC.md`
- `../sdkwork-specs/NAMING_SPEC.md`
- `../sdkwork-specs/RUST_CODE_SPEC.md`
- `../sdkwork-specs/API_SPEC.md`
- `../sdkwork-specs/WEB_BACKEND_SPEC.md`
- `../sdkwork-specs/DATABASE_SPEC.md`
- `../sdkwork-specs/DRIVE_SPEC.md`
- `../sdkwork-specs/SDK_SPEC.md`
- `../sdkwork-specs/TEST_SPEC.md`

## 1. Goal

Phase 1 turns the Notes contract foundation into a minimal Rust service implementation for Drive-backed pages.

This phase proves three executable facts:

1. Notes can persist workspaces and page metadata.
2. Notes page content operations delegate to an injected Drive content port.
3. Notes stores only stable Drive references and current Drive version pointers.

## 2. Scope

In scope:

- Root Rust workspace for Notes service crates.
- `sdkwork-canvas-pages-service` crate with domain models, service commands, ports, SQL schema, and SQL store.
- `sdkwork-canvas-app-api` crate with an Axum router for the first App API page routes.
- Tests for SQL schema installation, page creation, content update, App API route paths, and forbidden Drive-owned storage terms.

Out of scope:

- No generated SDK transport output.
- No production Drive SDK binding.
- No server binary, release packaging, runtime config, or application manifest.
- No Open API or Backend API runtime implementation.
- No frontend migration.
- No AI worker implementation.

## 3. Architecture

```text
sdkwork-canvas-app-api
  -> HTTP DTO/handler/router boundary
  -> NotesService
  -> NotesRepository + DrivePageContentPort

sdkwork-canvas-pages-service
  -> domain models
  -> service/use case layer
  -> repository port
  -> Drive content port
  -> SQL store
```

Notes does not call Drive App API over raw HTTP. Phase 1 uses `DrivePageContentPort`, an injected Rust trait. Tests use an in-memory fake. A later phase can bind this port to the Drive product Rust component or a generated/approved Drive SDK facade.

The service crate does not store page body bytes. The Drive port returns:

- `drive_space_id`
- `drive_node_id`
- `drive_uri`
- `drive_version_id`
- `drive_version_no`
- `content_type`
- `content_schema_version`
- `content_hash`
- optional snippet and counters

The Notes SQL store persists those references on `canvas_workspace` and `canvas_page`.

## 4. Initial API Runtime

The App API runtime mounts only the first page workflow routes:

```text
POST /app/v3/api/canvas/workspaces
POST /app/v3/api/canvas/workspaces/{workspaceId}/pages
GET  /app/v3/api/canvas/pages/{pageId}
GET  /app/v3/api/canvas/pages/{pageId}/content
PUT  /app/v3/api/canvas/pages/{pageId}/content
```

The route shape matches the existing OpenAPI authority. No route uses `/canvas/canvas`.

Phase 1 handlers use explicit request body context fields (`tenantId`, `organizationId`, `operatorId`) because the shared appbase typed request-context middleware is not yet mounted in this repo root. This is a temporary local/private skeleton boundary, not an auth model. A later runtime composition phase must replace it with the standard AppContext guard before production exposure.

## 5. Database

Phase 1 physical SQL creates only:

- `canvas_workspace`
- `canvas_page`

The schema is SQLite-first and idempotent for local service tests. It mirrors the schema registry columns needed by the first workflows.

Forbidden in Notes SQL and service source:

- Notes-owned revision tables.
- Notes-owned file/object/upload lifecycle tables.
- Provider locator fields.
- Long-lived delivery URLs.

## 6. Error Model

`sdkwork-canvas-pages-service` exposes `NotesProductError` with validation, conflict, not found, permission denied, and internal variants.

`sdkwork-canvas-app-api` maps those errors into RFC 9457-compatible problem detail responses.

## 7. Verification

Required commands from `sdkwork-canvas` root:

```powershell
node --test scripts\verify-canvas-rust-service-skeleton.test.mjs
cargo test -p sdkwork-canvas-pages-service
cargo test -p sdkwork-canvas-app-api
cargo fmt -p sdkwork-canvas-pages-service -p sdkwork-canvas-app-api -- --check
node --test scripts\verify-canvas-contract-foundation.test.mjs
node scripts\verify-canvas-contract-foundation.mjs
```

Acceptance criteria:

- Service tests prove page create and content update persist Drive references and version pointers.
- App API tests prove canonical `/app/v3/api/canvas` page routes work.
- Static scans over `services/` do not find forbidden Notes-owned storage/version ownership.
- Existing contract foundation verification still passes.
