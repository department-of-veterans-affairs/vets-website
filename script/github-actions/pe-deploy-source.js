const core = require('@actions/core');

const sourceEvent = process.env.SOURCE_EVENT;

if (sourceEvent === 'push') {
  core.exportVariable('SOURCE_REPO', 'vets-website');
} else {
  core.exportVariable('SOURCE_REPO', 'content-build');
}
