/* eslint-disable no-console */
/* eslint-disable camelcase */
const fetch = require('node-fetch');
const path = require('path');

const args = process.argv.slice(2);
const timeout = 2; // minutes
const [repo, releaseSHA] = args;
let currentPage = 1;

const getWorkflowRunsUrl = (page = 1) => {
  const url = new URL(
    path.join(
      'https://api.github.com',
      `repos/${repo}`,
      `actions/workflows/continuous-integration.yml/runs`,
    ),
  );
  const params = new URLSearchParams();
  params.append('branch', 'master');
  params.append('page', page);
  params.append('per_page', 50);
  url.search = params;

  return url.toString();
};

/**
 * fetch request for github action URL provided
 * @param {string} url
 */
function getLatestWorkflow(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Response ${response.status} from ${url}. Aborting.`);
      }
      return response.json();
    })
    .then(({ workflow_runs }) => {
      if (workflow_runs.length === 0) {
        throw new Error('No workflows found. Aborting.');
      }

      // If SHA passed, get workflow information. Otherwise get the most recent
      if (releaseSHA) {
        const validWorkflow = workflow_runs.find(
          ({ head_sha }) => head_sha === releaseSHA,
        );
        if (!validWorkflow) {
          currentPage += 1;
          const urlNextPage = getWorkflowRunsUrl(currentPage);
          console.log(
            'Workflow not found in current page. Checking next page.',
          );
          // TODO: check timestamp
          return getLatestWorkflow(urlNextPage);
        } else {
          return validWorkflow;
        }
      } else {
        return workflow_runs[0];
      }
    });
}

function sleep(minutes) {
  return new Promise(resolve => setTimeout(resolve, minutes * 60 * 1000));
}

/**
 * Validates the workflow
 * @param {Object} workflow
 * @returns true, false, undefined
 */
function validateWorkflowSuccess(workflow) {
  const { status, conclusion } = workflow;

  if (conclusion === 'failure') return false;

  const isWorkflowInProgress =
    status === 'in_progress' || status === null || status === 'queued';

  if (isWorkflowInProgress) return undefined;
  if (conclusion === 'success') {
    console.log('All checks succeeded');
    return true;
  }

  throw new Error(
    `Unexpected workflow result: ${JSON.stringify({ status, conclusion })}`,
  );
}

/**
 * Checks Github Actions url. Loops recursively until error is thrown.
 */
async function main() {
  try {
    const url = getWorkflowRunsUrl(currentPage);
    const workflow = await getLatestWorkflow(url);
    const success = validateWorkflowSuccess(workflow);

    if (success === undefined) {
      console.log(`Check runs still pending. Sleeping for ${timeout} minutes`);
      await sleep(timeout);
      await main();
    }

    if (!success) {
      // TODO: Check which jobs failed by fetching jobs_url and filtering on jobs we care about.
      console.error(
        `Build aborted due to failed runs detected on:\n\n${workflow.html_url}`,
      );
      process.exit(1);
    }
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

main();
