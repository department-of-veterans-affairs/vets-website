#!/usr/bin/env node

/**
 * Build Output Comparison Script
 *
 * Compares two build output directories and reports differences.
 * Designed with an extensible check-runner pattern so new checks
 * can be added easily.
 *
 * Usage:
 *   node script/compare-builds.js <old-build-dir> <new-build-dir>
 *
 * Example:
 *   node script/compare-builds.js build/localhost build/localhost-new
 */

/* eslint-disable no-console, no-continue, no-await-in-loop, no-plusplus */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Load entry names from manifest-catalog.json. Used to filter generated/
 * comparisons to only app entry files (webpack and vite name dynamic chunks
 * differently, but entry files are consistent).
 */
function getManifestEntryNames() {
  const manifestPath = path.join(
    __dirname,
    '../src/applications/manifest-catalog.json',
  );
  if (!fs.existsSync(manifestPath)) {
    return [];
  }
  const catalog = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return (catalog.applications || []).map(app => app.entryName).filter(Boolean);
}

/**
 * Returns true if a relative path under generated/ matches the {entryName}.entry.*
 * pattern for any entry name from the manifest catalog. When entryNames is empty
 * (e.g. manifest not found), matches any *.entry.* filename as fallback.
 */
function isGeneratedEntryFile(relPath, entryNames) {
  const basename = path.basename(relPath);
  if (!basename.includes('.entry.')) return false;
  if (entryNames.length === 0) return true; // fallback when manifest unavailable
  return entryNames.some(name => basename.startsWith(`${name}.entry.`));
}

/**
 * Recursively collect all relative file paths under `dir`.
 * Returns a sorted array of POSIX-style relative paths (files only).
 */
function getFileListing(dir) {
  const entries = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter(entry => entry.isFile())
    .map(entry => {
      // entry.parentPath is the absolute directory containing the entry (Node 20.12+)
      // entry.path is the same in older Node 18 builds. Handle both.
      const parent = entry.parentPath || entry.path;
      return path.relative(dir, path.join(parent, entry.name));
    })
    .map(p => p.split(path.sep).join('/')) // normalise to POSIX separators
    .sort();
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

/**
 * Check 1 – Directory Listing Diff
 *
 * Recursively lists every file in both directories and reports files that
 * are missing from one side or the other.
 *
 * Files under generated/ are ignored entirely, since webpack and vite name
 * dynamic chunks differently.
 */
async function checkDirectoryListing(oldDir, newDir, _options, _entryNames) {
  const name = 'Directory Listing';

  const allOldFiles = getFileListing(oldDir);
  const allNewFiles = getFileListing(newDir);

  const filterToComparable = files => {
    return files.filter(f => !f.startsWith('generated/'));
  };

  const oldFiles = new Set(filterToComparable(allOldFiles));
  const newFiles = new Set(filterToComparable(allNewFiles));

  const missingFromNew = [...oldFiles].filter(f => !newFiles.has(f)).sort();
  const extraInNew = [...newFiles].filter(f => !oldFiles.has(f)).sort();

  const passed = missingFromNew.length === 0 && extraInNew.length === 0;

  const details = [];
  if (passed) {
    details.push(`${oldFiles.size} files match`);
  } else {
    if (missingFromNew.length > 0) {
      details.push(`Missing from new build (${missingFromNew.length}):`);
      missingFromNew.forEach(f => details.push(`  ${f}`));
    }
    if (extraInNew.length > 0) {
      details.push(`Extra in new build (${extraInNew.length}):`);
      extraInNew.forEach(f => details.push(`  ${f}`));
    }
  }

  return { name, passed, details };
}

/**
 * Check 2 – Generated Entry Files by Extension
 *
 * For each file extension detected in the old generated/ directory (among
 * entry files), outputs a separate PASS/FAIL ensuring there is a
 * corresponding entry file in both old and new for that extension.
 */
async function checkGeneratedEntryFilesByExtension(
  oldDir,
  newDir,
  _options,
  entryNames,
) {
  const oldGenDir = path.join(oldDir, 'generated');
  const newGenDir = path.join(newDir, 'generated');

  const oldExists = fs.existsSync(oldGenDir);
  const newExists = fs.existsSync(newGenDir);
  if (!oldExists && !newExists) {
    return [
      {
        name: 'Generated Entry Files (no generated/ in either build)',
        passed: true,
        details: ['Skipped — no generated/ directory'],
      },
    ];
  }
  if (!oldExists || !newExists) {
    return [
      {
        name: 'Generated Entry Files',
        passed: false,
        details: [
          `generated/ directory ${
            oldExists ? 'missing from new' : 'missing from old'
          } build`,
        ],
      },
    ];
  }

  const allOldFiles = getFileListing(oldGenDir);
  const allNewFiles = getFileListing(newGenDir);

  const oldEntryFiles = allOldFiles.filter(f =>
    isGeneratedEntryFile(f, entryNames),
  );
  const newEntryFilesSet = new Set(
    allNewFiles.filter(f => isGeneratedEntryFile(f, entryNames)),
  );

  // Group old entry files by extension
  const byExtension = new Map();
  for (const f of oldEntryFiles) {
    const ext = path.extname(f) || '(no ext)';
    if (!byExtension.has(ext)) {
      byExtension.set(ext, []);
    }
    byExtension.get(ext).push(f);
  }

  const results = [];
  for (const [ext, oldPaths] of byExtension) {
    const name = `Generated Entry Files (.${
      ext === '(no ext)' ? 'no ext' : ext.slice(1)
    })`;
    const newPathsWithExt = [...newEntryFilesSet].filter(
      f => (path.extname(f) || '(no ext)') === ext,
    );
    const newPathsSet = new Set(newPathsWithExt);

    const missingFromNew = oldPaths.filter(p => !newPathsSet.has(p)).sort();
    const extraInNew = newPathsWithExt
      .filter(p => !oldPaths.includes(p))
      .sort();

    const passed = missingFromNew.length === 0 && extraInNew.length === 0;
    const details = [];
    if (passed) {
      details.push(
        `${oldPaths.length} entry file(s) match in both old and new`,
      );
    } else {
      if (missingFromNew.length > 0) {
        details.push(`Missing from new build (${missingFromNew.length}):`);
        missingFromNew.forEach(f => details.push(`  ${f}`));
      }
      if (extraInNew.length > 0) {
        details.push(`Extra in new build (${extraInNew.length}):`);
        extraInNew.forEach(f => details.push(`  ${f}`));
      }
    }
    results.push({ name, passed, details });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Check runner
// ---------------------------------------------------------------------------

/**
 * Registry of all checks to run. To add a new check, define an async
 * function with the signature (oldDir, newDir, options, entryNames) => { name, passed, details }
 * or => [{ name, passed, details }, ...] for checks that return multiple results.
 */
const checks = [checkDirectoryListing, checkGeneratedEntryFilesByExtension];

async function runChecks(oldDir, newDir, options) {
  const entryNames = getManifestEntryNames();
  const results = [];

  for (const check of checks) {
    const result = await check(oldDir, newDir, options, entryNames);
    const items = Array.isArray(result) ? result : [result];
    results.push(...items);
  }

  return results;
}

// ---------------------------------------------------------------------------
// Reporting (Jest-style)
// ---------------------------------------------------------------------------

const green = text => `\x1b[32m${text}\x1b[0m`;
const red = text => `\x1b[31m${text}\x1b[0m`;
const dim = text => `\x1b[2m${text}\x1b[0m`;

function printResults(results, oldDir, newDir, elapsedMs) {
  const allPassed = results.every(r => r.passed);
  const status = allPassed ? green('PASS') : red('FAIL');
  const comparisonLabel = `${path.resolve(oldDir)} vs ${path.resolve(newDir)}`;

  console.log(`\n ${status}  ${comparisonLabel}`);
  console.log('  Build Comparison');

  for (const { name, passed, details } of results) {
    const checkmark = passed ? green('✓') : red('✕');
    const firstDetail = details[0] || '';
    if (passed) {
      console.log(`    ${checkmark} ${name} ${dim(`(${firstDetail})`)}`);
    } else {
      console.log(`    ${checkmark} ${name}`);
      details.forEach(line => console.log(`      ${line}`));
    }
  }

  const total = results.length;
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = total - passedCount;
  const elapsedSec = (elapsedMs / 1000).toFixed(3);

  console.log('');
  if (failedCount > 0) {
    console.log(
      `Test Suites: ${red(`${failedCount} failed`)}, ${dim('1 total')}`,
    );
    console.log(
      `Tests:       ${red(`${failedCount} failed`)}, ${green(
        `${passedCount} passed`,
      )}, ${dim(`${total} total`)}`,
    );
  } else {
    console.log(`Test Suites: ${green('1 passed')}, 1 total`);
    console.log(
      `Tests:       ${green(`${passedCount} passed`)}, ${total} total`,
    );
  }
  console.log(`Time:        ${elapsedSec} s`);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = argv.slice(2); // strip node + script path
  const positional = [];

  for (let i = 0; i < args.length; i += 1) {
    if (args[i].startsWith('-')) {
      console.error(`Unknown flag: ${args[i]}`);
      process.exit(1);
    } else {
      positional.push(args[i]);
    }
  }

  if (positional.length !== 2) {
    console.error(
      'Usage: node script/compare-builds.js <old-build-dir> <new-build-dir>',
    );
    process.exit(1);
  }

  return { oldDir: positional[0], newDir: positional[1], options: {} };
}

async function main() {
  const { oldDir, newDir, options } = parseArgs(process.argv);

  // Validate directories exist.
  for (const [label, dir] of [['Old', oldDir], ['New', newDir]]) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      console.error(`Error: ${label} build directory does not exist: ${dir}`);
      process.exit(1);
    }
  }

  const startTime = Date.now();

  console.log(`Comparing builds:`);
  console.log(`  Old: ${path.resolve(oldDir)}`);
  console.log(`  New: ${path.resolve(newDir)}`);

  const results = await runChecks(oldDir, newDir, options);
  const elapsedMs = Date.now() - startTime;
  printResults(results, oldDir, newDir, elapsedMs);

  const allPassed = results.every(r => r.passed);
  process.exit(allPassed ? 0 : 1);
}

main();
