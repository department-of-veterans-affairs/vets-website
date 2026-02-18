#!/usr/bin/env node

/**
 * Bundle Size Comparison Script
 *
 * Compares generated entry file sizes between two build output directories.
 * Flags files that differ by more than the configured threshold.
 *
 * Usage:
 *   node script/compare-bundle-sizes.js <old-build-dir> <new-build-dir> [--threshold <percent>]
 *
 * Example:
 *   node script/compare-bundle-sizes.js build/localhost build/localhost-new --threshold 10
 */

/* eslint-disable no-console, no-continue */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

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

function isGeneratedEntryFile(relPath, entryNames) {
  const basename = path.basename(relPath);
  if (!basename.includes('.entry.')) return false;
  if (entryNames.length === 0) return true;
  return entryNames.some(name => basename.startsWith(`${name}.entry.`));
}

function getFileListing(dir) {
  const entries = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter(entry => entry.isFile())
    .map(entry => {
      const parent = entry.parentPath || entry.path;
      return path.relative(dir, path.join(parent, entry.name));
    })
    .map(p => p.split(path.sep).join('/'))
    .sort();
}

function formatBytes(n) {
  return n.toLocaleString('en-US');
}

function formatPct(pct) {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

function compareBundleSizes(oldDir, newDir, threshold, entryNames) {
  const oldGenDir = path.join(oldDir, 'generated');
  const newGenDir = path.join(newDir, 'generated');

  const oldExists = fs.existsSync(oldGenDir);
  const newExists = fs.existsSync(newGenDir);

  if (!oldExists && !newExists) {
    return { skipped: true, reason: 'No generated/ directory in either build' };
  }
  if (!oldExists || !newExists) {
    return {
      skipped: false,
      error: `generated/ directory ${
        oldExists ? 'missing from new' : 'missing from old'
      } build`,
    };
  }

  const allOldFiles = getFileListing(oldGenDir);
  const allNewFiles = getFileListing(newGenDir);

  const oldFiles = allOldFiles.filter(f => isGeneratedEntryFile(f, entryNames));
  const newFilesSet = new Set(
    allNewFiles.filter(f => isGeneratedEntryFile(f, entryNames)),
  );

  const commonFiles = oldFiles.filter(f => newFilesSet.has(f));
  const flagged = [];

  for (const relPath of commonFiles) {
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

  flagged.sort((a, b) => Math.abs(b.pctChange) - Math.abs(a.pctChange));

  return { skipped: false, commonFiles, flagged };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = argv.slice(2);
  const positional = [];
  let threshold = 5;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--threshold') {
      const val = parseFloat(args[++i]);
      if (Number.isNaN(val) || val < 0) {
        console.error('Error: --threshold must be a non-negative number');
        process.exit(1);
      }
      threshold = val;
    } else if (args[i].startsWith('-')) {
      console.error(`Unknown flag: ${args[i]}`);
      process.exit(1);
    } else {
      positional.push(args[i]);
    }
  }

  if (positional.length !== 2) {
    console.error(
      'Usage: node script/compare-bundle-sizes.js <old-build-dir> <new-build-dir> [--threshold <percent>]',
    );
    process.exit(1);
  }

  return { oldDir: positional[0], newDir: positional[1], threshold };
}

function main() {
  const { oldDir, newDir, threshold } = parseArgs(process.argv);

  for (const [label, dir] of [['Old', oldDir], ['New', newDir]]) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      console.error(`Error: ${label} build directory does not exist: ${dir}`);
      process.exit(1);
    }
  }

  console.log(`Comparing bundle sizes (threshold: ${threshold}%):`);
  console.log(`  Old: ${path.resolve(oldDir)}`);
  console.log(`  New: ${path.resolve(newDir)}`);

  const entryNames = getManifestEntryNames();
  const result = compareBundleSizes(oldDir, newDir, threshold, entryNames);

  if (result.skipped) {
    console.log(`\n${result.reason} — skipped`);
    process.exit(0);
  }

  if (result.error) {
    console.error(`\nError: ${result.error}`);
    process.exit(1);
  }

  const { commonFiles, flagged } = result;

  if (flagged.length === 0) {
    console.log(
      `\n${commonFiles.length} common generated entry files within threshold`,
    );
    process.exit(0);
  }

  console.log(`\n${flagged.length} file(s) over threshold:`);
  const maxName = Math.max(...flagged.map(f => f.relPath.length));
  for (const { relPath, oldSize, newSize, pctChange } of flagged) {
    const namePad = relPath.padEnd(maxName);
    console.log(
      `  ${namePad}  ${formatBytes(oldSize)} -> ${formatBytes(newSize)}  (${formatPct(pctChange)})`,
    );
  }
  process.exit(1);
}

main();
