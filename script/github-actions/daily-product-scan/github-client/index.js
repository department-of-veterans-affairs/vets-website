const { Octokit } = require('octokit');
const { createAppAuth } = require('@octokit/auth-app');
const { createPullRequest } = require('octokit-plugin-create-pull-request');
const githubAppCredentials = require('./github-app-credentials');
const constants = require('./constants');

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

  async getVetsWebsiteCommits({ path }) {
    try {
      return await this.octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: 'department-of-veterans-affairs',
        repo: 'vets-website',
        // eslint-disable-next-line camelcase
        per_page: 2,
        path,
      });
    } catch (e) {
      return e;
    }
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
}

module.exports = GitHubClient;
