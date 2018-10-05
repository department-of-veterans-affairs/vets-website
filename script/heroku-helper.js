const path = require('path');
const request = require('sync-request');

function applyHerokuOptions(options) {
  // eslint-disable-next-line no-param-reassign
  options.destination = path.resolve(__dirname, '../build/heroku');
  try {
    const pullRequestNumber = process.env.HEROKU_APP_NAME.split(
      'vetsgov-pr-',
    )[1];
    const requestOptions = {
      headers: {
        'User-Agent': 'vets-website-builder',
      },
      json: true,
    };
    if (process.env.GH_TOKEN) {
      requestOptions.headers.Authorization = `token ${process.env.GH_TOKEN}`;
    }
    const res = request(
      'GET',
      `https://api.github.com/repos/department-of-veterans-affairs/vets-website/pulls/${pullRequestNumber}`,
      requestOptions,
    );
    const respObj = JSON.parse(res.getBody('utf8'));

    const branchName = respObj.head.ref;

    if (/^va-gov\/.*/.test(branchName)) {
      // eslint-disable-next-line no-console
      console.log('Build type set to vagovdev due to branch name');
      // eslint-disable-next-line no-param-reassign
      options.buildtype = 'vagovdev';
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.message);
    // eslint-disable-next-line no-console
    console.log(
      `Did not receive branch info from GitHub, falling back to ${
        options.buildtype
      } build type`,
    );
  }
}

module.exports = applyHerokuOptions;
