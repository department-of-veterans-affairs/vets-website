/* eslint-disable no-console */
const { Octokit } = require('octokit');
const { createAppAuth } = require('@octokit/auth-app');

class GitHub {
  constructor() {
    this.createClient();
    this.authenticate();
  }

  createClient() {
    this.client = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: process.env.PRODUCT_DIRECTORY_APP_ID,
        privateKey: process.env.PRODUCT_DIRECTORY_PRIVATE_KEY.replace(
          /\\n/gm,
          '\n',
        ),
        installationId: 123,
      },
    });
  }

  async authenticate() {
    try {
      await this.client.rest.apps.getAuthenticated();
    } catch (e) {
      console.log(e);
    }
  }

  async getProductDirectory() {
    try {
      const response = await this.client.rest.repos.getContent({
        owner: 'holdenhinkle',
        repo: 'product-directory',
        path:
          'https://github.com/holdenhinkle/product-directory/blob/main/product-directory.csv',
      });

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }
}

const gitHubService = new GitHub();
gitHubService.getProductDirectory();

// module.exports = GitHub;
