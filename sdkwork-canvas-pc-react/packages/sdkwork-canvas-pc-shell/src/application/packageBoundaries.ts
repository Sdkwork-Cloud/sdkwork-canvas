export const SHELL_DOMAIN_PACKAGES = [
  '@sdkwork/canvas-pc-auth',
  '@sdkwork/canvas-pc-canvas',
  '@sdkwork/canvas-pc-user',
] as const;

export const SHELL_FOUNDATION_PACKAGES = [
  '@sdkwork/canvas-pc-core',
  '@sdkwork/canvas-pc-commons',
  '@sdkwork/canvas-pc-i18n',
  '@sdkwork/canvas-pc-types',
] as const;

export const FUTURE_CAPABILITY_PACKAGES = [
  '@sdkwork/canvas-pc-local',
  '@sdkwork/canvas-pc-search',
  '@sdkwork/canvas-pc-sync',
  '@sdkwork/canvas-pc-observability',
  '@sdkwork/canvas-pc-updater',
] as const;

export const PLATFORM_SHELL_PACKAGES = [
  '@sdkwork/canvas-pc-shell',
  '@sdkwork/canvas-pc-desktop',
] as const;

export const APP_PROVIDER_BOUNDARY = {
  authStore: '@sdkwork/canvas-pc-auth',
  appState: '@sdkwork/canvas-pc-core',
  themeManager: '@sdkwork/canvas-pc-shell',
  languageManager: '@sdkwork/canvas-pc-shell',
  router: '@sdkwork/canvas-pc-shell',
} as const;
