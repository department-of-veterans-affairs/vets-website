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
  core.setOutput('can_deploy_to_prod', 'yes');
} else {
  core.setOutput('can_deploy_to_prod', 'no');
}
