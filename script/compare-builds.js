#!/usr/bin/env node

/**
 * Build Output Comparison Script
 *
 * Compares two build output directories and reports differences.
 * Designed with an extensible check-runner pattern so new checks
 * can be added easily.
 *
 * Usage:
 *   node script/compare-builds.js <old-build-dir> <new-build-dir> [--threshold <percent>]
 *
 * Example:
 *   node script/compare-builds.js build/localhost build/localhost-new --threshold 10
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

/**
 * Format a byte count as a human-friendly string with commas.
 */
function formatBytes(n) {
  return n.toLocaleString('en-US');
}

/**
 * Format a percentage with a leading sign.
 */
function formatPct(pct) {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
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
 * For generated/: only compares entry files ({entryName}.entry.*) from the
 * manifest catalog, since webpack and vite name dynamic chunks differently.
 */
async function checkDirectoryListing(oldDir, newDir, _options, entryNames) {
  const name = 'Directory Listing';

  const allOldFiles = getFileListing(oldDir);
  const allNewFiles = getFileListing(newDir);

  const filterToComparable = files => {
    return files.filter(f => {
      if (!f.startsWith('generated/')) return true;
      return isGeneratedEntryFile(f, entryNames);
    });
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
 * Check 2 – Generated File Size Comparison
 *
 * For every entry file ({entryName}.entry.*) present in both builds' generated/
 * directory, compares file sizes and flags any that differ by more than the
 * configured threshold. Only entry files from the manifest catalog are compared,
 * since webpack and vite name dynamic chunks differently.
 * Source-map (.map) files are skipped by default.
 */
async function checkGeneratedFileSizes(oldDir, newDir, options, entryNames) {
  const { threshold } = options;
  const name = `Generated File Sizes (threshold: ${threshold}%)`;

  const oldGenDir = path.join(oldDir, 'generated');
  const newGenDir = path.join(newDir, 'generated');

  // If neither directory has a generated/ folder, skip gracefully.
  const oldExists = fs.existsSync(oldGenDir);
  const newExists = fs.existsSync(newGenDir);
  if (!oldExists && !newExists) {
    return {
      name,
      passed: true,
      details: ['No generated/ directory in either build — skipped'],
    };
  }
  if (!oldExists || !newExists) {
    return {
      name,
      passed: false,
      details: [
        `generated/ directory ${
          oldExists ? 'missing from new' : 'missing from old'
        } build`,
      ],
    };
  }

  const allOldFiles = getFileListing(oldGenDir);
  const allNewFiles = getFileListing(newGenDir);

  const oldFiles = allOldFiles.filter(f => isGeneratedEntryFile(f, entryNames));
  const newFilesSet = new Set(
    allNewFiles.filter(f => isGeneratedEntryFile(f, entryNames)),
  );

  // Only compare files present in both builds; directory-listing check
  // already covers missing/extra files.
  const commonFiles = oldFiles.filter(f => newFilesSet.has(f));

  const flagged = [];

  for (const relPath of commonFiles) {
    // Skip source maps — they fluctuate with content hashes.
    if (relPath.endsWith('.map')) continue;

    const oldSize = fs.statSync(path.join(oldGenDir, relPath)).size;
    const newSize = fs.statSync(path.join(newGenDir, relPath)).size;

    if (oldSize === 0 && newSize === 0) continue;

    const pctChange =
      oldSize === 0 ? 100 : ((newSize - oldSize) / oldSize) * 100;

    if (Math.abs(pctChange) > threshold) {
      flagged.push({ relPath, oldSize, newSize, pctChange });
    }
  }

  // Sort by absolute percentage change, largest first.
  flagged.sort((a, b) => Math.abs(b.pctChange) - Math.abs(a.pctChange));

  const passed = flagged.length === 0;
  const details = [];

  if (passed) {
    details.push(
      `${commonFiles.length} common generated entry files within threshold`,
    );
  } else {
    details.push(`${flagged.length} file(s) over threshold:`);
    // Determine column width for alignment.
    const maxName = Math.max(...flagged.map(f => f.relPath.length));
    for (const { relPath, oldSize, newSize, pctChange } of flagged) {
      const namePad = relPath.padEnd(maxName);
      details.push(
        `  ${namePad}  ${formatBytes(oldSize)} -> ${formatBytes(
          newSize,
        )}  (${formatPct(pctChange)})`,
      );
    }
  }

  return { name, passed, details };
}

// ---------------------------------------------------------------------------
// Check runner
// ---------------------------------------------------------------------------

/**
 * Registry of all checks to run. To add a new check, define an async
 * function with the signature (oldDir, newDir, options, entryNames) => { name, passed, details }
 * and add it to this array.
 */
const checks = [checkDirectoryListing, checkGeneratedFileSizes];

async function runChecks(oldDir, newDir, options) {
  const entryNames = getManifestEntryNames();
  const results = [];

  for (const check of checks) {
    const result = await check(oldDir, newDir, options, entryNames);
    results.push(result);
  }

  return results;
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

const green = text => `\x1b[32m${text}\x1b[0m`;
const red = text => `\x1b[31m${text}\x1b[0m`;

function printResults(results) {
  for (const { name, passed, details } of results) {
    console.log(`\n=== Check: ${name} ===`);
    if (passed) {
      console.log(`${green('PASS')}  ${details.join('  ')}`);
    } else {
      console.log(red('FAIL'));
      details.forEach(line => console.log(`  ${line}`));
    }
  }

  const total = results.length;
  const passedCount = results.filter(r => r.passed).length;
  console.log(`\n=== Summary ===`);
  console.log(`${passedCount} of ${total} checks passed`);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = argv.slice(2); // strip node + script path
  const positional = [];
  const options = { threshold: 5 }; // default threshold

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--threshold') {
      const val = parseFloat(args[++i]);
      if (Number.isNaN(val) || val < 0) {
        console.error('Error: --threshold must be a non-negative number');
        process.exit(1);
      }
      options.threshold = val;
    } else if (args[i].startsWith('-')) {
      console.error(`Unknown flag: ${args[i]}`);
      process.exit(1);
    } else {
      positional.push(args[i]);
    }
  }

  if (positional.length !== 2) {
    console.error(
      'Usage: node script/compare-builds.js <old-build-dir> <new-build-dir> [--threshold <percent>]',
    );
    process.exit(1);
  }

  return { oldDir: positional[0], newDir: positional[1], options };
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

  console.log(`Comparing builds:`);
  console.log(`  Old: ${path.resolve(oldDir)}`);
  console.log(`  New: ${path.resolve(newDir)}`);

  const results = await runChecks(oldDir, newDir, options);
  printResults(results);

  const allPassed = results.every(r => r.passed);
  process.exit(allPassed ? 0 : 1);
}

main();
