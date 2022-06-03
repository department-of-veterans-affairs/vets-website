/* eslint-disable class-methods-use-this */
const { Octokit } = require('@octokit/core');

const constants = require('./constants');

class LastUpdated {
  constructor({ products }) {
    this.products = products;
    this.octokit = new Octokit({
      auth: process.env.DAILY_PRODUCT_SCAN_LAST_UPDATED_TOKEN,
    });
  }

  setLastUpdated() {
    Object.keys(this.products).forEach(async productId => {
      const product = this.products[productId];
      const { pathToCode } = product;
      product.lastUpdated = await this.getLastDateUpdated({
        path: pathToCode,
        id: productId,
      });
    });
  }

  async getLastDateUpdated({ path }) {
    // commits are returned sorted by date in desc order
    // so we only need one commit, which is the most recent one
    const { status, data } = await this.octokit.request(
      'GET /repos/{owner}/{repo}/commits',
      {
        owner: constants.owner,
        repo: constants.repo,
        // eslint-disable-next-line camelcase
        per_page: constants.perPage,
        path,
      },
    );

    if (status === 200) {
      // data is always an array with length 1
      const { date } = data[0].commit.committer;
      return date;
    }

    return null;
  }
}

module.exports = LastUpdated;
