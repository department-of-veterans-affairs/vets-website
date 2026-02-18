#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

/**
 * Script to compare bundle sizes between two build output directories.
 *
 * Collects sizes for generated entry files present in both builds,
 * computes the difference, and outputs comparison data to CSV.
 *
 * Usage:
 *   node script/compare-bundle-sizes.js <old-build-dir> <new-build-dir>
 *
 * Example:
 *   node script/compare-bundle-sizes.js build/localhost build/localhost-new
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

function collectComparisonData(oldDir, newDir, entryNames) {
  const oldGenDir = path.join(oldDir, 'generated');
  const newGenDir = path.join(newDir, 'generated');

  const oldExists = fs.existsSync(oldGenDir);
  const newExists = fs.existsSync(newGenDir);

  if (!oldExists || !newExists) {
    return null;
  }

  const allOldFiles = getFileListing(oldGenDir);
  const allNewFiles = getFileListing(newGenDir);

  const oldFiles = allOldFiles.filter(f => isGeneratedEntryFile(f, entryNames));
  const newFilesSet = new Set(
    allNewFiles.filter(f => isGeneratedEntryFile(f, entryNames)),
  );

  const commonFiles = oldFiles.filter(f => newFilesSet.has(f));
  const comparisons = [];

  for (const relPath of commonFiles) {
    if (relPath.endsWith('.map')) continue;

    const oldSize = fs.statSync(path.join(oldGenDir, relPath)).size;
    const newSize = fs.statSync(path.join(newGenDir, relPath)).size;

    const pctChange =
      oldSize === 0 ? (newSize === 0 ? 0 : 100) : ((newSize - oldSize) / oldSize) * 100;

    comparisons.push({
      filename: relPath,
      oldSize,
      newSize,
      sizeDiff: newSize - oldSize,
      pctChange,
    });
  }

  comparisons.sort((a, b) => Math.abs(b.pctChange) - Math.abs(a.pctChange));

  return comparisons;
}

function formatBytes(n) {
  return n.toLocaleString('en-US');
}

function pad(str, width) {
  return String(str).padEnd(width);
}

function generateMarkdownTable(comparisons) {
  const rows = comparisons.map(row => {
    const escapedName = row.filename.replace(/\|/g, '&#124;');
    const pctStr =
      row.pctChange >= 0 ? `+${row.pctChange.toFixed(1)}%` : `${row.pctChange.toFixed(1)}%`;
    const diffStr =
      row.sizeDiff >= 0 ? `+${formatBytes(row.sizeDiff)}` : formatBytes(row.sizeDiff);
    return {
      filename: escapedName,
      oldSize: formatBytes(row.oldSize),
      newSize: formatBytes(row.newSize),
      diff: diffStr,
      pct: pctStr,
    };
  });

  const colWidths = {
    filename: Math.max(8, ...rows.map(r => r.filename.length)),
    oldSize: Math.max(8, ...rows.map(r => r.oldSize.length)),
    newSize: Math.max(8, ...rows.map(r => r.newSize.length)),
    diff: Math.max(4, ...rows.map(r => r.diff.length)),
    pct: Math.max(8, ...rows.map(r => r.pct.length)),
  };

  const sep = w => '-'.repeat(w + 2);
  const header = [
    `| ${pad('Filename', colWidths.filename)} | ${pad('Old Size', colWidths.oldSize)} | ${pad('New Size', colWidths.newSize)} | ${pad('Diff', colWidths.diff)} | ${pad('% Change', colWidths.pct)} |`,
    `|${sep(colWidths.filename)}|${sep(colWidths.oldSize)}|${sep(colWidths.newSize)}|${sep(colWidths.diff)}|${sep(colWidths.pct)}|`,
  ];

  const body = rows.map(
    r =>
      `| ${pad(r.filename, colWidths.filename)} | ${pad(r.oldSize, colWidths.oldSize)} | ${pad(r.newSize, colWidths.newSize)} | ${pad(r.diff, colWidths.diff)} | ${pad(r.pct, colWidths.pct)} |`,
  );

  return [...header, ...body].join('\n');
}

function generateCSV(comparisons) {
  const lines = ['Filename,Old Size (bytes),New Size (bytes),Size Diff,% Change'];

  for (const row of comparisons) {
    const escapedName = row.filename.includes(',')
      ? `"${row.filename.replace(/"/g, '""')}"`
      : row.filename;
    const pctStr =
      row.pctChange >= 0 ? `+${row.pctChange.toFixed(1)}` : row.pctChange.toFixed(1);
    lines.push(
      `${escapedName},${row.oldSize},${row.newSize},${row.sizeDiff},${pctStr}%`,
    );
  }

  return lines.join('\n');
}

function main() {
  const oldDir = process.argv[2];
  const newDir = process.argv[3];

  if (!oldDir || !newDir) {
    console.error(
      'Usage: node script/compare-bundle-sizes.js <old-build-dir> <new-build-dir>',
    );
    process.exit(1);
  }

  const oldDirResolved = path.resolve(process.cwd(), oldDir);
  const newDirResolved = path.resolve(process.cwd(), newDir);

  for (const [label, dir] of [
    ['Old', oldDirResolved],
    ['New', newDirResolved],
  ]) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      console.error(`Error: ${label} build directory does not exist: ${dir}`);
      process.exit(1);
    }
  }

  console.log(`Comparing bundle sizes:`);
  console.log(`  Old: ${oldDirResolved}`);
  console.log(`  New: ${newDirResolved}`);

  const entryNames = getManifestEntryNames();
  const comparisons = collectComparisonData(
    oldDirResolved,
    newDirResolved,
    entryNames,
  );

  if (comparisons === null) {
    console.error('Error: generated/ directory missing from one or both builds');
    process.exit(1);
  }

  if (comparisons.length === 0) {
    console.log('\nNo common entry files to compare.');
    process.exit(0);
  }

  console.log('\nBundle Size Comparison:');
  console.log(generateMarkdownTable(comparisons));

  const csv = generateCSV(comparisons);
  const outputFile = path.join(process.cwd(), 'bundle-size-comparison.csv');
  fs.writeFileSync(outputFile, csv, 'utf8');
  console.log(`\nCSV saved to: ${outputFile}`);
  console.log(`Total compared: ${comparisons.length}`);
}

if (require.main === module) {
  main();
}
