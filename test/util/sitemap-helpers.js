const libxmljs = require('libxmljs');
const fetch = require('node-fetch');
const E2eHelpers = require('../util/e2e-helpers');

const SITEMAP_URL = `${E2eHelpers.baseUrl}/sitemap.xml`;
const SITEMAP_LOC_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const BUILD_BASE_URL = 'http://www.vets.gov';

function sitemapURLs(callback) {
  fetch(SITEMAP_URL)
    .then((res) => {
      return res.text();
    }).then((body) => {
      const doc = libxmljs.parseXml(body);

      const urls = doc.find('//xmlns:loc', SITEMAP_LOC_NS)
        .map(n => n.text().replace(BUILD_BASE_URL, E2eHelpers.baseUrl))
        .filter(url => !(url.endsWith('facility-locator/') || url.endsWith('auth/login/callback/')));

      callback(urls);
    }).catch(callback);
}


module.exports = { sitemapURLs };
