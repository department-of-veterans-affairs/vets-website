/* eslint-disable no-console */
const semver = require('semver');
const chalk = require('chalk');
const packageJson = require('../package.json');

const version = packageJson.engines.node;

if (!semver.satisfies(process.version, version)) {
  console.log(' ');
  console.log(`${chalk.yellow.bold(`/**`)}`);
  console.log(
    `${chalk.yellow.bold(
      ` * ATTN: Required node version (${version}) not satisfied with current version (${process.version})`,
    )}`,
  );
  console.log(
    `${chalk.yellow.bold(
      ` * Please install nvm to easily switch between node versions: https://github.com/nvm-sh/nvm`,
    )}`,
  );
  console.log(`${chalk.yellow.bold(` */`)}`);
  console.log(' ');
}
