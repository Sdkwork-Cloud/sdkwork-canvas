import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const workspaceRoot = path.resolve(import.meta.dirname, '../../../../../');

function read(relativePath: string) {
  return fs.readFileSync(path.resolve(workspaceRoot, relativePath), 'utf8');
}

describe('desktop layout contracts', () => {
  it('hosts shared auth pages inside the canvas shell without recreating local full-screen wrappers', () => {
    const authPageSource = read('packages/sdkwork-canvas-pc-auth/src/pages/AuthPage.tsx');
    const oauthCallbackPageSource = read('packages/sdkwork-canvas-pc-auth/src/pages/AuthOAuthCallbackPage.tsx');

    expect(authPageSource).toMatch(/data-canvas-iam-screen="auth"/);
    expect(authPageSource).toMatch(/<SdkworkAuthPage/);
    expect(authPageSource).not.toMatch(/min-h-screen/);
    expect(oauthCallbackPageSource).toMatch(/data-canvas-iam-screen="auth"/);
    expect(oauthCallbackPageSource).toMatch(/<SdkworkAuthOAuthCallbackPage/);
    expect(oauthCallbackPageSource).not.toMatch(/min-h-screen/);
  });

  it('keeps workspace and account pages bound to the shell height model used by claw-studio', () => {
    const canvasWorkspaceSource = read('packages/sdkwork-canvas-pc-canvas/src/pages/NotesWorkspacePage.tsx');
    const accountPageSource = read('packages/sdkwork-canvas-pc-user/src/AccountPage.tsx');

    expect(canvasWorkspaceSource).toMatch(
      /className="flex h-full min-h-0 flex-col overflow-hidden bg-transparent text-\[var\(--text-primary\)\]"/,
    );
    expect(canvasWorkspaceSource).not.toMatch(/min-h-screen/);
    expect(accountPageSource).toMatch(/className="h-full overflow-y-auto scrollbar-hide"/);
  });

  it('ships the claw-style scrollbar utilities needed by the desktop shell', () => {
    const shellStylesSource = read('packages/sdkwork-canvas-pc-shell/src/styles/index.css');

    expect(shellStylesSource).toMatch(/scrollbar-width:\s*thin/);
    expect(shellStylesSource).toMatch(/\.scrollbar-hide/);
  });
});
