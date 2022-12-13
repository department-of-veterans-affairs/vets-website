const core = require('@actions/core');

const sourceEvent = process.env.SOURCE_EVENT || null;

/* eslint-disable no-console */
console.log(sourceEvent);

if (sourceEvent) {
  core.exportVariable('SOURCE_REPO', 'vets-website');
} else {
  core.exportVariable('SOURCE_REPO', 'content-build');
}
