/* eslint-disable class-methods-use-this */
const { Octokit } = require('@octokit/core');

const constants = require('./constants');

class LastUpdated {
  constructor({ products }) {
    this.products = products;
    this.octokit = new Octokit();
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
      for (let i = 0; i < data.length; i += 1) {
        const { date, name } = data[i].commit.author;

        // Ignore update to manifest.json files by GitHUb user rjohnson2011 on 5/12/2022
        // eslint-disable-next-line no-continue
        if (this.isManifestJsonUpdate({ date: new Date(date), name })) continue;
        return date;
      }
    }

    return null;
  }

  isManifestJsonUpdate({ date, name }) {
    const dateString = `${date.getMonth() +
      1}/${date.getDate()}/${date.getFullYear()}`;
    return name === 'rjohnson2011' && dateString === '5/12/2022';
  }
}

module.exports = LastUpdated;
