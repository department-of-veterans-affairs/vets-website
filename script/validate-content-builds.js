const { runCommandSync } = require('./utils');

runCommandSync('npm run build:content --pull-drupal');

// Copy the drupal cache into the content-build repo
runCommandSync('cp -r .cache ../content-build/.cache');

runCommandSync('cd ../content-build && npm run build:content');

const exitCode = runCommandSync('npm run build:compare');
process.exit(exitCode);
