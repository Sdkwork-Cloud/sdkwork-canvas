# ADR-20260706: Canvas Drive File Upload Integration

| Field | Value |
| --- | --- |
| Status | Accepted |
| Date | 2026-07-06 |
| Title | Canvas Drive File Upload Integration |

## Context

Canvas pages, assets, and exports require durable file storage. Platform rule: all uploads go through **sdkwork-drive**.

## Decision

- **Client**: `@sdkwork/drive-app-sdk` → `client.uploader.*`, space type `app_upload`
- **Server**: `sdkwork_drive_uploader_service` for generated/imported bytes
- **Canvas tables**: store `drive_space_id`, `drive_node_id`, `drive_uri` only — never bucket keys or provider credentials
- **Media**: `MediaResource` snapshots per `MEDIA_RESOURCE_SPEC.md`

## Consequences

- High cohesion in Drive; Canvas stays low-coupled to storage providers
- Upload quotas, audit, and statistics centralized in Drive
