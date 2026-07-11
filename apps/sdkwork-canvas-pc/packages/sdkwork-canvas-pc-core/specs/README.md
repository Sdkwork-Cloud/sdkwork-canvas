# SDKWork Canvas PC Core Specs

This directory is the component-local spec system for `@sdkwork/sdkwork-canvas-pc-core`.

## Files

- `component.spec.json`: machine-readable core package contract, SDK dependency inventory, permission composition, public exports, and verification commands.
- `README.md`: human index only. Normative rules remain in `../../../../../../sdkwork-specs/*_SPEC.md`.

## Authority

The core package is the Canvas PC app composition boundary. It declares the application-owned Canvas app SDK, appbase IAM app SDK, and Drive app SDK dependencies by reference.

Feature packages consume Canvas capability through core public exports and must not import generated transport packages, dependency-private source paths, or manual auth/header utilities directly.
