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
      'https://api.github.com',
      'repos',
      'department-of-veterans-affairs/vets-website',
      'pact',
      'dispatches',
    ),
  ).toString();

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      ref: `${process.env.GITHUB_REF}`,
    }),
  };

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
