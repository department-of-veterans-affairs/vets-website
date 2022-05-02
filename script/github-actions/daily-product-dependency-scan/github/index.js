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
        path: constants.path,
      });
    } catch (e) {
      return e;
    }
  }

  async setLastCommitSha() {
    try {
      const response = await this.octokit.rest.repos.getBranch({
        owner: constants.owner,
        repo: constants.repo,
        branch: constants.branch,
        path: constants.repo.path,
      });

      this.lastCommitSha = response.data.commit.sha;

      return response;
    } catch (e) {
      return e;
    }
  }

  async createCsvBlob({ content }) {
    try {
      const response = await this.octokit.rest.git.createBlob({
        owner: constants.owner,
        repo: constants.repo,
        content,
        encoding: 'utf-8',
      });

      this.utfBlobSha = response.data.sha;

      return response;
    } catch (e) {
      return e;
    }
  }

  async createTree() {
    try {
      const response = await this.octokit.rest.git.createTree({
        owner: constants.owner,
        repo: constants.repo,
        // eslint-disable-next-line camelcase
        base_tree: this.lastCommitSha,
        tree: [
          {
            path: constants.path,
            mode: '100644',
            type: 'blob',
            sha: this.utfBlobSha,
          },
        ],
      });

      this.treeSha = response.data.sha;

      return response;
    } catch (e) {
      return e;
    }
  }

  async createRef() {
    try {
      const ref = `${constants.ref}_${getDateTime()}`;

      return await this.octokit.rest.git.createRef({
        owner: constants.owner,
        repo: constants.repo,
        ref,
        sha: this.lastCommitSha,
      });
    } catch (e) {
      return e;
    }
  }

  async createCommit() {
    try {
      const response = await this.octokit.rest.git.createCommit({
        owner: constants.owner,
        repo: constants.repo,
        message: 'Update dependencies in Product Directory',
        parents: [this.lastCommitSha],
        tree: this.treeSha,
      });

      this.newCommitSha = response.data.sha;

      return response;
    } catch (e) {
      return e;
    }
  }
}

module.exports = GitHub;
