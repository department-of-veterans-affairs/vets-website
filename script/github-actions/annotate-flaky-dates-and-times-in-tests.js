#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

const cypressSpecs = process.argv[2] || 'src';

const CHANGED_APPS = process.env.CHANGED_FILES
  ? process.env.CHANGED_FILES.split(' ').map(filePath =>
      filePath
        .split('/')
        .slice(0, 3)
        .join('/'),
    )
  : [];

const dateTimeHelpers = [
  'new Date()',
  'Date.now()',
  'Date.parse(',
  'Date.UTC()',
  'dayjs()',
  'moment().calendar()',
  'moment().format(',
  'DateTime.now()',
  'cy.tick(',
  'getHours(',
  'getMinutes(',
  'getSeconds(',
  'setHours(',
  'setMinutes(',
  'setSeconds(',
  'toTimeString(',
  'toLocaleTimeString(',
];

const waitHelpers = ['setTimeout(', 'sleep(', 'browser.sleep('];
const waitRegex = /cy\.wait\(\s*(?!.*@)[^)]*\)/;

function getSpecFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getSpecFiles(filePath));
    } else if (file.endsWith('cypress.spec.js')) {
      results.push(filePath);
    }
  });

  return results;
}

function checkSpecsForFlakyDatesAndTimes(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const dateTimeAnnotations = [];
  lines.forEach((line, index) => {
    if (dateTimeHelpers.some(helper => line.includes(helper))) {
      dateTimeAnnotations.push({
        path: file,
        start_line: index + 1,
        end_line: index + 1,
        annotation_level: 'warning',
        message:
          'Dynamically generated date or time found. Mocked dates and times should be used in testing to avoid flakiness.',
      });
    }
    if (waitRegex.test(line)) {
      dateTimeAnnotations.push({
        path: file,
        start_line: index + 1,
        end_line: index + 1,
        annotation_level: 'warning',
        message: 'Hard-coded cy.wait() found. Use alias-based waits instead.',
      });
    } else if (waitHelpers.some(helper => line.includes(helper))) {
      dateTimeAnnotations.push({
        path: file,
        start_line: index + 1,
        end_line: index + 1,
        annotation_level: 'warning',
        message:
          'Hard-coded wait was found. Use polling or explicit wait-for conditions instead.',
      });
    }
  });
  return dateTimeAnnotations;
}

console.log(
  `Checking for tests using potentially flaky date/time generation...`,
);

const specFiles = getSpecFiles(cypressSpecs);
let collectedAnnotations = [];

if (specFiles.length > 0) {
  specFiles.forEach(file => {
    if (CHANGED_APPS.some(appPath => file.startsWith(appPath))) {
      const annotations = checkSpecsForFlakyDatesAndTimes(file);
      collectedAnnotations = collectedAnnotations.concat(annotations);
    }
  });
}

if (collectedAnnotations.length === 0) {
  console.log('No flaky date/time usage found in changed apps.');
}

core.exportVariable(
  'FLAKY_DATES_TIMES_ANNOTATIONS_JSON',
  JSON.stringify(collectedAnnotations),
);
