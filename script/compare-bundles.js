#!/usr/bin/env node

/**
 * Helper script to compare two webpack bundles and identify differences
 * Specifically looks for platform/site-wide modules and their dependencies
 */

const fs = require('fs');
const path = require('path');

const [isolatedPath, multiPath] = process.argv.slice(2);

if (!isolatedPath || !multiPath) {
  console.error('Usage: node compare-bundles.js <isolated-bundle-path> <multi-entry-bundle-path>');
  process.exit(1);
}

if (!fs.existsSync(isolatedPath) || !fs.existsSync(multiPath)) {
  console.error('Error: One or both bundle files not found');
  process.exit(1);
}

console.log('🔍 Comparing bundles...\n');

const isolatedContent = fs.readFileSync(isolatedPath, 'utf8');
const multiContent = fs.readFileSync(multiPath, 'utf8');

// Extract module references using regex patterns
// Focus on webpack module IDs and actual import paths, not minified code
function extractModules(content) {
  const modules = new Set();
  
  // Match webpack module ID patterns (e.g., "./src/platform/...")
  // These appear in webpack's module registry
  const webpackModulePattern = /\.\/src\/(platform\/[^"'\s\)]+)/g;
  
  // Match require/import paths that look like actual module paths
  // Filter out very long strings (likely minified code)
  const requirePattern = /(?:require|import)\(["']([^"']{1,200}platform\/[^"']{1,200})["']\)/g;
  
  // Match from imports
  const fromPattern = /from\s+["']([^"']{1,200}platform\/[^"']{1,200})["']/g;
  
  // Extract webpack module IDs
  let match;
  while ((match = webpackModulePattern.exec(content)) !== null) {
    if (match[1] && match[1].startsWith('platform/')) {
      // Validate it looks like a real module path
      if (match[1].length < 500 && !match[1].includes('method') && !match[1].includes('throw')) {
        modules.add(match[1]);
      }
    }
  }
  
  // Extract require/import paths
  [requirePattern, fromPattern].forEach(pattern => {
    while ((match = pattern.exec(content)) !== null) {
      if (match[1] && match[1].includes('platform/')) {
        // Filter out minified code - real module paths are reasonable length
        // and don't contain minified variable names
        const modulePath = match[1];
        if (
          modulePath.length < 200 &&
          !modulePath.includes('method') &&
          !modulePath.includes('throw') &&
          !modulePath.includes('return') &&
          !modulePath.includes('iterator') &&
          !modulePath.includes('arg===') &&
          modulePath.match(/^platform\/[a-zA-Z0-9\/\-_\.]+/)
        ) {
          modules.add(modulePath);
        }
      }
    }
  });
  
  return Array.from(modules).sort();
}

const isolatedModules = extractModules(isolatedContent);
const multiModules = extractModules(multiContent);

const onlyInMulti = multiModules.filter(m => !isolatedModules.includes(m));
const onlyInIsolated = isolatedModules.filter(m => !multiModules.includes(m));

console.log('📊 Module Count:');
console.log(`  Isolated: ${isolatedModules.length} unique platform modules`);
console.log(`  Multi-entry: ${multiModules.length} unique platform modules`);
console.log(`  Difference: ${multiModules.length - isolatedModules.length}\n`);

// Filter out false positives (minified code that slipped through)
function isValidModulePath(path) {
  return (
    path &&
    path.length < 200 &&
    path.startsWith('platform/') &&
    !path.includes('method') &&
    !path.includes('throw') &&
    !path.includes('iterator') &&
    !path.includes('arg===') &&
    !path.includes('return') &&
    !path.includes('TypeError') &&
    path.match(/^platform\/[a-zA-Z0-9\/\-_\.]+(\.jsx?)?$/)
  );
}

const validOnlyInMulti = onlyInMulti.filter(isValidModulePath);
const validOnlyInIsolated = onlyInIsolated.filter(isValidModulePath);

if (validOnlyInMulti.length > 0) {
  console.log(`🔴 Modules ONLY in multi-entry build (${validOnlyInMulti.length}):`);
  validOnlyInMulti.forEach(module => {
    console.log(`  - ${module}`);
  });
  console.log('');
} else if (onlyInMulti.length > 0) {
  console.log(`⚠️  Found ${onlyInMulti.length} potential modules in multi-entry, but they appear to be minified code artifacts\n`);
}

if (validOnlyInIsolated.length > 0) {
  console.log(`🟢 Modules ONLY in isolated build (${validOnlyInIsolated.length}):`);
  validOnlyInIsolated.forEach(module => {
    console.log(`  - ${module}`);
  });
  console.log('');
}

// Focus on site-wide modules (filtered for valid paths)
const allValidModules = [...isolatedModules, ...multiModules].filter(isValidModulePath);
const siteWideModules = allValidModules.filter(m => 
  m.includes('site-wide') || m.includes('monitoring')
);

if (siteWideModules.length > 0) {
  console.log(`🎯 Site-wide and monitoring modules found (${siteWideModules.length}):`);
  siteWideModules.forEach(module => {
    const inIsolated = isolatedModules.includes(module);
    const inMulti = multiModules.includes(module);
    const marker = inIsolated && inMulti ? '✓' : inMulti ? '🔴' : '🟢';
    console.log(`  ${marker} ${module}`);
  });
  console.log('');
}

// Count occurrences of key patterns in module paths (not minified code)
// Look for webpack module IDs specifically
const keyPatterns = [
  { name: 'platform/site-wide', pattern: /\.\/src\/platform\/site-wide/g },
  { name: 'platform/monitoring', pattern: /\.\/src\/platform\/monitoring/g },
  { name: 'platform/user-nav', pattern: /\.\/src\/platform\/user-nav/g },
  { name: 'platform/startup', pattern: /\.\/src\/platform\/startup/g },
];

console.log('📈 Reference counts for key modules (webpack module IDs):');
keyPatterns.forEach(({ name, pattern }) => {
  const isolatedCount = (isolatedContent.match(pattern) || []).length;
  const multiCount = (multiContent.match(pattern) || []).length;
  const diff = multiCount - isolatedCount;
  const indicator = diff > 0 ? '🔴' : diff < 0 ? '🟢' : '✓';
  console.log(`  ${indicator} ${name}: ${isolatedCount} → ${multiCount} (${diff > 0 ? '+' : ''}${diff})`);
});

console.log('');

// Summary of differences
const significantDiff = validOnlyInMulti.length > 0 || validOnlyInIsolated.length > 0;
if (significantDiff) {
  console.log('📋 Summary:');
  if (validOnlyInMulti.length > 0) {
    console.log(`  • ${validOnlyInMulti.length} module(s) appear only in multi-entry build`);
    console.log(`    These modules are being included due to other entry points importing them`);
  }
  if (validOnlyInIsolated.length > 0) {
    console.log(`  • ${validOnlyInIsolated.length} module(s) appear only in isolated build`);
    console.log(`    These modules are being excluded when other entry points are present`);
  }
  console.log('');
}
