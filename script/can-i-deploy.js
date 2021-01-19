/* eslint-disable no-console */

/**
 * Checks if changes can be deployed depending on whether the
 * generated pacts have been successfully verified by vets-api.
 *
 * Only meant to run in CI.
 */

const chalk = require('chalk');
const path = require('path');

const PactBrokerClient = require('../src/platform/testing/contract/client');

/**
 * Reports whether the changes on the current commit can be deployed
 * to master based on Pact verification results. Can be configured to
 * retry at increasing intervals while verification status is unknown.
 * Throws if status can't be determined after retries.
 *
 * @param {number} [retries=3] - Number of times to retry.
 * @param {number} [timeout=30] - Seconds to wait for status.
 */
const checkDeployability = async (retries = 3, timeout = 30) => {
  const pactBrokerClient = new PactBrokerClient({
    url: process.env.PACT_BROKER_BASE_URL,
    username: process.env.PACT_BROKER_BASIC_AUTH_USERNAME,
    password: process.env.PACT_BROKER_BASIC_AUTH_PASSWORD,
  });

  const pactsFolder = path.resolve(__dirname, '../pacts');
  const commitHash = process.env.CIRCLE_SHA1;

  const { verificationResults, canDeploy } = await pactBrokerClient.canDeploy({
    pactDir: pactsFolder,
    version: commitHash,
    tag: 'master',
  });

  if (canDeploy) {
    console.log(chalk.green('All pacts have passed verification.'));
    console.log(`Changes on commit ${commitHash} can be deployed.`);
    return verificationResults;
  }

  // Each verification result has a summary shaped like so:
  //   { deployable: boolean, reason: string,
  //     success: number, failure: number, unknown: number }
  const unknownVerificationCount = verificationResults.some(
    result => result.summary.unknown > 0,
  );

  // Wait and check back on verification status if there are any unknowns.
  if (unknownVerificationCount && retries > 0) {
    console.log(
      chalk.yellow(
        `Waiting for ${timeout} seconds to check verification status again...`,
      ),
    );
    await new Promise(resolve => setTimeout(resolve, timeout * 1000));
    return checkDeployability(retries - 1, timeout * 2);
  }

  const errorDetails = unknownVerificationCount
    ? "Some pacts haven't been verified by the provider"
    : 'Try again after addressing the verification errors';

  throw new Error(
    `Can't deploy changes on commit ${commitHash}. ${errorDetails}.`,
  );
};

checkDeployability().catch(error => {
  console.error(error);
  process.exit(1);
});
