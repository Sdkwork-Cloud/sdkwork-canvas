import { useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthStoreProvider, useAuthStore } from '@sdkwork/canvas-pc-auth';
import { appUserService, useAppStore, type AppUserSettings } from '@sdkwork/canvas-pc-core';
import { bootstrapNotesWorkspaceStore, resetNotesWorkspaceStoreBootstrap } from '@sdkwork/canvas-pc-canvas';
import type { NotesWorkspaceStoreBootstrapOptions } from '@sdkwork/canvas-pc-canvas';
import { LanguageManager } from './LanguageManager';
import { ThemeManager } from './ThemeManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export interface AppProvidersProps {
  children: ReactNode;
  canvasWorkspaceBootstrapOptions?: NotesWorkspaceStoreBootstrapOptions;
}

const AUTHENTICATED_REMOTE_SETTINGS_KEY = '__authenticated__';

const bootstrapState = {
  remoteSettingsHydratedKey: null as string | null,
  remoteSettingsHydrationRunId: 0,
  remoteSettingsHydrationInFlight: null as
    | {
        key: string;
        runId: number;
        promise: Promise<void>;
      }
    | null,
  workspaceStoreBootstrappedKey: null as string | null,
  workspaceStoreBootstrappedOptions: null as NotesWorkspaceStoreBootstrapOptions | null,
};

function resetRemoteSettingsBootstrapState() {
  bootstrapState.remoteSettingsHydratedKey = null;
  bootstrapState.remoteSettingsHydrationRunId += 1;
  bootstrapState.remoteSettingsHydrationInFlight = null;
}

function resetWorkspaceStoreBootstrapState() {
  bootstrapState.workspaceStoreBootstrappedKey = null;
  bootstrapState.workspaceStoreBootstrappedOptions = null;
  resetNotesWorkspaceStoreBootstrap();
}

function ensureRemoteSettingsHydrated(
  key: string,
  hydratePreferences: (preferences: AppUserSettings) => void,
) {
  if (bootstrapState.remoteSettingsHydratedKey === key) {
    return bootstrapState.remoteSettingsHydrationInFlight?.promise ?? Promise.resolve();
  }

  const inFlightHydration = bootstrapState.remoteSettingsHydrationInFlight;
  if (inFlightHydration?.key === key) {
    return inFlightHydration.promise;
  }

  const runId = bootstrapState.remoteSettingsHydrationRunId + 1;
  bootstrapState.remoteSettingsHydrationRunId = runId;

  const hydrationPromise = (async () => {
    try {
      const settings = await appUserService.getCurrentSettings();
      if (bootstrapState.remoteSettingsHydrationRunId !== runId) {
        return;
      }

      hydratePreferences(settings);
      bootstrapState.remoteSettingsHydratedKey = key;
    } catch {
      // Keep the local defaults if the remote settings endpoint is temporarily unavailable.
    } finally {
      if (bootstrapState.remoteSettingsHydrationInFlight?.runId === runId) {
        bootstrapState.remoteSettingsHydrationInFlight = null;
      }
    }
  })();

  bootstrapState.remoteSettingsHydrationInFlight = {
    key,
    runId,
    promise: hydrationPromise,
  };

  return hydrationPromise;
}

export function __resetAppProvidersBootstrapStateForTests() {
  resetRemoteSettingsBootstrapState();
  resetWorkspaceStoreBootstrapState();
}

function ensureNotesWorkspaceStoreBootstrapped(
  key: string,
  canvasWorkspaceBootstrapOptions: NotesWorkspaceStoreBootstrapOptions | undefined,
) {
  if (
    bootstrapState.workspaceStoreBootstrappedKey === key
    && bootstrapState.workspaceStoreBootstrappedOptions === (canvasWorkspaceBootstrapOptions ?? null)
  ) {
    return;
  }

  bootstrapNotesWorkspaceStore(canvasWorkspaceBootstrapOptions ?? {});
  bootstrapState.workspaceStoreBootstrappedKey = key;
  bootstrapState.workspaceStoreBootstrappedOptions = canvasWorkspaceBootstrapOptions ?? null;
}

function AppProvidersContent({ children, canvasWorkspaceBootstrapOptions }: AppProvidersProps) {
  const themeMode = useAppStore((state) => state.themeMode);
  const hydratePreferences = useAppStore((state) => state.hydratePreferences);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSessionReady = useAuthStore((state) => state.isSessionReady);
  const authenticatedUserEmail = useAuthStore((state) => state.user?.email ?? null);
  const workspaceStoreBootstrapKey = isAuthenticated
    ? authenticatedUserEmail?.trim().toLowerCase() || AUTHENTICATED_REMOTE_SETTINGS_KEY
    : null;
  const remoteSettingsHydrationKey = workspaceStoreBootstrapKey;

  useEffect(() => {
    if (!isSessionReady) {
      return;
    }

    if (!workspaceStoreBootstrapKey) {
      resetWorkspaceStoreBootstrapState();
      return;
    }

    ensureNotesWorkspaceStoreBootstrapped(
      workspaceStoreBootstrapKey,
      canvasWorkspaceBootstrapOptions,
    );
  }, [isSessionReady, canvasWorkspaceBootstrapOptions, workspaceStoreBootstrapKey]);

  useEffect(() => {
    if (!isSessionReady) {
      return;
    }

    if (!remoteSettingsHydrationKey) {
      resetRemoteSettingsBootstrapState();
      return;
    }

    void ensureRemoteSettingsHydrated(remoteSettingsHydrationKey, hydratePreferences);
  }, [hydratePreferences, isSessionReady, remoteSettingsHydrationKey]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeManager />
      <LanguageManager />
      <Router>
        {children}
        <Toaster
          position="bottom-right"
          richColors
          theme={themeMode === 'system' ? 'system' : themeMode === 'dark' ? 'dark' : 'light'}
        />
      </Router>
    </QueryClientProvider>
  );
}

export function AppProviders({ children, canvasWorkspaceBootstrapOptions }: AppProvidersProps) {
  return (
    <AuthStoreProvider>
      <AppProvidersContent canvasWorkspaceBootstrapOptions={canvasWorkspaceBootstrapOptions}>
        {children}
      </AppProvidersContent>
    </AuthStoreProvider>
  );
}
