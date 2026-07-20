# Services

Runnable Rust service processes for the `sdkwork-canvas` repository.

Authority: `../sdkwork-specs/RUST_CODE_SPEC.md`.

## Active Services

- `sdkwork-canvas-api-server/`: HTTP API server process (`sdkwork-<application-code>-api-server`).
- `sdkwork-api-canvas-standalone-gateway/`: standalone application gateway (`sdkwork-<application-code>-standalone-gateway`).

## Rules

- Runnable HTTP servers use `sdkwork-<application-code>-api-server`.
- Standalone application gateways use `sdkwork-<application-code>-standalone-gateway`.
- Cloud application gateways use `sdkwork-<application-code>-cloud-gateway` (when cloud profile is supported).
