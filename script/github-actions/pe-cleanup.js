const fs = require('fs');

/* eslint-disable no-console */
const valuesFiles = fs.readdirSync(
  './manifests/apps/preview-environment/dev/environment-values/',
);

console.log(
  valuesFiles.filter(file => file.includes(process.env.DELETED_BRANCH)),
);

valuesFiles.forEach(file => {
  try {
    fs.unlink(
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
