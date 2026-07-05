import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';

const authStoreState = {
  isAuthenticated: false,
  isSessionReady: true,
};

vi.mock('@sdkwork/canvas-pc-i18n', () => ({
  ensureI18n: vi.fn(async () => undefined),
  useNotesTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en-US',
      changeLanguage: vi.fn(async () => undefined),
    },
  }),
}));

vi.mock('@sdkwork/canvas-pc-auth', () => ({
  useAuthStore: <T,>(selector: (state: typeof authStoreState) => T) => selector(authStoreState),
  AuthPage: () => <div>Mock Auth Page</div>,
  AuthOAuthCallbackPage: () => <div>Mock OAuth Callback Page</div>,
}));

vi.mock('@sdkwork/canvas-pc-core', () => ({
  useAuthStore: () => {
    throw new Error('AppRoutes should read auth state from @sdkwork/canvas-pc-auth.');
  },
}));

vi.mock('@sdkwork/canvas-pc-canvas', () => ({
  NotesWorkspacePage: () => <div>Mock Notes Workspace</div>,
}));

vi.mock('@sdkwork/canvas-pc-user', () => ({
  AccountPage: () => <div>Mock Account Page</div>,
}));

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location-probe">{`${location.pathname}${location.search}`}</div>;
}

function renderRoutes(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppRoutes />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe('AppRoutes', () => {
  beforeEach(() => {
    localStorage.clear();
    authStoreState.isAuthenticated = false;
    authStoreState.isSessionReady = true;
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    authStoreState.isAuthenticated = false;
    authStoreState.isSessionReady = true;
  });

  it('renders shared auth routes immediately instead of routing them through a lazy suspense boundary', () => {
    renderRoutes('/auth/login');

    expect(screen.getByText('Mock Auth Page')).toBeInTheDocument();
    expect(screen.queryByText('common.loading')).not.toBeInTheDocument();
  });

  it('keeps showing the loading fallback while auth session restoration is still in flight', () => {
    authStoreState.isAuthenticated = false;
    authStoreState.isSessionReady = false;

    renderRoutes('/canvas');

    expect(screen.getByText('common.loading')).toBeInTheDocument();
    expect(screen.getByTestId('location-probe')).toHaveTextContent('/canvas');
  });

  it('redirects unauthenticated canvas routes to login and preserves redirect target', async () => {
    renderRoutes('/canvas?view=favorites');

    await screen.findByText('Mock Auth Page');

    await waitFor(() => {
      expect(screen.getByTestId('location-probe')).toHaveTextContent(
        '/auth/login?redirect=%2Fcanvas%3Fview%3Dfavorites',
      );
    });
  });

  it('redirects the index route to canvas for authenticated users', async () => {
    authStoreState.isAuthenticated = true;

    renderRoutes('/');

    await screen.findByText('Mock Notes Workspace');

    await waitFor(() => {
      expect(screen.getByTestId('location-probe')).toHaveTextContent('/canvas');
    });
  });

  it('redirects authenticated login requests back to the canvas workspace', async () => {
    authStoreState.isAuthenticated = true;

    renderRoutes('/auth/login');

    await screen.findByText('Mock Notes Workspace');

    await waitFor(() => {
      expect(screen.getByTestId('location-probe')).toHaveTextContent('/canvas');
    });
  });
});
