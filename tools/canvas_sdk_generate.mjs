#!/usr/bin/env node
/**
 * SDKWork Canvas API contract validation and SDK generation pipeline.
 *
 * Usage:
 *   node tools/canvas_sdk_generate.mjs --check
 *   node tools/canvas_sdk_generate.mjs
 *   node tools/canvas_sdk_generate.mjs --sdk-family sdkwork-canvas-app-sdk --language typescript
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

const API_INPUTS = {
  'open-api': {
    path: 'apis/open-api/canvas/canvas-open-api.openapi.json',
    sdkFamily: 'sdkwork-canvas-sdk',
  },
  'app-api': {
    path: 'apis/app-api/canvas/canvas-app-api.openapi.json',
    sdkFamily: 'sdkwork-canvas-app-sdk',
  },
  'backend-api': {
    path: 'apis/backend-api/canvas/canvas-backend-api.openapi.json',
    sdkFamily: 'sdkwork-canvas-backend-sdk',
  },
};

function parseArgs(argv) {
  const args = {
    check: false,
    language: null,
    sdkFamily: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--check') {
      args.check = true;
      continue;
    }
    if (token === '--language') {
      args.language = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (token === '--sdk-family') {
      args.sdkFamily = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${token}`);
  }

  return args;
}

function validateOpenApiContract(surface, inputPath) {
  const fullPath = resolve(repoRoot, inputPath);
  if (!existsSync(fullPath)) {
    console.error(`[sdkwork-canvas] Missing OpenAPI input for ${surface}: ${inputPath}`);
    return false;
  }

  try {
    const content = JSON.parse(readFileSync(fullPath, 'utf8'));
    if (!content.openapi) {
      console.error(`[sdkwork-canvas] ${inputPath} is not a valid OpenAPI document`);
      return false;
    }
    if (!content.info?.title || !content.info?.version) {
      console.error(`[sdkwork-canvas] ${inputPath} is missing required info.title or info.version`);
      return false;
    }
    if (!content.paths) {
      console.error(`[sdkwork-canvas] ${inputPath} is missing required paths section`);
      return false;
    }
    console.log(`[sdkwork-canvas] OK: ${surface} (${inputPath}) -> ${content.info.title} v${content.info.version}`);
    return true;
  } catch (error) {
    console.error(`[sdkwork-canvas] Failed to parse ${inputPath}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

function validateSdkFamily(surface, config) {
  const familyRoot = resolve(repoRoot, 'sdks', config.sdkFamily);
  if (!existsSync(familyRoot)) {
    console.warn(`[sdkwork-canvas] SDK family directory not yet present: sdks/${config.sdkFamily}`);
    return false;
  }
  const assemblyPath = resolve(familyRoot, '.sdkwork-assembly.json');
  if (!existsSync(assemblyPath)) {
    console.warn(`[sdkwork-canvas] Missing assembly manifest for ${config.sdkFamily}`);
    return false;
  }

  const assembly = JSON.parse(readFileSync(assemblyPath, 'utf8').replace(/^\uFEFF/u, ''));
  const requiredLanguages = ['typescript', 'rust'];
  for (const language of requiredLanguages) {
    const entry = (assembly.languages ?? []).find((item) => item.language === language);
    if (!entry) {
      console.warn(`[sdkwork-canvas] ${config.sdkFamily} missing ${language} language declaration`);
      return false;
    }
    const manifestPath = resolve(familyRoot, entry.manifestPath);
    if (!existsSync(manifestPath)) {
      console.warn(
        `[sdkwork-canvas] Missing generated manifest for ${config.sdkFamily} ${language}: ${entry.manifestPath}`,
      );
      return false;
    }
    if (entry.generationState !== 'generated') {
      console.warn(
        `[sdkwork-canvas] ${config.sdkFamily} ${language} generationState must be generated (found ${entry.generationState})`,
      );
      return false;
    }
  }

  console.log(`[sdkwork-canvas] OK: ${surface} SDK family sdks/${config.sdkFamily}`);
  return true;
}

function runGenerateScript(options) {
  const scriptPath = resolve(repoRoot, 'scripts/generate-canvas-app-sdk.mjs');
  const args = [scriptPath];
  if (options.language) {
    args.push('--language', options.language);
  }
  if (options.sdkFamily) {
    args.push('--sdk-family', options.sdkFamily);
  }

  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    windowsHide: true,
  });
  if (result.status !== 0) {
    throw new Error('Notes SDK generation failed.');
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log('[sdkwork-canvas] Validating OpenAPI contracts...');
  let allValid = true;
  for (const [surface, config] of Object.entries(API_INPUTS)) {
    if (!validateOpenApiContract(surface, config.path)) {
      allValid = false;
    }
  }

  if (!allValid) {
    console.error('[sdkwork-canvas] OpenAPI contract validation failed.');
    process.exit(1);
  }

  let familiesValid = true;
  for (const [surface, config] of Object.entries(API_INPUTS)) {
    if (!validateSdkFamily(surface, config)) {
      familiesValid = false;
    }
  }

  if (args.check) {
    if (!familiesValid) {
      console.error('[sdkwork-canvas] SDK family validation failed.');
      process.exit(1);
    }
    console.log('[sdkwork-canvas] --check complete.');
    return;
  }

  const familiesToGenerate = args.sdkFamily
    ? [args.sdkFamily]
    : ['sdkwork-canvas-app-sdk', 'sdkwork-canvas-backend-sdk', 'sdkwork-canvas-sdk'];

  for (const sdkFamily of familiesToGenerate) {
    console.log(`[sdkwork-canvas] Generating ${sdkFamily}...`);
    runGenerateScript({
      language: args.language,
      sdkFamily,
    });
  }

  console.log('[sdkwork-canvas] SDK generation pipeline complete.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
