/* eslint-disable no-console */

/**
 * Checks if the generated pacts have been successfully verified by provider(s)
 * in master. Retries if status is unknown while verification is running.
 * Only meant to run in CI.
 */

const { execSync } = require('child_process');
const path = require('path');

const PactBrokerClient = require('../src/platform/testing/contract/client');

const pactBrokerClient = new PactBrokerClient({
  url: process.env.PACT_BROKER_URL,
});

const pactsFolder = path.resolve(__dirname, '../pacts');

const commitHash = execSync('git rev-parse --verify HEAD')
  .toString()
  .trim();

pactBrokerClient
  .canDeploy({
    pactDir: pactsFolder,
    version: commitHash,
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
