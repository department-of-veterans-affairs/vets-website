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
    Object.keys(this.products).forEach(async (productId, i) => {
      if (i === 0) {
        const product = this.products[productId];
        const { pathToCode } = product;
        product.lastUpdated = await this.getLastDateUpdated({
          path: pathToCode,
        });
        // console.log(product.lastUpdated);
      }
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

    // console.log('commitDates', commitDates);
    // console.log('number of commits', commitDates.length);
    // return this.getMostRecentDate({ dates: commitDates });
  }

  // getCommits({ path, page }) {
  //   this.octokit
  //     .request('GET /repos/{owner}/{repo}/commits', {
  //       owner: constants.owner,
  //       repo: constants.repo,
  //       // eslint-disable-next-line camelcase
  //       per_page: constants.perPage,
  //       path,
  //       page,
  //     })
  //     .then(response => {
  //       console.log("I'M IN RESPONSE");
  //       return response;
  //     })
  //     .catch(_ => {
  //       console.log("I'M IN CATCH");
  //       return { status: 400 };
  //     });
  // }

  // async getLastDateUpdated({ path }) {
  //   const commitDates = [];
  //   let moreResultsExist = true;
  //   let page = 1;

  //   while (moreResultsExist) {
  //     const { status, headers, data } = this.getCommits({ path, page });

  //     if (status === 200) {
  //       data.forEach(d => commitDates.push(d.commit.committer.date));

  //       if (headers.link) {
  //         page += 1;
  //       } else {
  //         moreResultsExist = false;
  //       }
  //     }
  //   }

  //   console.log('commitDates', commitDates);
  //   console.log('number of commits', commitDates.length);
  //   return this.getMostRecentDate({ dates: commitDates });
  // }

  // getCommits({ path, page }) {
  //   this.octokit
  //     .request('GET /repos/{owner}/{repo}/commits', {
  //       owner: constants.owner,
  //       repo: constants.repo,
  //       // eslint-disable-next-line camelcase
  //       per_page: constants.perPage,
  //       path,
  //       page,
  //     })
  //     .then(response => {
  //       console.log("I'M IN RESPONSE");
  //       return response;
  //     })
  //     .catch(_ => {
  //       console.log("I'M IN CATCH");
  //       return { status: 400 };
  //     });
  // }

  // blarg

  // getCommits({ path, page }) {
  //   const request = new Promise((res, rej) => {
  //     async function get() {
  //       try {
  //         const response = await this.octokit.request(
  //           'GET /repos/{owner}/{repo}/commits',
  //           {
  //             owner: constants.owner,
  //             repo: constants.repo,
  //             // eslint-disable-next-line camelcase
  //             per_page: constants.perPage,
  //             path,
  //             page,
  //           },
  //         );

  //         res(response);
  //       } catch {
  //         rej();
  //       }
  //     }

  //     get();
  //   });

  //   request
  //     .then(res => {
  //       return res;
  //     })
  //     .catch(_ => {
  //       return { status: 400 };
  //     });
  // }

  // async getCommits({ path, page }) {
  //   const request = new Promise((res, rej) => {
  //     try {
  //       const response = this.octokit.request(
  //         'GET /repos/{owner}/{repo}/commits',
  //         {
  //           owner: constants.owner,
  //           repo: constants.repo,
  //           // eslint-disable-next-line camelcase
  //           per_page: constants.perPage,
  //           path,
  //           page,
  //         },
  //       );
  //       res(response);
  //     } catch (_) {
  //       rej();
  //     }
  //   });

  //   request
  //     .then(res => {
  //       return res;
  //     })
  //     .catch(_ => {
  //       return { status: 400 };
  //     });
  // }

  getMostRecentDate({ dates }) {
    return dates
      .map(date => new Date(date))
      .sort()
      .slice(-1)[0];
  }
}

module.exports = LastUpdated;
