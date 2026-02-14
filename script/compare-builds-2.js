#!/usr/bin/env node

/**
 * Compare two build folders by their entry JS file sizes.
 *
 * Both folders should be top-level build directories (above the `generated` folder).
 * For each entry from manifest-catalog.json, compares:
 *   - Size in build A
 *   - Size in build B
 *   - Difference (B minus A)
 *   - % change
 *
 * Usage:
 *   node script/compare-builds-2.js <build-dir-a> <build-dir-b>
 *   node script/compare-builds-2.js build/vagovprod-feb-13 build/vagovprod-swc-full
 *   node script/compare-builds-2.js build/vagovprod-feb-13 build/vagovprod-swc-full --csv
 *
 * Options:
 *   --csv  Also print CSV to stdout
 *
 * Writes CSV to build/compare-builds-2-{dirA}-vs-{dirB}.csv
 */

/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

function getEntryNames() {
  const catalogPath = path.join(
    __dirname,
    '../src/applications/manifest-catalog.json',
  );
  if (!fs.existsSync(catalogPath)) {
    return [];
  }
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  return (catalog.applications || []).map(app => app.entryName).filter(Boolean);
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
  }
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function formatMiB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

function formatKiB(bytes) {
  return (bytes / 1024).toFixed(1);
}

function getSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.statSync(filePath).size;
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const positional = [];
  const options = { csv: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--csv') {
      options.csv = true;
    } else if (args[i].startsWith('-')) {
      console.error(`Unknown flag: ${args[i]}`);
      process.exit(1);
    } else {
      positional.push(args[i]);
    }
  }

  if (positional.length !== 2) {
    console.error(
      'Usage: node script/compare-builds-2.js <build-dir-a> <build-dir-b> [--csv]',
    );
    console.error('Example: node script/compare-builds-2.js build/vagovprod-feb-13 build/vagovprod-swc-full');
    process.exit(1);
  }

  return {
    dirA: path.resolve(process.cwd(), positional[0]),
    dirB: path.resolve(process.cwd(), positional[1]),
    options,
  };
}

function main() {
  const { dirA, dirB, options } = parseArgs(process.argv);
  const { csv } = options;

  const generatedA = path.join(dirA, 'generated');
  const generatedB = path.join(dirB, 'generated');

  if (!fs.existsSync(generatedA)) {
    console.error(`Build A generated folder not found: ${generatedA}`);
    process.exit(1);
  }

  if (!fs.existsSync(generatedB)) {
    console.error(`Build B generated folder not found: ${generatedB}`);
    process.exit(1);
  }

  const dirAName = path.basename(dirA);
  const dirBName = path.basename(dirB);
  const csvOutputPath = path.join(
    __dirname,
    '../build',
    `compare-builds-2-${dirAName}-vs-${dirBName}.csv`,
  );

  const entryNames = getEntryNames();
  const rows = [];

  for (const entryName of entryNames) {
    const pathA = path.join(generatedA, `${entryName}.entry.js`);
    const pathB = path.join(generatedB, `${entryName}.entry.js`);

    const sizeA = getSize(pathA);
    const sizeB = getSize(pathB);

    if (sizeA === null && sizeB === null) {
      continue;
    }

    const a = sizeA ?? 0;
    const b = sizeB ?? 0;
    const diff = b - a;
    const pct = a > 0 ? ((diff / a) * 100).toFixed(1) : 'N/A';

    rows.push({
      entryName,
      sizeA: a,
      sizeB: b,
      diff,
      pct,
      hasA: sizeA !== null,
      hasB: sizeB !== null,
    });
  }

  // Sort by percentage difference (lowest to highest)
  rows.sort((a, b) => {
    const pctA =
      a.hasA && a.hasB && a.sizeA > 0 ? parseFloat(a.pct) : Infinity;
    const pctB =
      b.hasA && b.hasB && b.sizeA > 0 ? parseFloat(b.pct) : Infinity;
    return pctA - pctB;
  });

  // Write CSV file (diff = B - A)
  const csvHeader = `Entry,${dirAName} (MiB),${dirBName} (MiB),Diff (KiB),%`;
  const csvLines = rows.map(r => {
    const aVal = r.hasA ? formatMiB(r.sizeA) : '-';
    const bVal = r.hasB ? formatMiB(r.sizeB) : '-';
    const diffVal = r.hasA && r.hasB ? formatKiB(r.diff) : '-';
    const pctVal = r.hasA && r.hasB && r.sizeA > 0 ? `${r.pct}` : '-';
    return `${r.entryName},${aVal},${bVal},${diffVal},${pctVal}`;
  });
  const csvContent = [csvHeader, ...csvLines].join('\n');
  fs.mkdirSync(path.dirname(csvOutputPath), { recursive: true });
  fs.writeFileSync(csvOutputPath, csvContent, 'utf8');

  if (csv) {
    console.log(`CSV written to ${csvOutputPath}`);
    console.log(csvContent);
    return;
  }

  console.log('\n═══════════════════════════════════════════════════════════════════════════════');
  console.log(`Build Comparison: ${dirAName} vs ${dirBName}`);
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('');
  console.log(`  Dir A = ${dirA}`);
  console.log(`  Dir B = ${dirB}`);
  console.log('  Diff = B minus A');
  console.log('');

  const col1 = 'Entry';
  const col2 = dirAName;
  const col3 = dirBName;
  const col4 = 'Diff';
  const col5 = '%';

  const maxNameLen = Math.max(col1.length, ...rows.map(r => r.entryName.length));
  const maxSizeLen = 12;
  const maxDiffLen = 12;

  const pad = (s, n) => String(s).padEnd(n);
  const padNum = (s, n) => String(s).padStart(n);

  console.log(
    `  ${pad(col1, maxNameLen)}  ${padNum(col2, maxSizeLen)}  ${padNum(col3, maxSizeLen)}  ${padNum(col4, maxDiffLen)}  ${col5}`,
  );
  console.log(
    `  ${'-'.repeat(maxNameLen)}  ${'-'.repeat(maxSizeLen)}  ${'-'.repeat(maxSizeLen)}  ${'-'.repeat(maxDiffLen)}  ---`,
  );

  let totalA = 0;
  let totalB = 0;
  let commonCount = 0;

  for (const r of rows) {
    const aStr = r.hasA ? formatBytes(r.sizeA) : '-';
    const bStr = r.hasB ? formatBytes(r.sizeB) : '-';
    const diffStr =
      r.hasA && r.hasB
        ? (r.diff >= 0 ? '+' : '') + formatBytes(r.diff)
        : '-';
    const pctStr =
      r.hasA && r.hasB && r.sizeA > 0
        ? `${r.diff >= 0 ? '+' : ''}${r.pct}%`
        : '-';

    if (r.hasA && r.hasB) {
      totalA += r.sizeA;
      totalB += r.sizeB;
      commonCount++;
    }

    console.log(
      `  ${pad(r.entryName, maxNameLen)}  ${padNum(aStr, maxSizeLen)}  ${padNum(bStr, maxSizeLen)}  ${padNum(diffStr, maxDiffLen)}  ${pctStr}`,
    );
  }

  console.log(
    `  ${'-'.repeat(maxNameLen)}  ${'-'.repeat(maxSizeLen)}  ${'-'.repeat(maxSizeLen)}  ${'-'.repeat(maxDiffLen)}  ---`,
  );
  if (commonCount > 0) {
    const totalDiff = totalB - totalA;
    const totalPct =
      totalA > 0 ? ((totalDiff / totalA) * 100).toFixed(1) : 'N/A';
    console.log(
      `  ${pad(`TOTAL (${commonCount} common entries)`, maxNameLen)}  ${padNum(formatBytes(totalA), maxSizeLen)}  ${padNum(formatBytes(totalB), maxSizeLen)}  ${padNum((totalDiff >= 0 ? '+' : '') + formatBytes(totalDiff), maxDiffLen)}  ${totalDiff >= 0 ? '+' : ''}${totalPct}%`,
    );
  } else {
    console.log(
      `  ${pad('(no common entries to total)', maxNameLen)}  Both builds need matching entries for comparison.`,
    );
  }

  console.log('');
  console.log(`CSV written to ${csvOutputPath}`);
  console.log('');
}

main();
