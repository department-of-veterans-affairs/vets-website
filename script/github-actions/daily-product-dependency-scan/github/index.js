const { Octokit } = require('octokit');
const { createAppAuth } = require('@octokit/auth-app');

const githubAppCredentials = require('./github-app-credentials');
const constants = require('./constants');
const { getDateTime } = require('./helpers');

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
        branch: constants.branch,
        path: constants.repo.path,
      });

      const ref = `${constants.ref}_${getDateTime()}`;
      const { sha } = response.data.commit;

      return this.octokit.rest.git.createRef({
        owner: constants.owner,
        repo: constants.repo,
        ref,
        sha,
      });
    } catch (e) {
      return e;
    }
  }
}

module.exports = GitHub;
