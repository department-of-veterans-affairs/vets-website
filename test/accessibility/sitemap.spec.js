const libxmljs = require('libxmljs');
const fetch = require('node-fetch');
const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');

const SITEMAP_URL = `${E2eHelpers.baseUrl}/sitemap.xml`;
const SITEMAP_LOC_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const BUILD_BASE_URL = 'http://www.vets.gov';

let sitemapURLs = [];

module.exports = {
  before: (client, done) => {
    // Load sitemap urls by loading and parsing the sitemap
    fetch(SITEMAP_URL)
      .then((res) => {
        return res.text();
      }).then((body) => {
        const doc = libxmljs.parseXml(body);

        sitemapURLs = doc.find('//xmlns:loc', SITEMAP_LOC_NS)
          .map(n => n.text().replace(BUILD_BASE_URL, E2eHelpers.baseUrl));

        done();
      }).catch(done);
  },

  'test accesssibility': (client) => {
    // Iterate through each of the sitemap urls run the axe checks
    if (!sitemapURLs.length) {
      this.verify.fail('No URLs found in sitemap');
    }

    sitemapURLs.forEach(url => {
      // TODO(@jkassemi): When @bshyong completes new FL remove this exclusion
      if (url.endsWith('facility-locator/index.html')) {
        return;
      }

      client
        .url(url)
        .waitForElementVisible('body', Timeouts.normal)
        .axeCheck('document', { scope: url });
    });

    client.end();
  }
};
