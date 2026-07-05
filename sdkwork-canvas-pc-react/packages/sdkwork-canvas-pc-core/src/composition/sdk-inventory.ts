export function listSdkworkCoreSdkInventory() {
  return [
    {
      workspace: "@sdkwork-internal/canvas-app-sdk-generated",
      surface: "app-api",
      credentialMode: "authenticated-app-api",
    },
    {
      workspace: "@sdkwork/iam-app-sdk",
      surface: "app-api",
      credentialMode: "authenticated-app-api",
    },
    {
      workspace: "@sdkwork/drive-app-sdk",
      surface: "app-api",
      credentialMode: "authenticated-app-api",
    },
  ] as const;
}
