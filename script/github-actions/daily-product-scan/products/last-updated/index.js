/* eslint-disable no-console */
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

  async getLastDateUpdated({ path, id }) {
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
        data.forEach(d => {
          if (id === '07069333-cb9c-4757-8518-1c4d373efb88') {
            console.log('d.commit.committer.date', d.commit.committer.date);
          }
          commitDates.push(d.commit.committer.date);
        });

        if (headers.link) {
          page += 1;
        } else {
          moreResultsExist = false;
        }
      }
    }

    if (id === '07069333-cb9c-4757-8518-1c4d373efb88') {
      console.log('commitDates', commitDates);
      console.log(
        'LATEST DATE',
        this.getMostRecentDate({ dates: commitDates }),
      );
    }

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
