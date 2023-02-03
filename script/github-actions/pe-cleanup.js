const fs = require('fs');

/* eslint-disable no-console */
const valuesFiles = fs
  .readdirSync('./manifests/apps/preview-environment/dev/environment-values/')
  .filter(file => file.includes(process.env.DELETED_BRANCH));

console.log(valuesFiles);

valuesFiles.forEach(file => {
  try {
    fs.unlinkSync(
      `./manifests/apps/preview-environment/dev/environment-values/${file}`,
    );
  } catch (error) {
    console.log(error);
  }
});
const valuesFilesAfterDelete = fs.readdirSync(
  './manifests/apps/preview-environment/dev/environment-values/',
);

console.log(
  valuesFilesAfterDelete.filter(file =>
    file.includes(process.env.DELETED_BRANCH),
  ),
);
