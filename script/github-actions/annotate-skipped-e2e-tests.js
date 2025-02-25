#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

const cypressSpecs = process.argv[2] || 'src';

const APPS_NOT_ISOLATED = process.env.APPS_NOT_ISOLATED
  ? JSON.parse(process.env.APPS_NOT_ISOLATED)
  : [];
const CHANGED_FILES = process.env.CHANGED_FILES
  ? process.env.CHANGED_FILES.split(' ')
  : [];

const matchingFiles = CHANGED_FILES.filter(filePath =>
  APPS_NOT_ISOLATED.some(app => filePath.includes(app)),
);

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
      console.log(
        `::warning file=${file},line=${index + 1}::Skipped e2e test found.`,
      );
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
    if (matchingFiles.some(changedFile => file.includes(changedFile))) {
      const annotations = checkSpecsForSkips(file);
      collectedAnnotations = collectedAnnotations.concat(annotations);
    }
  });
}

core.exportVariable(
  'SKIPPED_E2E_ANNOTATIONS_JSON',
  JSON.stringify(collectedAnnotations),
);
