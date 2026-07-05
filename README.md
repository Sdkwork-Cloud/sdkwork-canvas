# sdkwork-canvas

repository-kind: application

SDKWork Canvas is a collaborative visual canvas and page workspace application. It delivers a PC browser/desktop experience through `sdkwork-canvas-pc-react`, a Rust HTTP backend with `sdkwork-web-framework`, relational persistence through `sdkwork-database`, and file lifecycle through `sdkwork-drive`.

## Architecture

| Layer | Technology | Standard |
| --- | --- | --- |
| HTTP API | Rust route crates + standalone gateway | `WEB_FRAMEWORK_SPEC.md` |
| Persistence | PostgreSQL via `sdkwork-database` | `DATABASE_FRAMEWORK_SPEC.md` |
| File upload | `@sdkwork/drive-app-sdk` / Drive uploader service | `DRIVE_SPEC.md` |
| Frontend | PC React packages under `sdkwork-canvas-pc-react` | `APP_PC_ARCHITECTURE_SPEC.md` |
| SDK | `@sdkwork/canvas-app-sdk` composed facade | `SDK_SPEC.md` |
| Discovery / RPC | Deferred until cross-process gRPC is required | `DISCOVERY_SPEC.md` |

## Repository layout

- `apis/` — OpenAPI authorities (`canvas-app-api`, `canvas-backend-api`, `canvas-open-api`)
- `apps/` — application root index (`apps/README.md`)
- `crates/` — Rust gateway, routes, services, repositories
- `database/` — contract, migrations, seeds
- `deployments/` — `deploy.yaml` profiles
- `sdks/` — SDK families and generated transports
- `sdkwork-canvas-pc-react/` — primary PC React + optional Tauri surface
- `specs/` — `component.spec.json`, `topology.spec.json`
- `scripts/` — dev orchestration and architecture verifiers
- `docs/` — product and technical documentation

## Development

```bash
pnpm install
pnpm dev
pnpm check
pnpm verify
```

Database lifecycle:

```bash
pnpm db:validate
pnpm db:bootstrap
```

API and SDK:

```bash
pnpm api:check
pnpm sdk:generate
```

## Documentation

- [docs/README.md](docs/README.md)
- [docs/product/prd/PRD.md](docs/product/prd/PRD.md)
- [docs/architecture/tech/TECH_ARCHITECTURE.md](docs/architecture/tech/TECH_ARCHITECTURE.md)

## Standards

All work follows `../sdkwork-specs/README.md`. Agent entrypoint: [AGENTS.md](AGENTS.md).
