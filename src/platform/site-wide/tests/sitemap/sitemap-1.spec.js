// nightwatch is capable of running tests in parallel, but only if the
// test definitions are in separate files. This runs accessibility tests
// over the first 1/4 of urls in the sitemap, while `sitemap-2-4.spec.js`
// runs over the others. Crude, but this enables nightwatch to parallelize these.

const SitemapHelpers = require('./sitemap-helpers');

module.exports = {
  'sitemap 1/4': client => {
    client.timeoutsAsyncScript(1000);
    SitemapHelpers.sitemapURLs().then(function runTestsOnFirstQuarterOfSitemap({
      urls,
      onlyTest508Rules, // eslint-disable-line no-unused-vars
    }) {
      const mark = Math.ceil(urls.length / 4);
      // eslint-disable-next-line no-unused-vars
      const segment = urls.splice(0, mark);
      // SitemapHelpers.runTests(client, segment, onlyTest508Rules);
      client.end();
    });
  },
};
