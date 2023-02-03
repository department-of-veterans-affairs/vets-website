const fs = require('fs');

/* eslint-disable no-console */
const valuesFiles = fs.readdirSync(
  './manifests/apps/preview-environment/dev/environment-values/',
);

console.log(
  valuesFiles.filter(file => file.includes(process.env.DELETED_BRANCH)),
);
