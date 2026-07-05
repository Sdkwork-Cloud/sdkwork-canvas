# tests/

Cross-cutting verification entry for SDKWork Canvas.

Backend and route crate tests live next to their crates. Frontend contract tests live under `sdkwork-canvas-pc-react/scripts/`. Root verification commands:

```powershell
pnpm verify
node --test scripts/verify-canvas-standard-architecture.test.mjs
node --test scripts/verify-canvas-rust-service-skeleton.test.mjs
node --test scripts/verify-canvas-contract-foundation.test.mjs
```
