const { Octokit } = require('octokit');
const { createAppAuth } = require('@octokit/auth-app');

const constants = require('./constants');
const githubAppCredentials = require('./github-app-credentials');

class GitHub {
  constructor() {
    this.createOctokitClient();
  }

  createOctokitClient() {
    this.octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        ...githubAppCredentials,
      },
    });
  }

  async getProductDirectory() {
    try {
      return await this.octokit.rest.repos.getContent({
        mediaType: {
          format: 'raw',
        },
        owner: constants.owner,
        repo: constants.repo,
        path: constants.repo.path,
      });
    } catch (e) {
      return e;
    }
  }

  async createRef() {
    try {
      const response = await this.octokit.rest.repos.getBranch({
        owner: constants.owner,
        repo: constants.repo,
        path: constants.repo.path,
        branch: 'main',
      });

      return this.octokit.rest.git.createRef({
        owner: constants.owner,
        repo: constants.repo,
        ref: constants.ref,
        sha: response.data.commit.sha,
      });
    } catch (e) {
      return e;
    }
  }
}

module.exports = GitHub;
