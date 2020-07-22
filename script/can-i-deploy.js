const { execSync } = require('child_process');
const fs = require('fs-extra');
const pact = require('@pact-foundation/pact-node');

const PACTS_DIR = 'pacts';

const version = execSync('git rev-parse --verify HEAD')
  .toString()
  .trim();

const pacticipants = fs
  .readdirSync(PACTS_DIR)
  .map(filename => fs.readJsonSync(`${PACTS_DIR}/${filename}`))
  .map(({ consumer: { name } }) => ({ name, version }));

const options = {
  output: 'table',
  pactBroker: process.env.PACT_BROKER_URL,
  pacticipants,
  retryInterval: 10,
  retryWhileUnknown: 3,
  to: 'pact-master',
};

pact.canDeploy(options).catch(() => process.exit(1));
