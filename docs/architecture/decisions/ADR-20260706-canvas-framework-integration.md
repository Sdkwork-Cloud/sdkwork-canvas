# ADR-20260706: Canvas Framework Integration

| Field | Value |
| --- | --- |
| Status | Accepted |
| Date | 2026-07-06 |
| Title | Canvas Framework Integration |

## Context

Canvas exposes HTTP app-api and backend-api surfaces and persists workspace metadata.

## Decision

Integrate platform frameworks mandatorily:

| Framework | Phase 1 |
| --- | --- |
| `sdkwork-web-framework` | Yes — all HTTP routes |
| `sdkwork-database` | Yes — `database/` + lifecycle |
| `sdkwork-utils` | Yes — TS + Rust shared helpers |
| `sdkwork-drive` | Yes — all file bytes |
| `sdkwork-discovery` / RPC | **No** — deferred until cross-process gRPC |

## Consequences

- No local HTTP interceptor forks
- No direct S3/OSS clients in Canvas
- RPC adoption requires new ADR + `check-rpc-framework-standard.mjs`
