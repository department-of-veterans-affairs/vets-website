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

function checkSpecsForSkips(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const e2eAnnotations = [];
  lines.forEach((line, index) => {
    if (line.includes('describe.skip(') || line.includes('it.skip(')) {
      e2eAnnotations.push({
        path: file,
        start_line: index + 1,
        end_line: index + 1,
        annotation_level: 'warning',
        message: 'Skipped e2e test found.',
      });
    }
  });
  return e2eAnnotations;
}

console.log(`Checking for skipped e2e tests...`);

const specFiles = getSpecFiles(cypressSpecs);
let collectedAnnotations = [];

if (specFiles.length > 0) {
  specFiles.forEach(file => {
    if (CHANGED_APPS.some(appPath => file.startsWith(appPath))) {
      const annotations = checkSpecsForSkips(file);
      collectedAnnotations = collectedAnnotations.concat(annotations);
    }
  });
}

core.exportVariable(
  'SKIPPED_E2E_ANNOTATIONS_JSON',
  JSON.stringify(collectedAnnotations),
);
