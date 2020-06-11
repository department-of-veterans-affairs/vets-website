/* eslint-disable no-console */
const chalk = require('chalk');
const E2eHelpers = require('../../platform/testing/e2e/helpers');
const Timeouts = require('../../platform/testing/e2e/timeouts');
const redirects = require('./redirects/crossDomainRedirects.json');

const teamSiteProxy = require('./teamsite-proxy');

const teamSiteProxyUrl = `http://${teamSiteProxy.host}:${teamSiteProxy.port}`;

function runTest(browser) {
  for (const redirect of redirects) {
    const { domain, src, dest } = redirect;

    const teamSiteDomain = `https://${domain}${src}`;
    const localInjectedTeamSitePageUrl = `${teamSiteProxyUrl}/?target=${encodeURIComponent(
      teamSiteDomain,
    )}`;

    browser
      .url(localInjectedTeamSitePageUrl)
      .waitForElementVisible('body', Timeouts.normal, () => {
        browser.pause(Timeouts.slow, () => {
          console.log(
            chalk.yellow(
              `Confirming redirect: "${localInjectedTeamSitePageUrl}" -> "${
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
    const server = teamSiteProxy.app.listen(
      teamSiteProxy.port,
      teamSiteProxy.host,
      () => {
        runTest(browser);
        browser.waitForElementPresent('body', Timeouts.normal, () => {
          server.close(() => {
            done();
          });
        });
      },
    );
  });
});
