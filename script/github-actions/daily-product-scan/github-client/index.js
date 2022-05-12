const { Octokit } = require('octokit');
const { createAppAuth } = require('@octokit/auth-app');
const { createPullRequest } = require('octokit-plugin-create-pull-request');

const githubAppCredentials = require('./github-app-credentials');
const constants = require('./constants');
const { getDateTime } = require('./helpers');

class GitHubClient {
  constructor() {
    this.createOctokitClient();
  }

  createOctokitClient() {
    const MyOctokit = Octokit.plugin(createPullRequest);
    this.octokit = new MyOctokit({
      authStrategy: createAppAuth,
      auth: {
        ...githubAppCredentials,
      },
    });
  }

  async getProductCsv() {
    try {
      return await this.octokit.rest.repos.getContent({
        mediaType: {
          format: 'raw',
        },
        owner: constants.owner,
        repo: constants.repo,
        path: constants.path,
      });
    } catch (e) {
      return e;
    }
  }

  async createPull({ content }) {
    const title = 'Automatic Product Directory CSV Update';
    const body = `This is an automatic update.

    Changes were detected in one or more products listed in the Product Directory CSV thus requiring it to be updated.

    This PR was made by the Product Directory Updater bot. It scans \`vets-website\` once a day for changes to the following fields for each product:
    - package_dependencies
    - cross_product_dependencies
    - has_unit_tests
    - has_e2e_tests
    - has_contract_tests
    - path_to_code
    

    This bot runs weekdays at 12am.`;
    const commit = 'Update fields in the Product Directory CSV';

    try {
      return await this.octokit.createPullRequest({
        owner: constants.owner,
        repo: constants.repo,
        title,
        body,
        base: constants.branch,
        head: `update_dependencies_${getDateTime()}`,
        forceFork: false,
        changes: [
          {
            files: {
              [constants.path]: content,
            },
            commit,
          },
        ],
      });
    } catch (e) {
      return e;
    }
  }
}

module.exports = GitHubClient;
