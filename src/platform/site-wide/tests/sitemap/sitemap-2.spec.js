const SitemapHelpers = require('./sitemap-helpers');

module.exports = {
  'sitemap 2/4': client => {
    client.timeoutsAsyncScript(1000);
    SitemapHelpers.sitemapURLs().then(function sitemapA11yTwo({
      urls,
      onlyTest508Rules,
    }) {
      const mark = Math.ceil(urls.length / 4);
      const segment = urls.splice(mark, mark);
      SitemapHelpers.runTests(client, segment, onlyTest508Rules);
      client.end();
    });
  },
};
