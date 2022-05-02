/* eslint-disable no-console */
const { Octokit } = require('octokit');
const { createAppAuth } = require('@octokit/auth-app');

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
        owner: 'holdenhinkle',
        repo: 'product-directory',
        path: 'product-directory.csv',
      });
    } catch (e) {
      return e;
    }
  }
}

const gitHubService = new GitHub();
gitHubService.getProductDirectory();

module.exports = GitHub;
