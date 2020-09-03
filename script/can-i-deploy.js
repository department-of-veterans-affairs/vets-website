/* eslint-disable no-console */

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const pact = require('@pact-foundation/pact-node');

const pactFilesOrDirs = path.resolve(__dirname, '../pacts');
let pacts;

try {
  pacts = fs.readdirSync(pactFilesOrDirs);
  if (!pacts.length) throw new Error('No pacts found.');
} catch (e) {
  console.warn(e.message);
  console.log('Skipping can-i-deploy check.');
  return;
}

const version = execSync('git rev-parse --verify HEAD')
  .toString()
  .trim();

const pacticipants = pacts
  .map(filename => fs.readJsonSync(`${pactFilesOrDirs}/${filename}`))
  .map(({ consumer: { name } }) => ({ name, version }));

const options = {
  output: 'table',
  pactBroker: process.env.PACT_BROKER_URL,
  pacticipants,
  retryInterval: 10,
  retryWhileUnknown: 3,
  to: 'master',
};

pact.canDeploy(options).catch(() => process.exit(1));
