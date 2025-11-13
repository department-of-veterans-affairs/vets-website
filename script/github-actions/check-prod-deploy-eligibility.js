/* eslint-disable no-console */
/* eslint-disable eqeqeq */

const core = require('@actions/core');

const continuousDeploy = process.env.continuous_deploy;
const entryNames = process.env.entry_names;

console.log('continuous deploy:', continuousDeploy);
console.log('entry names', entryNames);

console.log('continuous deploy type: ', typeof continuousDeploy);
console.log('entry names type: ', typeof entryNames);

if (String(continuousDeploy) == 'true' && entryNames != '') {
  core.exportVariable('CAN_DEPLOY_TO_PROD', 'yes');
} else {
  core.exportVariable('CAN_DEPLOY_TO_PROD', 'no');
}
