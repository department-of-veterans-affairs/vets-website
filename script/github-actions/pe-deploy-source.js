const core = require('@actions/core');

const sourceEvent = process.env.SOURCE_EVENT;

/* eslint-disable no-console */

if (sourceEvent === 'push') {
  core.exportVariable('SOURCE_REPO', 'vets-website');
} else {
  core.exportVariable('SOURCE_REPO', 'content-build');
}

console.log(process.env.SOURCE_EVENT);
console.log(process.env.SOURCE_REF);
