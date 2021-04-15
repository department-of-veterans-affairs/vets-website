const SitemapHelpers = require('./sitemap-helpers');

module.exports = {
  'sitemap 3/4': client => {
    client.timeoutsAsyncScript(1000);
    SitemapHelpers.sitemapURLs().then(function sitemapA11yThree({
      urls,
      onlyTest508Rules,
    }) {
      const mark = Math.ceil(urls.length / 4);
      const segment = urls.splice(mark * 2, mark);
      SitemapHelpers.runTests(client, segment, onlyTest508Rules);
      client.end();
    });
  },
};
