// nightwatch is capable of running tests in parallel, but only if the
// test definitions are in separate files. This runs accessibility tests
// over the first 1/4 of urls in the sitemap, while `sitemap-2-4.spec.js`
// runs over the others. Crude, but this enables nightwatch to parallelize these.

const Timeouts = require('../e2e/timeouts.js');
const SitemapHelpers = require('../e2e/sitemap-helpers');

module.exports = {
  'sitemap 1/4': (client) => {
    client.timeoutsAsyncScript(1000);
    SitemapHelpers.sitemapURLs(urls => {
      const mark = Math.ceil(urls.length / 4);
      const segment = urls.splice(0, mark);

      // Whitelist of URLs on which to only run'section508' rules and not 'wcag2a'
      // rules. Please provide an explanation for each exception.
      const wcagSkip = [
        // 404 page contains 2 search auto-suggest elements with same ID, which is
        // referenced by https://search.usa.gov/assets/sayt_loader_libs.js
        '/404.html'
      ];

      segment.forEach(url => {
        const only508 = wcagSkip.filter(skip => url.endsWith(skip)).length > 0;
        client
          .perform(() => { console.log(url); }) // eslint-disable-line no-console
          .url(url)
          .waitForElementVisible('body', Timeouts.normal)
          .axeCheck('document', only508 ?
                    { scope: url, rules: ['section508'] } :
                    { scope: url });
      });

      client.end();
    });
  }
};
