import { describe, expect, it } from 'vitest';
import * as canvasCore from './index';
import * as canvasCoreServices from './services';
import * as canvasCoreStores from './stores';

describe('canvas-core public auth boundary', () => {
  it('does not expose legacy auth service and store APIs once canvas-auth owns auth state', () => {
    expect(Object.keys(canvasCore)).not.toContain('appAuthService');
    expect(Object.keys(canvasCore)).not.toContain('useAuthStore');
    expect(Object.keys(canvasCoreServices)).not.toContain('appAuthService');
    expect(Object.keys(canvasCoreStores)).not.toContain('useAuthStore');
  });
});
