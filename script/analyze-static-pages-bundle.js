#!/usr/bin/env node

/**
 * Script to analyze static-pages bundle differences between isolated and multi-entry builds
 * 
 * This script:
 * 1. Builds static-pages in isolation
 * 2. Builds static-pages with other entry points
 * 3. Generates bundle analysis reports for comparison
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BUILD_TYPE = 'vagovprod';
const ISOLATED_ENTRY = 'static-pages';
const MULTI_ENTRY = 'static-pages,pensions,dashboard,messages,medical-records,hca';

const ISOLATED_BUILD_DIR = path.join(__dirname, '../build/isolated-static-pages');
const MULTI_BUILD_DIR = path.join(__dirname, '../build/multi-entry-static-pages');

console.log('🔍 Analyzing static-pages bundle differences...\n');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync(ISOLATED_BUILD_DIR)) {
  fs.rmSync(ISOLATED_BUILD_DIR, { recursive: true, force: true });
}
if (fs.existsSync(MULTI_BUILD_DIR)) {
  fs.rmSync(MULTI_BUILD_DIR, { recursive: true, force: true });
}

// Build isolated static-pages
console.log(`\n📦 Building isolated ${ISOLATED_ENTRY}...`);
try {
  execSync(
    `yarn build:webpack --env buildtype=${BUILD_TYPE} --env entry=${ISOLATED_ENTRY} --env destination=isolated-static-pages --env statoscope=true`,
    { stdio: 'inherit', cwd: path.join(__dirname, '..') }
  );
  console.log('✅ Isolated build complete\n');
} catch (error) {
  console.error('❌ Isolated build failed:', error.message);
  process.exit(1);
}

// Build multi-entry
console.log(`\n📦 Building multi-entry (${MULTI_ENTRY})...`);
try {
  execSync(
    `yarn build:webpack --env buildtype=${BUILD_TYPE} --env entry=${MULTI_ENTRY} --env destination=multi-entry-static-pages --env statoscope=true`,
    { stdio: 'inherit', cwd: path.join(__dirname, '..') }
  );
  console.log('✅ Multi-entry build complete\n');
} catch (error) {
  console.error('❌ Multi-entry build failed:', error.message);
  process.exit(1);
}

// Analyze bundle sizes
console.log('\n📊 Analyzing bundle sizes...\n');

const isolatedBundlePath = path.join(ISOLATED_BUILD_DIR, 'generated/static-pages.entry.js');
const multiBundlePath = path.join(MULTI_BUILD_DIR, 'generated/static-pages.entry.js');

if (fs.existsSync(isolatedBundlePath) && fs.existsSync(multiBundlePath)) {
  const isolatedStats = fs.statSync(isolatedBundlePath);
  const multiStats = fs.statSync(multiBundlePath);
  
  const isolatedSize = (isolatedStats.size / 1024 / 1024).toFixed(2);
  const multiSize = (multiStats.size / 1024 / 1024).toFixed(2);
  const difference = ((multiStats.size - isolatedStats.size) / 1024 / 1024).toFixed(2);
  const percentDiff = (((multiStats.size - isolatedStats.size) / isolatedStats.size) * 100).toFixed(1);
  
  console.log('Bundle Size Comparison:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Isolated build:  ${isolatedSize} MB`);
  console.log(`Multi-entry:     ${multiSize} MB`);
  console.log(`Difference:      ${difference > 0 ? '+' : ''}${difference} MB (${percentDiff > 0 ? '+' : ''}${percentDiff}%)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Check for platform/site-wide in bundles
  console.log('🔍 Checking for platform/site-wide references...\n');
  
  const isolatedContent = fs.readFileSync(isolatedBundlePath, 'utf8');
  const multiContent = fs.readFileSync(multiBundlePath, 'utf8');
  
  const isolatedSiteWideMatches = (isolatedContent.match(/platform\/site-wide/g) || []).length;
  const multiSiteWideMatches = (multiContent.match(/platform\/site-wide/g) || []).length;
  
  console.log(`References to "platform/site-wide":`);
  console.log(`  Isolated: ${isolatedSiteWideMatches}`);
  console.log(`  Multi-entry: ${multiSiteWideMatches}`);
  console.log(`  Difference: ${multiSiteWideMatches - isolatedSiteWideMatches}\n`);
  
  // Look for specific site-wide modules
  const siteWideModules = [
    'platform/site-wide/user-nav',
    'platform/site-wide/header',
    'platform/site-wide/va-footer',
    'platform/site-wide/mega-menu',
    'platform/monitoring/sentry',
    'platform/monitoring/web-vitals',
  ];
  
  console.log('Module reference counts:');
  siteWideModules.forEach(module => {
    const isolatedCount = (isolatedContent.match(new RegExp(module.replace(/\//g, '\\/'), 'g')) || []).length;
    const multiCount = (multiContent.match(new RegExp(module.replace(/\//g, '\\/'), 'g')) || []).length;
    if (isolatedCount !== multiCount) {
      console.log(`  ${module}:`);
      console.log(`    Isolated: ${isolatedCount}, Multi-entry: ${multiCount}, Diff: ${multiCount - isolatedCount > 0 ? '+' : ''}${multiCount - isolatedCount}`);
    }
  });
  
  console.log('\n📈 Statoscope reports generated:');
  console.log(`  Isolated: ${path.join(ISOLATED_BUILD_DIR, 'generated/statoscope-report.html')}`);
  console.log(`  Multi-entry: ${path.join(MULTI_BUILD_DIR, 'generated/statoscope-report.html')}`);
  console.log('\n💡 Open these reports in your browser to see detailed bundle analysis.\n');
  
  // Run detailed comparison
  console.log('🔬 Running detailed module comparison...\n');
  try {
    const { execSync } = require('child_process');
    execSync(
      `node ${path.join(__dirname, 'compare-bundles.js')} "${isolatedBundlePath}" "${multiBundlePath}"`,
      { stdio: 'inherit' }
    );
  } catch (error) {
    console.error('⚠️  Comparison script failed:', error.message);
  }
} else {
  console.error('❌ Bundle files not found!');
  if (!fs.existsSync(isolatedBundlePath)) {
    console.error(`  Missing: ${isolatedBundlePath}`);
  }
  if (!fs.existsSync(multiBundlePath)) {
    console.error(`  Missing: ${multiBundlePath}`);
  }
  process.exit(1);
}
