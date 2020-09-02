/* eslint-disable no-console */

const { execSync } = require('child_process');
const pact = require('@pact-foundation/pact-node');
const path = require('path');

const consumerVersion = execSync('git rev-parse --verify HEAD')
  .toString()
  .trim();

const branchName = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

const tags = [branchName];

const opts = {
  pactFilesOrDirs: [path.resolve(__dirname, '../pacts')],
  pactBroker: process.env.PACT_BROKER_URL,
  pactBrokerUsername: process.env.PACT_BROKER_BASIC_AUTH_USERNAME,
  pactBrokerPassword: process.env.PACT_BROKER_BASIC_AUTH_PASSWORD,
  consumerVersion,
  tags,
};

pact
  .publishPacts(opts)
  .then(() => {
    console.log('Pact successfully published!');
  })
  .catch(e => {
    console.log(`Pact failed to publish: ${e}`);
  });
