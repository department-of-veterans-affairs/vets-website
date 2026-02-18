#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

/**
 * Script to collect JavaScript bundle sizes and save them to a CSV file.
 *
 * Reads from manifest-catalog.json to get application bundles,
 * collects sizes for global bundles (polyfills, vendor, web-components),
 * and outputs all bundle sizes to a CSV file.
 *
 * Usage:
 *   node script/collect-bundle-sizes.js [bundle-directory]
 *
 * Default bundle directory: build/vagovprod/generated/
 */

const GLOBAL_BUNDLES = [
  { name: 'Polyfills', filename: 'polyfills.entry.js' },
  { name: 'Vendor', filename: 'vendor.entry.js' },
  { name: 'Web Components', filename: 'web-components.entry.js' },
];

function getBundleSize(bundlePath) {
  try {
    if (!fs.existsSync(bundlePath)) {
      return null;
    }
    const stats = fs.statSync(bundlePath);
    // Convert bytes to kilobytes
    return (stats.size / 1024).toFixed(2);
  } catch (error) {
    console.error(`Error reading ${bundlePath}:`, error.message);
    return null;
  }
}

function isMockApplication(app) {
  const directoryPath = app.directoryPath || '';
  // Check if directory path contains mock indicators
  // Examples: "_mock-form", "mock-sip-form", "/mock-form", etc.
  const pathLower = directoryPath.toLowerCase();
  return (
    pathLower.includes('_mock') ||
    pathLower.includes('/mock') ||
    pathLower.includes('mock-')
  );
}

function collectBundleSizes(bundleDir) {
  const manifestCatalogPath = path.join(
    process.cwd(),
    'src',
    'applications',
    'manifest-catalog.json',
  );

  if (!fs.existsSync(manifestCatalogPath)) {
    console.error(
      `Error: Manifest catalog not found at ${manifestCatalogPath}`,
    );
    process.exit(1);
  }

  if (!fs.existsSync(bundleDir)) {
    console.error(`Error: Bundle directory does not exist: ${bundleDir}`);
    process.exit(1);
  }

  const manifestCatalog = JSON.parse(
    fs.readFileSync(manifestCatalogPath, 'utf8'),
  );

  const bundles = [];

  // Collect global bundles
  for (const globalBundle of GLOBAL_BUNDLES) {
    const bundlePath = path.join(bundleDir, globalBundle.filename);
    const size = getBundleSize(bundlePath);
    if (size !== null) {
      bundles.push({
        name: globalBundle.name,
        filename: globalBundle.filename,
        size: parseFloat(size),
      });
    } else {
      console.warn(`Warning: ${globalBundle.filename} not found`);
    }
  }

  // Collect application bundles (excluding mock applications)
  const applications = manifestCatalog.applications || [];
  const appBundles = [];

  for (const app of applications) {
    if (isMockApplication(app)) {
      continue;
    }

    const entryName = app.entryName;
    if (!entryName) {
      console.warn(
        `Warning: Application ${app.directoryPath} has no entryName`,
      );
      continue;
    }

    const bundleFilename = `${entryName}.entry.js`;
    const bundlePath = path.join(bundleDir, bundleFilename);
    const size = getBundleSize(bundlePath);

    if (size !== null) {
      appBundles.push({
        name: app.appName || entryName,
        filename: bundleFilename,
        size: parseFloat(size),
      });
    } else {
      console.warn(`Warning: ${bundleFilename} not found`);
    }
  }

  // Sort global bundles alphabetically by name
  bundles.sort((a, b) => a.name.localeCompare(b.name));

  // Sort app bundles alphabetically by name
  appBundles.sort((a, b) => a.name.localeCompare(b.name));

  // Combine: global bundles first, then app bundles
  return [...bundles, ...appBundles];
}

function generateCSV(bundles) {
  const lines = ['Bundle Name,File Name,Size (KB)'];

  for (const bundle of bundles) {
    // Escape commas and quotes in bundle names
    const escapedName = bundle.name.includes(',')
      ? `"${bundle.name.replace(/"/g, '""')}"`
      : bundle.name;
    lines.push(`${escapedName},${bundle.filename},${bundle.size}`);
  }

  return lines.join('\n');
}

function main() {
  // Get bundle directory from command line args or use default
  const bundleDirArg =
    process.argv[2] || 'build/vagovprod/generated/';
  const bundleDir = path.resolve(process.cwd(), bundleDirArg);

  console.log(`Collecting bundle sizes from: ${bundleDir}`);

  const bundles = collectBundleSizes(bundleDir);

  if (bundles.length === 0) {
    console.error('Error: No bundles found');
    process.exit(1);
  }

  const csv = generateCSV(bundles);

  // Output CSV to stdout
  console.log('\nBundle Sizes:');
  console.log(csv);

  // Optionally save to file
  const outputFile = path.join(process.cwd(), 'bundle-sizes.csv');
  fs.writeFileSync(outputFile, csv, 'utf8');
  console.log(`\nCSV saved to: ${outputFile}`);
  console.log(`Total bundles: ${bundles.length}`);
}

if (require.main === module) {
  main();
}
