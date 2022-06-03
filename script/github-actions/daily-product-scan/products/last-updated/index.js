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
      });

      // console.log(productId);
      // console.log(product.lastUpdated);
      // console.log('');
    });
  }

  async getLastDateUpdated({ path }) {
    const commitDates = [];
    let moreResultsExist = true;
    let page = 1;

    while (moreResultsExist) {
      // eslint-disable-next-line no-await-in-loop
      const { status, headers, data } = await this.octokit.request(
        'GET /repos/{owner}/{repo}/commits',
        {
          owner: constants.owner,
          repo: constants.repo,
          // eslint-disable-next-line camelcase
          per_page: constants.perPage,
          path,
          page,
        },
      );

      if (status === 200) {
        data.forEach(d => commitDates.push(d.commit.committer.date));

        if (headers.link) {
          page += 1;
        } else {
          moreResultsExist = false;
        }
      }
    }
    // console.log('page', page);
    // console.log('commitDates.length', commitDates.length);

    return this.getMostRecentDate({ dates: commitDates });
  }

  getMostRecentDate({ dates }) {
    return dates
      .map(date => new Date(date))
      .sort()
      .slice(-1)[0];
  }
}

module.exports = LastUpdated;
