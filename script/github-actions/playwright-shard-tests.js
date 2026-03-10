/* eslint-disable no-console */

/**
 * Playwright test sharding with duration-based greedy partitioning.
 *
 * Discovers all *.playwright.spec.js files, loads historical durations
 * (if available), and assigns tests to shards using the LPT (Longest
 * Processing Time first) algorithm for balanced execution times.
 *
 * Outputs:
 *   - playwright-shards.json (artifact for matrix runners)
 *   - GITHUB_OUTPUT: shard_indices, shard_count
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DURATIONS_FILE = path.join(ROOT_DIR, 'playwright-durations.json');
const OUTPUT_FILE = path.join(ROOT_DIR, 'playwright-shards.json');

// Default estimate for tests with no historical data
const DEFAULT_DURATION_MS = 30_000;

// Target execution time per shard (excluding CI overhead).
// With ~1.5min CI overhead and a 3min wall-clock target, each shard
// gets ~1.5min of actual test execution.
const EXECUTION_BUDGET_MS = 90_000;

const MAX_SHARDS = 8;

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

function main() {
  const testFiles = findTestFiles(SRC_DIR);
  const durations = loadDurations();

  if (testFiles.length === 0) {
    console.log('No Playwright test files found.');
    const result = { shardCount: 1, shards: { 0: [] } };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(
        process.env.GITHUB_OUTPUT,
        'shard_indices=[0]\nshard_count=1\n',
      );
    }
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

  if (process.env.GITHUB_OUTPUT) {
    const indices = JSON.stringify(
      Array.from({ length: shardCount }, (_, i) => i),
    );
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `shard_indices=${indices}\nshard_count=${shardCount}\n`,
    );
  }
}

main();
