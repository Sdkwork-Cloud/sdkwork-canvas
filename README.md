# SDKWork Canvas

repository-kind: application

SDKWork Canvas — AI-native visual workspace for collaborative pages, assets, and Drive-backed media. Multi-tenant, multi-surface (PC browser/desktop), integrated with SDKWork platform frameworks.

## What This Is

A canvas workspace application that lets teams create and manage visual page workspaces. Durable bytes (files, assets, versions) are owned by **sdkwork-drive**; Canvas owns workspace metadata, object model, search, sync, and governance.

## Documentation Canon

- [docs/README.md](docs/README.md) — documentation index
- [docs/product/prd/PRD.md](docs/product/prd/PRD.md) — product requirements
- [docs/architecture/tech/TECH_ARCHITECTURE.md](docs/architecture/tech/TECH_ARCHITECTURE.md) — technical architecture

## Getting Started

```bash
pnpm install
pnpm dev
pnpm build
pnpm verify
```

## Framework Integration

| Framework | Role |
| --- | --- |
| `sdkwork-web-framework` | Mandatory HTTP `*-api` runtime (18-stage interceptor chain) |
| `sdkwork-database` | Database lifecycle, migrations, drift |
| `sdkwork-utils` | `@sdkwork/utils` (TS) and `sdkwork-utils-rust` (Rust) |
| `sdkwork-drive` | All file upload/download (client uploader + server uploader) |
| `sdkwork-appbase` / `sdkwork-iam` | Login, session, application bootstrap |
| `sdkwork-discovery` | **Deferred** until cross-process gRPC services exist (ADR-0002) |

## Verification

```bash
pnpm check
pnpm verify
cargo test --workspace
node ../sdkwork-specs/tools/check-api-response-envelope.mjs --workspace .
node ../sdkwork-specs/tools/check-database-framework-standard.mjs --root .
```
