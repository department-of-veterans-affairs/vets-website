const fs = require('fs');
const core = require('@actions/core');

const valuesFiles = fs
  .readdirSync('./manifests/apps/preview-environment/dev/environment-values/')
  .filter(file =>
    file.includes(
      `${process.env.CURRENT_REPOSITORY}-${process.env.DELETED_BRANCH}`,
    ),
  );

if (valuesFiles.length > 0) {
  core.exportVariable('FILES_TO_DELETE', true);
}

valuesFiles.forEach(file => {
  try {
    fs.unlinkSync(
      `./manifests/apps/preview-environment/dev/environment-values/${file}`,
    );
  } catch (error) {
    /* eslint-disable no-console */
    console.log(error);
  }
});
