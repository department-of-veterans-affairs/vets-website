/* eslint-disable no-console */

/**
 * Playwright test sharding with duration-based greedy partitioning.
 *
 * Discovers *.playwright.spec.js files, optionally filters to only
 * specs relevant to changed files (smart test selection), loads
 * historical durations, and assigns tests to shards using the LPT
 * (Longest Processing Time first) algorithm.
 *
 * Env vars:
 *   CHANGED_FILE_PATHS - space-separated list of changed files
 *   RUN_FULL_SUITE     - "true" to run all specs regardless
 *   IS_MAIN_BUILD      - "true" when building the main branch
 *
 * Outputs:
 *   - playwright-shards.json (artifact for matrix runners)
 *   - GITHUB_OUTPUT: shard_indices, shard_count, has_tests
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DURATIONS_FILE = path.join(ROOT_DIR, 'playwright-durations.json');
const OUTPUT_FILE = path.join(ROOT_DIR, 'playwright-shards.json');

// Default estimate for tests with no historical data.
// Actual sitewide tests run in ~2s; 10s is generous for app tests
// with multiple page navigations. Overestimating wastes runners.
const DEFAULT_DURATION_MS = 10_000;

// Target execution time per shard (excluding CI overhead).
// With ~1.5min CI overhead and a 3min wall-clock target, each shard
// gets ~1.5min of actual test execution.
const EXECUTION_BUDGET_MS = 90_000;

const MAX_SHARDS = 8;

const CHANGED_FILE_PATHS = process.env.CHANGED_FILE_PATHS
  ? process.env.CHANGED_FILE_PATHS.split(' ')
  : [];
const RUN_FULL_SUITE = process.env.RUN_FULL_SUITE === 'true';
const IS_MAIN_BUILD = process.env.IS_MAIN_BUILD === 'true';

function findTestFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') {
      // eslint-disable-next-line no-continue
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findTestFiles(full));
    } else if (entry.name.endsWith('.playwright.spec.js')) {
      results.push(path.relative(ROOT_DIR, full));
    }
  }
  return results;
}

function loadDurations() {
  try {
    if (fs.existsSync(DURATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(DURATIONS_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not load durations:', e.message);
  }
  return {};
}

/**
 * Select which Playwright specs to run based on changed files.
 * On main or RUN_FULL_SUITE, returns all specs. Otherwise, returns
 * only specs related to changed applications/platform code.
 */
function selectTests() {
  const allFiles = findTestFiles(SRC_DIR);

  if (RUN_FULL_SUITE || IS_MAIN_BUILD) {
    console.log('Running full suite.');
    return allFiles;
  }

  if (CHANGED_FILE_PATHS.length === 0) {
    console.log('No changed files detected, running full suite.');
    return allFiles;
  }

  const filteredChangedFiles = CHANGED_FILE_PATHS.filter(
    filePath =>
      !filePath.endsWith('.md') && !filePath.startsWith('.github/workflows'),
  );

  if (filteredChangedFiles.length === 0) {
    console.log('Only docs/workflow changes, skipping Playwright tests.');
    return [];
  }

  const selected = new Set();

  // Changes to platform/testing/e2e/playwright → run everything
  if (
    filteredChangedFiles.some(f =>
      f.startsWith('src/platform/testing/e2e/playwright'),
    )
  ) {
    console.log('Playwright infrastructure changed, running full suite.');
    return allFiles;
  }

  // Changes to Playwright config → run everything
  if (filteredChangedFiles.some(f => f.includes('playwright.config'))) {
    console.log('Playwright config changed, running full suite.');
    return allFiles;
  }

  // Find app-specific specs for changed applications
  const changedApps = new Set();
  for (const filePath of filteredChangedFiles) {
    if (filePath.startsWith('src/applications/')) {
      changedApps.add(filePath.split('/')[2]);
    }
  }

  for (const app of changedApps) {
    const appPrefix = `src/applications/${app}/`;
    for (const testFile of allFiles) {
      if (testFile.startsWith(appPrefix)) {
        selected.add(testFile);
      }
    }
  }

  // Changes to platform code → run all platform specs
  const platformChanged = filteredChangedFiles.some(
    f =>
      f.startsWith('src/platform/') &&
      !f.startsWith('src/platform/testing/e2e/playwright'),
  );
  if (platformChanged) {
    for (const testFile of allFiles) {
      if (testFile.startsWith('src/platform/')) {
        selected.add(testFile);
      }
    }
  }

  console.log(`Changed apps: ${[...changedApps].join(', ') || '(none)'}`);
  console.log(`Platform changed: ${platformChanged}`);
  console.log(`Selected ${selected.size} of ${allFiles.length} specs.`);

  return [...selected];
}

function calculateShardCount(totalDuration) {
  const needed = Math.ceil(totalDuration / EXECUTION_BUDGET_MS);
  return Math.max(1, Math.min(needed, MAX_SHARDS));
}

/**
 * LPT (Longest Processing Time first) greedy bin-packing.
 * Sorts tests by duration descending, then assigns each to the
 * shard with the least total time. Near-optimal for minimizing
 * the maximum shard duration.
 */
function greedyPartition(tests, shardCount) {
  const sorted = [...tests].sort((a, b) => b.duration - a.duration);
  const shards = Array.from({ length: shardCount }, () => ({
    files: [],
    total: 0,
  }));

  for (const test of sorted) {
    const lightest = shards.reduce((a, b) => (a.total <= b.total ? a : b));
    lightest.files.push(test.file);
    lightest.total += test.duration;
  }

  return shards;
}

function writeOutput(key, value) {
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  }
}

function main() {
  const testFiles = selectTests();
  const durations = loadDurations();

  if (testFiles.length === 0) {
    console.log('No Playwright test files to run.');
    const result = { shardCount: 0, shards: {} };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    writeOutput('shard_indices', '[]');
    writeOutput('shard_count', '0');
    writeOutput('has_tests', 'false');
    return;
  }

  const tests = testFiles.map(file => ({
    file,
    duration: durations[file] || DEFAULT_DURATION_MS,
  }));

  const totalDuration = tests.reduce((sum, t) => sum + t.duration, 0);
  const shardCount = calculateShardCount(totalDuration);
  const shards = greedyPartition(tests, shardCount);

  console.log(`Test files: ${testFiles.length}`);
  console.log(
    `Total estimated duration: ${(totalDuration / 1000).toFixed(1)}s`,
  );
  console.log(`Shard count: ${shardCount}`);
  console.log(`Budget per shard: ${EXECUTION_BUDGET_MS / 1000}s`);

  const result = { shardCount, shards: {} };
  shards.forEach((shard, i) => {
    result.shards[i] = shard.files;
    console.log(
      `  Shard ${i}: ${shard.files.length} files, ~${(
        shard.total / 1000
      ).toFixed(1)}s`,
    );
    shard.files.forEach(f => console.log(`    ${f}`));
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

  const indices = JSON.stringify(
    Array.from({ length: shardCount }, (_, i) => i),
  );
  writeOutput('shard_indices', indices);
  writeOutput('shard_count', String(shardCount));
  writeOutput('has_tests', 'true');
}

main();
