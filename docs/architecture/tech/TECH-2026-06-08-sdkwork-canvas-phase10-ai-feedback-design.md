> Migrated from `docs/superpowers/specs/2026-06-08-sdkwork-canvas-phase10-ai-feedback-design.md` on 2026-06-24.
> Owner: SDKWork maintainers

## Scope

Phase 10 adds an AI suggestion feedback ledger to close the first product-quality loop around reviewable AI suggestions.

Implemented resources:

- App API: `POST /app/v3/api/canvas/ai_suggestions/{aiSuggestionId}/feedback`
- Backend API: `GET /backend/v3/api/canvas/ai_suggestions/{aiSuggestionId}/feedback`
- Product ledger table: `canvas_ai_feedback`

## Design

Feedback belongs to Notes because it is AI governance metadata, not file content. The feedback row records tenant, organization, workspace, AI job, optional suggestion, feedback type, optional text, creator, and creation time.

The service first resolves the AI suggestion in the caller context, derives `workspace_id` and `job_id` from that suggestion, validates the feedback type, trims the optional feedback text, and stores a deterministic feedback id so the same actor can replay the same feedback payload safely.

Allowed feedback types are:

```text
accepted
rejected
edited
helpful
not_helpful
```

## Boundaries

This phase does not read or write Drive content, create Drive versions, create Notes-owned revisions, call a model provider, export training data, mutate suggestion status, or add upload/object/storage lifecycle tables.

The core resource remains `Page`. The implementation must not introduce `/canvas/canvas`, `canvas_note`, `canvas_note_revision`, `canvas_revision`, or `client.canvas.canvas.*`.

## Data Model

`canvas_ai_feedback` is an append-style ledger table owned by `sdkwork-canvas-pages-service`.

Required columns:

- `id`
- `tenant_id`
- `organization_id`
- `workspace_id`
- `job_id`
- `suggestion_id`
- `feedback_type`
- `feedback_text`
- `created_by`
- `created_at`

Indexes:

- `ix_canvas_ai_feedback_suggestion`
- `ix_canvas_ai_feedback_job`

## Verification

Required narrow checks:

```powershell
cargo test -p sdkwork-canvas-pages-service ai_suggestion_feedback_is_recorded_for_quality_loop
cargo test -p sdkwork-canvas-pages-service invalid_ai_suggestion_feedback_type_is_rejected
cargo test -p sdkwork-routes-canvas-app-api app_api_routes_create_ai_suggestion_feedback
cargo test -p sdkwork-routes-canvas-backend-api backend_api_routes_list_ai_suggestion_feedback
```

Required aggregate checks:

```powershell
cargo test -p sdkwork-canvas-pages-service
cargo test -p sdkwork-routes-canvas-app-api
cargo test -p sdkwork-routes-canvas-backend-api
node --test scripts\verify-canvas-rust-service-skeleton.test.mjs
node --test scripts\verify-canvas-contract-foundation.test.mjs
node scripts\verify-canvas-contract-foundation.mjs
cargo test --workspace
```

