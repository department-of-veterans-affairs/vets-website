/* eslint-disable class-methods-use-this */
const { Octokit } = require('octokit');
const { createAppAuth } = require('@octokit/auth-app');

class GitHub {
  constructor() {
    this.client = this.createClient();
    this.authenticate();
  }

  createClient() {
    return new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: 1,
        privateKey: '-----BEGIN PRIVATE KEY-----\n...',
        installationId: 123,
      },
    });
  }

  async authenticate() {
    await this.client.rest.apps.getAuthenticated();
  }
}

module.exports = GitHub;
