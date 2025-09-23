#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

const files = process.argv[2] || 'src';

const CHANGED_SET = new Set(
  (process.env.CHANGED_FILES || '')
    .split(/\s+/)
    .filter(Boolean)
    .map(p => path.normalize(p)),
);

const enzymeUsage = [
  'from "enzyme"',
  "from 'enzyme'",
  'require("enzyme")',
  "require('enzyme')",
  'enzyme-adapter-react',
  '@wojtekmaj/enzyme-adapter',
  'enzyme-to-json',
];

function getEnzymeFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      if (file === 'node_modules' || file === '.git') return;
      results = results.concat(getEnzymeFiles(filePath));
    } else {
      results.push(filePath);
    }
  });

  return results;
}

function checkSpecsForEnzyme(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const enzymeAnnotations = [];
  lines.forEach((line, index) => {
    if (enzymeUsage.some(usage => line.includes(usage))) {
      enzymeAnnotations.push({
        path: file,
        start_line: index + 1,
        end_line: index + 1,
        annotation_level: 'warning',
        message:
          'Use of Enzyme found. Enzyme is no longer maintained. React Testing Library is supported by the Platform and compatible with the latest versions of React.',
      });
    }
  });
  return enzymeAnnotations;
}

console.log(
  `Checking for tests using Enzyme, which is no longer maintained...`,
);

const enzymeFound = getEnzymeFiles(files);
let collectedAnnotations = [];

if (enzymeFound.length > 0) {
  enzymeFound.forEach(file => {
    const rel = path.normalize(file);
    if (CHANGED_SET.has(rel)) {
      const annotations = checkSpecsForEnzyme(file);
      collectedAnnotations = collectedAnnotations.concat(annotations);
    }
  });
}

if (collectedAnnotations.length === 0) {
  console.log('No Enzyme usage found in changed apps.');
}

core.exportVariable(
  'ENZYME_ANNOTATIONS_JSON',
  JSON.stringify(collectedAnnotations),
);
