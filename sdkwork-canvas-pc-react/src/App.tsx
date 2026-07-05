import { AppRoot } from '@sdkwork/canvas-pc-shell';
import { appNoteSyncService } from '@sdkwork/canvas-pc-core';

export default function App() {
  return (
    <AppRoot
      canvasWorkspaceBootstrapOptions={{
        apply: (request) => appNoteSyncService.remoteApply(request),
      }}
    />
  );
}
