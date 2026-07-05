import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';
import { applyContractModuleStubs } from './contract-transpile-helpers.mjs';

const workspaceRoot = process.cwd();

function createDataModuleUrl(source) {
  return `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
}

async function loadTsModule(relativePath) {
  const entryPoint = path.resolve(workspaceRoot, relativePath);
  const source = await readFile(entryPoint, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: entryPoint,
  });

  return import(createDataModuleUrl(applyContractModuleStubs(transpiled.outputText)));
}

const canvasLocalSourcePath = 'packages/sdkwork-canvas-pc-local/src/index.ts';
const canvasLocalModule = await loadTsModule(canvasLocalSourcePath);
const canvasLocalSource = await readFile(
  path.resolve(workspaceRoot, canvasLocalSourcePath),
  'utf8',
);

test('canvas local package exports a standardized workspace snapshot reader boundary for downstream consumers', async () => {
  assert.match(canvasLocalSource, /export interface NotesLocalWorkspaceSnapshotReader \{/);
  assert.match(
    canvasLocalSource,
    /readWorkspaceSnapshot\(\): Promise<NotesLocalWorkspaceSnapshot>;/,
  );
  assert.match(
    canvasLocalSource,
    /export const canvasLocalWorkspaceSnapshotReader = createNotesLocalWorkspaceSnapshotReader\(\);/,
  );
  assert.equal(typeof canvasLocalModule.createEmptyNotesLocalWorkspaceSnapshot, 'function');
  assert.equal(typeof canvasLocalModule.resolveNotesLocalWorkspaceSnapshot, 'function');
  assert.equal(typeof canvasLocalModule.createNotesLocalWorkspaceSnapshotReader, 'function');

  const standardizedEmptySnapshot = canvasLocalModule.createEmptyNotesLocalWorkspaceSnapshot();
  assert.deepEqual(standardizedEmptySnapshot, {
    canvas: [],
    folders: [],
    drafts: [],
  });

  const reader = canvasLocalModule.createNotesLocalWorkspaceSnapshotReader({
    async loadWorkspace() {
      return {
        version: canvasLocalModule.canvas_LOCAL_WORKSPACE_SCHEMA_VERSION,
        workspace: {
          canvas: [
            {
              id: 'note-snapshot',
              updatedAt: '2026-04-13T13:00:00.000Z',
              ignored: 'value',
            },
          ],
          folders: [
            {
              id: 'folder-snapshot',
              updatedAt: '2026-04-13T12:55:00.000Z',
            },
          ],
          drafts: [
            {
              noteId: 'note-snapshot',
              capturedAt: '2026-04-13T13:05:00.000Z',
              revision: 9,
              trigger: 'visibility-hidden',
              saveState: 'saving',
              draft: {
                title: 'Snapshot Draft',
                content: '<p>snapshot</p>',
                type: 'code',
                parentId: 'folder-snapshot',
                tags: ['snapshot'],
                isFavorite: true,
                publishStatus: 'draft',
              },
            },
          ],
        },
      };
    },
  });

  assert.deepEqual(Object.keys(reader), ['readWorkspaceSnapshot']);
  assert.deepEqual(await reader.readWorkspaceSnapshot(), {
    canvas: [
      {
        id: 'note-snapshot',
        updatedAt: '2026-04-13T13:00:00.000Z',
      },
    ],
    folders: [
      {
        id: 'folder-snapshot',
        updatedAt: '2026-04-13T12:55:00.000Z',
      },
    ],
    drafts: [
      {
        noteId: 'note-snapshot',
        capturedAt: '2026-04-13T13:05:00.000Z',
        revision: 9,
        trigger: 'visibility-hidden',
        saveState: 'saving',
        draft: {
          title: 'Snapshot Draft',
          content: '<p>snapshot</p>',
          type: 'code',
          parentId: 'folder-snapshot',
          tags: ['snapshot'],
          isFavorite: true,
          publishStatus: 'draft',
        },
      },
    ],
  });
});

test('standardized workspace snapshot reader resolves legacy inputs and degrades unsupported or failed loaders to an empty snapshot', async () => {
  const standardizedEmptySnapshot = canvasLocalModule.createEmptyNotesLocalWorkspaceSnapshot();

  assert.deepEqual(
    canvasLocalModule.resolveNotesLocalWorkspaceSnapshot(
      JSON.stringify({
        canvas: [
          {
            id: 'note-legacy',
            updatedAt: '2026-04-13T14:00:00.000Z',
          },
        ],
        folders: 'invalid',
        drafts: [],
      }),
    ),
    {
      canvas: [
        {
          id: 'note-legacy',
          updatedAt: '2026-04-13T14:00:00.000Z',
        },
      ],
      folders: [],
      drafts: [],
    },
  );

  assert.deepEqual(
    canvasLocalModule.resolveNotesLocalWorkspaceSnapshot({
      version: 99,
      workspace: {
        canvas: [
          {
            id: 'note-unsupported',
            updatedAt: '2026-04-13T14:05:00.000Z',
          },
        ],
      },
    }),
    standardizedEmptySnapshot,
  );

  const failingReader = canvasLocalModule.createNotesLocalWorkspaceSnapshotReader({
    async loadWorkspace() {
      throw new Error('storage unavailable');
    },
  });

  assert.deepEqual(
    await failingReader.readWorkspaceSnapshot(),
    standardizedEmptySnapshot,
  );
});
