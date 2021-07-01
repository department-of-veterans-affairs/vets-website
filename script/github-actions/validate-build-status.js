/* eslint-disable no-console */
/* eslint-disable camelcase */
const fetch = require('node-fetch');

const args = process.argv.slice(2);
const repo = args[0];
const timeout = 2; // minutes
const ymlName = args[1]; // TODO: Once e2e is changed to continous integration, we can remove
const releaseSHA = args[2];
let page = 1;
let checkWorkflowURL = `https://api.github.com/repos/${repo}/actions/workflows/${ymlName}.yml/runs?branch=master&page=${page}&per_page=50`;

/**
 * fetch request for github action URL provided
 * @param {string} url
 */
function getLatestWorkflow(url) {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  return fetch(url, headers)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(
          Error(`Response not okay with ${url}. Aborting.`),
        );
      }
      return response.json();
    })
    .then(({ workflow_runs }) => {
      if (workflow_runs.length === 0) {
        return Promise.reject(Error(`No workflows returns. Aborting.`));
      }

      let validWorkflow;

      // If SHA passed, get workflow information. Otherwise get the most recent
      if (releaseSHA) {
        validWorkflow = workflow_runs.find(
          ({ head_sha }) => head_sha === releaseSHA,
        );
        if (validWorkflow === undefined) {
          page += 1;
          checkWorkflowURL = `https://api.github.com/repos/${repo}/actions/workflows/${ymlName}.yml/runs?branch=master&page=${page}&per_page=50`;
          // TODO: check timestamp
          return getLatestWorkflow(checkWorkflowURL);
        }
      } else {
        validWorkflow = workflow_runs[0];
      }

      if (validWorkflow.conclusion === 'failure') {
        return Promise.reject(
          Error(
            `Build aborted due to failed runs detected on.\n\n ${
              validWorkflow.html_url
            }`,
          ),
        );
      } else if (
        validWorkflow.status === 'in_progress' ||
        validWorkflow.status === null ||
        validWorkflow.status === 'queued'
      ) {
        return Promise.reject({});
      } else {
        console.log(`All checks succeeded for ${ymlName}`);
        return Promise.resolve();
      }
    });
}

function sleep(minutes) {
  return new Promise(resolve => setTimeout(resolve, minutes * 60 * 1000));
}

/**
 * Checks Github Actions url. Loops recursively until error is thrown.
 */
async function main() {
  try {
    return await getLatestWorkflow(checkWorkflowURL);
  } catch (e) {
    if (e.name !== undefined && e.name === 'Error') {
      console.log(e);
      process.exit(1);
    }
    console.log(`Check runs still pending. Sleeping for ${timeout} minutes`);
    await sleep(timeout);
    return main();
  }
}

main();
