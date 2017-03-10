const Timeouts = require('../util/timeouts.js');
const SitemapHelpers = require('../util/sitemap-helpers');

module.exports = {
  'sitemap 2/4': (client) => {
    SitemapHelpers.sitemapURLs(urls => {
      const mark = Math.ceil(urls.length / 4);
      const segment = urls.splice(mark, mark);

      segment.forEach(url => {
        client
          .url(url)
          .waitForElementVisible('body', Timeouts.normal)
          .axeCheck('document', { scope: url });
      });

      client.end();
    });
  }
};
