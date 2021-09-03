/* eslint-disable no-console */

const fetch = require('node-fetch');
const path = require('path');

if (!process.env.GITHUB_REF) {
  throw new Error('No branch name found.');
}

const { GITHUB_REF, JENKINS_API_TOKEN } = process.env;
const [, branchName] = GITHUB_REF.match(/refs\/heads\/(.+)/);

const url = new URL(
  path.join(
    'https://dev.va.gov/jenkins',
    'job/testing',
    'job/vets-website',
    `job/${encodeURIComponent(branchName)}`,
    'build',
  ),
);

url.searchParams.append(
  'json',
  JSON.stringify({
    parameter: [{ name: 'cancelBuild', value: 'false' }],
  }),
);

const options = {
  method: 'POST',
  headers: {
    Authorization: `Basic ${Buffer.from(
      `va-vfs-bot:${JENKINS_API_TOKEN}`,
    ).toString('base64')}`,
  },
};

const handleResponse = response => {
  console.log(response);
  if (!response.ok) {
    const status = `${response.status} ${response.statusText}`;
    const message = `Failed to trigger Jenkins pipeline: ${status}`;
    throw new Error(message);
  }

  console.log('Successfully triggered Jenkins pipeline!');
  process.exit(0);
};

const handleError = error => {
  console.error(error);
  process.exit(1);
};

fetch(url.toString(), options)
  .then(handleResponse)
  .catch(handleError);
