/* eslint-disable no-console */

/**
 * Kicks off the verification job in the vets-api CI pipeline.
 *
 * Only meant to run in CI.
 */

const fetch = require('node-fetch');

const verifyPacts = async () => {
  const url = `https://api.github.com/repos/department-of-veterans-affairs/vets-api/actions/workflows/8289333/dispatches`;

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      ref: 'master',
      repo: 'vets-api',
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
