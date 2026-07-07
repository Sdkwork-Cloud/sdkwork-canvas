# Canvas APIs

HTTP contract authorities for SDKWork Canvas.

## Layout

- `app-api/canvas/canvas-app-api.openapi.json` — authenticated app/client surface (`/app/v3/api/canvas/*`)
- `backend-api/canvas/canvas-backend-api.openapi.json` — operator/admin surface (`/backend/v3/api/canvas/*`)
- `open-api/canvas/canvas-open-api.openapi.json` — public/vendor-exempt surface when declared

All operations use `SdkWorkApiResponse` success envelopes and `ProblemDetail` errors per `API_SPEC.md`.

Authority: `../../sdkwork-specs/API_SPEC.md`
