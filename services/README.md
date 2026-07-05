# Services

This directory is reserved per the SDKWork root dictionary. Canvas product/service crates live under [../crates/](../crates/) instead:

| Crate | Role |
| --- | --- |
| `sdkwork-canvas-pages-service` | Canvas domain service and Drive content port |
| `sdkwork-canvas-standalone-gateway` | Runnable HTTP gateway binary |

Do not add executable service logic here; use `crates/` per `APPLICATION_SPEC.md`.
