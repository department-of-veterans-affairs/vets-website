const fs = require('fs');
// const core = require('@actions/core');
const yaml = require('js-yaml');

/* eslint-disable no-console */

// const daysSinceUpdate = dateUpdated => {
//   const diff = new Date() - new Date(dateUpdated);
//   return diff / (1000 * 60 * 60 * 24);
// };

// const deleteFiles = valuesFiles => {
//   core.exportVariable('FILES_TO_DELETE', true);
// const envFileContents = yaml.load(
//   fs.readFileSync(
//     './manifests/apps/preview-environment/dev/argocd-apps/values.yaml',
//   ),
// );
// console.log(envFileContents);
// valuesFiles.forEach(file => {
//   if (file != 'template-values.yaml') {
//     try {
//       fs.unlinkSync(
//         `./manifests/apps/preview-environment/dev/environment-values/${file}`,
//       );
//       console.log(`${file} removed`);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// });
// };

if (process.env.TRIGGERING_EVENT === 'delete') {
  // const valuesFiles = fs
  //   .readdirSync('./manifests/apps/preview-environment/dev/environment-values/')
  //   .filter(file =>
  //     file.includes(
  //       `${process.env.CURRENT_REPOSITORY}-${process.env.DELETED_BRANCH}`,
  //     ),
  //   );
  // if (valuesFiles.length > 0) {
  //   deleteFiles(valuesFiles);
  // } else {
  //   core.exportVariable('FILES_TO_DELETE', false);
  // }
}

if (
  process.env.TRIGGERING_EVENT === 'schedule' ||
  process.env.TRIGGERING_EVENT === 'push'
) {
  const envFileContents = yaml.load(
    fs.readFileSync(
      './manifests/apps/preview-environment/dev/argocd-apps/values.yaml',
    ),
  );
  envFileContents.environments.forEach((environment, index) => {
    console.log(environment.name, index);
  });
  // const valuesFiles = fs
  //   .readdirSync('./manifests/apps/preview-environment/dev/pe-env/')
  //   .filter(file => {
  //     const fileContents = yaml.load(
  //       fs.readFileSync(
  //         `./manifests/apps/preview-environment/dev/environment-values/${file}`,
  //         'utf8',
  //       ),
  //     ).podAnnotations.last_updated;
  //     return !fileContents || daysSinceUpdate(fileContents) >= 7;
  //   });
  // if (valuesFiles.length > 0) {
  //   deleteFiles(valuesFiles);
  // } else {
  //   core.exportVariable('FILES_TO_DELETE', false);
  // }
}
