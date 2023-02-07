const fs = require('fs');
const core = require('@actions/core');
const yaml = require('js-yaml');

/* eslint-disable no-console */

const daysSinceUpdate = dateUpdated => {
  const diff = new Date() - new Date(dateUpdated);
  return diff / (1000 * 60 * 60 * 24);
};

const deleteFiles = valuesFiles => {
  core.exportVariable('FILES_TO_DELETE', true);
  valuesFiles.forEach(file => {
    try {
      fs.unlinkSync(
        `./manifests/apps/preview-environment/dev/environment-values/${file}`,
      );
      console.log(`${file} removed`);
    } catch (error) {
      console.log(error);
    }
  });
};

if (process.env.TRIGGERING_EVENT === 'delete') {
  const valuesFiles = fs
    .readdirSync('./manifests/apps/preview-environment/dev/environment-values/')
    .filter(file =>
      file.includes(
        `${process.env.CURRENT_REPOSITORY}-${process.env.DELETED_BRANCH}`,
      ),
    );

  if (valuesFiles.length > 0) {
    deleteFiles(valuesFiles);
  } else {
    core.exportVariable('FILES_TO_DELETE', false);
  }
}

if (process.env.TRIGGERING_EVENT === 'schedule') {
  const valuesFiles = fs
    .readdirSync('./manifests/apps/preview-environment/dev/environment-values/')
    .filter(file => {
      const fileContents = yaml.load(
        fs.readFileSync(
          `./manifests/apps/preview-environment/dev/environment-values/${file}`,
          'utf8',
        ),
      ).podAnnotations.last_updated;
      return !fileContents || daysSinceUpdate(fileContents) >= 7;
    });
  if (valuesFiles.length > 0) {
    deleteFiles(valuesFiles);
  } else {
    core.exportVariable('FILES_TO_DELETE', false);
  }
}
