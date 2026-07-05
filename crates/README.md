# crates/

Rust HTTP route crates, auth layer, API server, and SQLx repositories for SDKWork Canvas.

| Crate | Role |
| --- | --- |
| `sdkwork-routes-canvas-app-api` | App API routes (`/app/v3/api/canvas/...`) |
| `sdkwork-routes-canvas-backend-api` | Backend/admin API routes |
| `sdkwork-routes-canvas-http-auth` | HTTP auth helpers and web-framework layer wiring |
| `sdkwork-canvas-standalone-gateway` | Runnable API server binary |
| `sdkwork-canvas-pages-repository-sqlx` | SQLx repository for Notes-owned tables |

Product/business logic lives in [../services/](../services/).
