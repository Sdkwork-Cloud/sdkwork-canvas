# apis/

Author-owned HTTP API contracts for SDKWork Canvas.

This directory holds reviewable OpenAPI authorities and validation inputs. Generated SDK transport output remains under `sdks/`.

| Surface | Authority file |
| --- | --- |
| app-api | [app-api/canvas/canvas-app-api.openapi.json](app-api/canvas/canvas-app-api.openapi.json) |
| backend-api | [backend-api/canvas/canvas-backend-api.openapi.json](backend-api/canvas/canvas-backend-api.openapi.json) |
| open-api | [open-api/canvas/canvas-open-api.openapi.json](open-api/canvas/canvas-open-api.openapi.json) |

Route manifests live under `sdks/_route-manifests/`. Every operation declares `WebRequestContext` and the matching `*-api` surface per `sdkwork-specs/WEB_FRAMEWORK_SPEC.md`.
