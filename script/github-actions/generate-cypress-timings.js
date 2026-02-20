/* eslint-disable no-console */

/**
 * Parses Mochawesome JSON results from Cypress runs and generates
 * a timings.json file compatible with cypress-split.
 *
 * Usage:
 *   node script/github-actions/generate-cypress-timings.js
 *
 * Env vars:
 *   RESULTS_DIR  - directory containing Mochawesome JSON files
 *                  (default: cypress/results)
 *   TIMINGS_FILE - path to write the merged timings file
 *                  (default: cypress-timings.json)
 *   EXISTING_TIMINGS_FILE - optional path to existing timings to merge with
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const RESULTS_DIR = process.env.RESULTS_DIR || 'cypress/results';
const TIMINGS_FILE = process.env.TIMINGS_FILE || 'cypress-timings.json';
const EXISTING_TIMINGS_FILE = process.env.EXISTING_TIMINGS_FILE || '';

function extractDurationsFromResults(resultsDir) {
  const pattern = path.join(resultsDir, '**/*.json');
  const files = glob.sync(pattern);
  const durations = {};

  files.forEach(file => {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!data.results) return;

      data.results.forEach(result => {
        // Mochawesome stores the full path in result.fullFile
        const specPath = result.fullFile || result.file;
        if (!specPath) return;

        // Normalize to a relative path from project root
        const relativePath = specPath
          .replace(/.*\/vets-website\//, '')
          .replace(/^\/__w\/vets-website\/vets-website\//, '');

        // Duration is in milliseconds in result.suites
        const duration = (result.suites || []).reduce((total, suite) => {
          return total + (suite.duration || 0);
        }, 0);

        if (duration > 0) {
          // If we've seen this spec before, use the longer duration
          // to be conservative with balancing
          durations[relativePath] = Math.max(
            durations[relativePath] || 0,
            duration,
          );
        }
      });
    } catch (e) {
      console.warn(`Skipping ${file}: ${e.message}`);
    }
  });

  return durations;
}

function loadExistingTimings(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return {};

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const durations = {};
    (data.durations || []).forEach(entry => {
      durations[entry.spec] = entry.duration;
    });
    return durations;
  } catch (e) {
    console.warn(`Could not load existing timings: ${e.message}`);
    return {};
  }
}

function main() {
  const newDurations = extractDurationsFromResults(RESULTS_DIR);
  const existingDurations = loadExistingTimings(EXISTING_TIMINGS_FILE);

  // Merge: new results overwrite existing for the same spec
  const merged = { ...existingDurations, ...newDurations };

  const timings = {
    durations: Object.entries(merged)
      .map(([spec, duration]) => ({ spec, duration }))
      .sort((a, b) => a.spec.localeCompare(b.spec)),
  };

  fs.writeFileSync(TIMINGS_FILE, `${JSON.stringify(timings, null, 2)}\n`);
  console.log(
    `Wrote ${timings.durations.length} spec timings to ${TIMINGS_FILE}`,
  );
}

main();
