/* eslint-disable no-console */

/**
 * Checks if changes can be deployed depending on whether the generated pacts
 * have been successfully verified by vets-api. Triggers the verification
 * process in the vets-api CI pipeline if any pacts need to be verified.
 *
 * Only meant to run in CI.
 */

const { execSync } = require('child_process');
const path = require('path');

const PactBrokerClient = require('../src/platform/testing/contract/client');

const handleError = error => {
  console.error(error);
  process.exit(1);
};

/**
 * Kicks off the verification job in the vets-api CI pipeline.
 */
const verifyPacts = async () => {
  const url =
    'https://circleci.com/api/v2/project/github/department-of-veterans-affairs/vets-api/pipeline';

  /* eslint-disable camelcase */
  const options = {
    method: 'POST',
    headers: {
      'Circle-Token': process.env.CIRCLE_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      branch: 'master',
      parameters: {
        verify_stable_pacts: true,
        consumer_branch: process.env.CIRCLE_BRANCH,
        consumer_workflow: process.env.CIRCLE_WORKFLOW_ID,
      },
    }),
  };
  /* eslint-enable camelcase */

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(
      `Failed to trigger Pact verification: ${response.status} ${
        response.statusText
      }`,
    );
  }

  console.log('Successfully initiated Pact verification.');
  console.log(await response.json());
};

/**
 * Reports whether the changes on the current commit can be deployed
 * to master based on Pact verification results. Triggers Pact verification
 * if there are any unverified pacts. Throws if changes can't be deployed.
 */
const checkDeployability = () => {
  const pactBrokerClient = new PactBrokerClient({
    url: process.env.PACT_BROKER_BASE_URL,
  });

  const pactsFolder = path.resolve(__dirname, '../pacts');

  const commitHash = execSync('git rev-parse --verify HEAD')
    .toString()
    .trim();

  const handleStatus = async ({ canDeploy, verificationResults }) => {
    if (canDeploy) {
      console.log('All pacts have passed verification.');
      console.log(`Changes on commit ${commitHash} can be deployed.`);
      return;
    }

    // Each verification result has a summary shaped like so:
    //   { deployable: boolean, reason: string,
    //     success: number, failure: number, unknown: number }
    // Only invoke the verification process if there are any unknowns.
    const unknownVerificationCount = verificationResults.some(
      result => result.summary.unknown > 0,
    );

    const defaultErrorMessage = `Can't deploy changes on commit ${commitHash}`;

    if (unknownVerificationCount) {
      console.log("Some pacts haven't been verified by the provider.");
      await verifyPacts();
      throw new Error(`${defaultErrorMessage} until verification is complete.`);
    } else {
      throw new Error(
        `${defaultErrorMessage}. Try again after addressing the failures from the provider.`,
      );
    }
  };

  return pactBrokerClient
    .canDeploy({
      pactDir: pactsFolder,
      version: commitHash,
      tag: 'master',
    })
    .then(handleStatus);
};

checkDeployability().catch(handleError);
