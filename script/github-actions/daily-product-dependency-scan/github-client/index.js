/* eslint-disable no-unused-vars */
// /* eslint-disable no-console */
// const { Octokit } = require('octokit');
// const { createAppAuth } = require('@octokit/auth-app');
// const { createPullRequest } = require('octokit-plugin-create-pull-request');

// const githubAppCredentials = require('./github-app-credentials');
const constants = require('./constants');
const { getDateTime } = require('./helpers');

// class GitHubClient {
//   constructor() {
//     this.createOctokitClient();
//   }

//   createOctokitClient() {
//     const MyOctokit = Octokit.plugin(createPullRequest);
//     this.octokit = new MyOctokit({
//       authStrategy: createAppAuth,
//       auth: {
//         ...githubAppCredentials,
//       },
//     });
//   }

//   async getProductDirectory() {
//     try {
//       return await this.octokit.rest.repos.getContent({
//         mediaType: {
//           format: 'raw',
//         },
//         owner: constants.owner,
//         repo: constants.repo,
//         path: constants.path,
//       });
//     } catch (e) {
//       return e;
//     }
//   }

//   async createPull({ content }) {
//     try {
//       return await this.octokit.createPullRequest({
//         owner: constants.owner,
//         repo: constants.repo,
//         title: 'Update dependencies in Product Directory',
//         body:
//           'This is an automatic update.\n\nDependency changes were detected in one or more products listed in the Product Directory thus requiring it to be updated.',
//         base: constants.branch,
//         head: `update_dependencies_${getDateTime()}`,
//         forceFork: false,
//         changes: [
//           {
//             files: {
//               [constants.path]: content,
//             },
//             commit: 'Update dependencies in Product Directory',
//           },
//         ],
//       });
//     } catch (e) {
//       return e;
//     }
//   }
// }

class GitHubClient {}

module.exports = GitHubClient;
