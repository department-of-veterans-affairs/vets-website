/* eslint-disable no-console */

/**
 * Extracts per-file durations from Playwright mochawesome JSON reports
 * and saves them for use by the shard partitioning script.
 *
 * Usage: node save-playwright-durations.js [mochawesomeDir] [outputFile]
 *   mochawesomeDir: directory containing mochawesome JSON files (default: cypress/results)
 *   outputFile: path to write durations JSON (default: playwright-durations.json)
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = process.argv[2] || 'cypress/results';
const OUTPUT_FILE = process.argv[3] || 'playwright-durations.json';

/**
 * Normalize absolute CI paths to workspace-relative paths.
 * Playwright reports absolute paths like /home/runner/work/.../src/...
 * but the shard script uses relative paths like src/...
 */
function normalizePath(filePath) {
  const srcIndex = filePath.indexOf('src/');
  if (srcIndex !== -1) return filePath.substring(srcIndex);
  return filePath;
}

function extractDurations(dataDir) {
  const durations = {};

  if (!fs.existsSync(dataDir)) {
    console.log(`Directory not found: ${dataDir}`);
    return durations;
  }

  const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

  for (const file of jsonFiles) {
    try {
      const report = JSON.parse(
        fs.readFileSync(path.join(dataDir, file), 'utf8'),
      );
      for (const result of report.results || []) {
        // eslint-disable-next-line no-continue
        if (!result.fullFile) continue;

        let fileDuration = 0;
        const sumDurations = (tests, suites) => {
          for (const test of tests) fileDuration += test.duration || 0;
          for (const suite of suites)
            sumDurations(suite.tests || [], suite.suites || []);
        };
        sumDurations(result.tests || [], result.suites || []);

        const normalizedPath = normalizePath(result.fullFile);
        durations[normalizedPath] = fileDuration;
      }
    } catch (e) {
      console.warn(`Skipping ${file}: ${e.message}`);
    }
  }

  return durations;
}

function main() {
  const durations = extractDurations(DATA_DIR);

  // Merge with existing data (preserves entries for files not in current run)
  let existing = {};
  try {
    if (fs.existsSync(OUTPUT_FILE)) {
      existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    }
  } catch {
    // ignore parse errors
  }

  const merged = { ...existing, ...durations };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(merged, null, 2));

  console.log(
    `Durations saved: ${Object.keys(durations).length} from current run`,
  );
  console.log(`Total entries: ${Object.keys(merged).length}`);
  Object.entries(durations).forEach(([file, ms]) => {
    console.log(`  ${file}: ${(ms / 1000).toFixed(1)}s`);
  });
}

main();
