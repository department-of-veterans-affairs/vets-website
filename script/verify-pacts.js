/* eslint-disable no-console */

/**
 * Kicks off the verification job in the vets-api CI pipeline.
 *
 * Only meant to run in CI.
 */

const fetch = require('node-fetch');
const path = require('path');

const verifyPacts = async () => {
  const url = new URL(
    path.join(
      'https://circleci.com/api/v2',
      'project/github',
      'department-of-veterans-affairs/vets-api',
      'pipeline',
    ),
  ).toString();

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
        consumer_version: process.env.CIRCLE_SHA1,
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

verifyPacts().catch(error => {
  console.error(error);
  process.exit(1);
});
