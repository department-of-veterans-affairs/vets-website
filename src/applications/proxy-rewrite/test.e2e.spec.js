/* eslint-disable no-console */

const chalk = require('chalk');
const E2eHelpers = require('../../platform/testing/e2e/helpers');
const Timeouts = require('../../platform/testing/e2e/timeouts');
const redirects = require('./redirects/crossDomainRedirects.json');

function runTest(browser) {
  for (const redirect of redirects) {
    const { domain, src, dest } = redirect;

    const fullUrl = `https://${domain}${src}`;
    const target = encodeURIComponent(fullUrl);
    const localProxyUrl = `http://localhost:3500/?target=${target}`;

    browser
      .url(localProxyUrl)
      .waitForElementVisible('body', Timeouts.normal, () => {
        browser.pause(Timeouts.slow, () => {
          console.log(
            chalk.yellow(
              `Confirming redirect: "${localProxyUrl}" -> "${
                E2eHelpers.baseUrl
              }${dest}"...`,
            ),
          );
          browser.assert.urlContains(dest);
        });
      });
  }
}

module.exports = E2eHelpers.createE2eTest(browser => {
  browser.perform(done => {
    runTest(browser);
    done();
  });
});
