/* eslint-disable no-console */

/**
 * Playwright test sharding with duration-based greedy partitioning.
 *
 * Reads a pre-selected list of *.playwright.spec.js files from
 * playwright_tests_to_test.json (produced by select-e2e-tests.js),
 * loads historical durations, and assigns tests to shards using the
 * LPT (Longest Processing Time first) algorithm.
 *
 * Outputs:
 *   - playwright-shards.json (artifact for matrix runners)
 *   - GITHUB_OUTPUT: shard_indices, shard_count, has_tests
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const DURATIONS_FILE = path.join(ROOT_DIR, 'playwright-durations.json');
const OUTPUT_FILE = path.join(ROOT_DIR, 'playwright-shards.json');
const INPUT_FILE = path.join(ROOT_DIR, 'playwright_tests_to_test.json');

// Default estimate for tests with no historical data.
// Actual sitewide tests run in ~2s; 10s is generous for app tests
// with multiple page navigations. Overestimating wastes runners.
const DEFAULT_DURATION_MS = 10_000;

// Target execution time per shard (excluding CI overhead).
// With ~1.5min CI overhead and a 3min wall-clock target, each shard
// gets ~1.5min of actual test execution.
const EXECUTION_BUDGET_MS = 90_000;

const MAX_SHARDS = 8;

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
  let testFiles;
  if (fs.existsSync(INPUT_FILE)) {
    testFiles = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  } else {
    console.log('No playwright_tests_to_test.json found, no tests to shard.');
    testFiles = [];
  }
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
