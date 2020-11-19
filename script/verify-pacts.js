/* eslint-disable no-console */

/**
 * Invokes the Pact verification job in the vets-api CircleCI pipeline.
 */

const fetch = require('node-fetch');

const url =
  'https://circleci.com/api/v2/project/github/department-of-veterans-affairs/vets-api/pipeline';

/* eslint-disable camelcase */
const options = {
  method: 'POST',
  headers: {
    'Circle-Token': process.env.PACT_CIRCLECI_TOKEN,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    branch: 'u-don/pact-webhook',
    parameters: {
      verify_stable_pacts: true,
      consumer_branch: process.env.CIRCLE_BRANCH,
    },
  }),
};
/* eslint-enable camelcase */

const handleResponse = async response => {
  if (!response.ok) {
    throw new Error(
      `Failed to trigger Pact verification: ${response.status} ${
        response.statusText
      }`,
    );
  }

  console.log('Successfully triggered Pact verification!');
  console.log(await response.json());
};

const handleError = error => {
  console.error(error);
  process.exit(1);
};

fetch(url, options)
  .then(handleResponse)
  .catch(handleError);
