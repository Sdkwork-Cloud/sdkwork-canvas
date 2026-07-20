# Canvas Rust Crates

| Crate | Role |
| --- | --- |
| `sdkwork-canvas-pages-service` | Domain services (workspaces, pages, assets) |
| `sdkwork-canvas-pages-repository-sqlx` | SQLx repositories |
| `sdkwork-canvas-database-host` | Database lifecycle SPI host |
| `sdkwork-routes-canvas-app-api` | App-api HTTP routes |
| `sdkwork-routes-canvas-backend-api` | Backend-api HTTP routes |
| `sdkwork-routes-canvas-http-auth` | Auth/credential-entry routes |
| `sdkwork-api-canvas-assembly` | Gateway route assembly |
| `sdkwork-api-canvas-standalone-gateway` | Standalone gateway binary |

All HTTP routes mount through `sdkwork-web-framework`.
