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

  async getProductJson() {
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
    const title = 'Update product-directory.json';
    const body = [
      'This is an automatic update.',
      '',
      'Changes were detected in one or more products listed in `product-directory.json`.',
      '',
      'This PR was made by the Product Directory Updater bot. It scans `vets-website` once a day for changes to the following property values for each product:',
      '- `package_dependencies`',
      '- `cross_product_dependencies`',
      '- `has_unit_tests`',
      '- `has_e2e_tests`',
      '- `has_contract_tests`',
      '- `path_to_code`',
      '- `last_updated`',
      '',
      'The bot runs weekdays at 12am.',
    ].join('\n');
    const head = `update_dependencies_${getDateTime()}`;
    const commit = 'Update fields in the Product Directory JSON';

    try {
      return await this.octokit.createPullRequest({
        owner: constants.owner,
        repo: constants.repo,
        title,
        body,
        base: constants.branch,
        head,
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
