#!/usr/bin/env node
/**
 * Rename sdkwork-canvas-pc-react internal packages to APP_PC_ARCHITECTURE_SPEC naming:
 * sdkwork-canvas-<capability> -> sdkwork-canvas-pc-<capability>
 * @sdkwork/canvas-<capability> -> @sdkwork/canvas-pc-<capability>
 */
import { readdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const PC_ROOT = path.join(REPO_ROOT, 'sdkwork-canvas-pc-react');
const PACKAGES_DIR = path.join(PC_ROOT, 'packages');

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function renamePackageDirectories() {
  const entries = await readdir(PACKAGES_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (!entry.name.startsWith('sdkwork-canvas-')) continue;
    if (entry.name.startsWith('sdkwork-canvas-pc-')) continue;
    const suffix = entry.name.slice('sdkwork-canvas-'.length);
    const nextName = `sdkwork-canvas-pc-${suffix}`;
    const from = path.join(PACKAGES_DIR, entry.name);
    const to = path.join(PACKAGES_DIR, nextName);
    if (!(await exists(to))) {
      await rename(from, to);
      console.log(`renamed ${entry.name} -> ${nextName}`);
    }
  }
}

async function walkFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'target') continue;
    if (entry.isDirectory()) {
      files.push(...await walkFiles(full));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

const PACKAGE_SUFFIXES = [
  'auth',
  'commons',
  'core',
  'desktop',
  'i18n',
  'local',
  'canvas',
  'observability',
  'search',
  'shell',
  'sync',
  'types',
  'updater',
  'user',
];

function rewriteContent(content) {
  let next = content;
  next = next.replaceAll('packages/sdkwork-canvas-', 'packages/sdkwork-canvas-pc-');
  next = next.replace(/@sdkwork\/canvas-(?!pc-)/g, '@sdkwork/canvas-pc-');
  for (const suffix of PACKAGE_SUFFIXES) {
    const legacy = `sdkwork-canvas-${suffix}`;
    const standard = `sdkwork-canvas-pc-${suffix}`;
    next = next.replaceAll(`'${legacy}'`, `'${standard}'`);
    next = next.replaceAll(`"${legacy}"`, `"${standard}"`);
    next = next.replaceAll(`../${legacy}`, `../${standard}`);
    next = next.replaceAll(`${legacy}/`, `${standard}/`);
    next = next.replaceAll(`${legacy}\\`, `${standard}\\`);
  }
  next = next.replaceAll('sdkwork-canvas-pc-pc-react', 'sdkwork-canvas-pc-react');
  next = next.replaceAll('@sdkwork/canvas-pc-pc-react', '@sdkwork/canvas-pc-react');
  return next;
}

async function rewriteWorkspaceFiles() {
  const roots = [PC_ROOT, REPO_ROOT];
  for (const root of roots) {
    const files = await walkFiles(root);
    const allowed = /\.(json|jsonc|md|mjs|ts|tsx|toml|yaml|yml)$/;
    for (const file of files) {
      if (!allowed.test(file)) continue;
      if (file.includes(`${path.sep}docs${path.sep}`)) continue;
      if (file.includes(`${path.sep}node_modules${path.sep}`)) continue;
      const original = await readFile(file, 'utf8');
      const updated = rewriteContent(original);
      if (updated !== original) {
        await writeFile(file, updated, 'utf8');
      }
    }
  }
}

await renamePackageDirectories();
await rewriteWorkspaceFiles();
console.log('PC package rename complete.');
