const { XMLParser } = require('fast-xml-parser');
const fetch = require('node-fetch');
const E2eHelpers = require('../../../testing/e2e/helpers');

const SITEMAP_URL = `${E2eHelpers.baseUrl}/sitemap.xml`;
const SITEMAP_LOC_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const DOMAIN_REGEX = /http[s]?:\/\/(.*?)\//;

const pagesWithRedirects = ['/manage-va-debt/your-debt/'];

const shouldIgnore = url => {
  const parsedUrl = new URL(url);
  return (
    !url.endsWith('auth/login/callback/') &&
    !url.includes('playbook/') &&
    !url.includes('pittsburgh-health-care/') &&
    !/.*opt-out-information-sharing.*/.test(url) &&
    !pagesWithRedirects.some(redirectUrl => parsedUrl.pathname === redirectUrl)
  );
};

function parseXML(body) {
  const parser = new XMLParser();
  return parser.parse(body);
}

function sitemapURLs() {
  return fetch(SITEMAP_URL)
    .then(res => res.text())
    .then(body => parseXML(body))
    .then(doc =>
      doc
        .find('//xmlns:loc', SITEMAP_LOC_NS)
        .map(n => n.text().replace(DOMAIN_REGEX, `${E2eHelpers.baseUrl}/`))
        .filter(shouldIgnore),
    )
    .then(urls => {
      const onlyTest508Rules = [
        // 404 page contains 2 search auto-suggest elements with the same element ID,
        // which violates WCAG 2.0 standards. This element id is referenced by
        // https://search.usa.gov/assets/sayt_loader_libs.js, so if we change the ID
        // of one of the elements, search won't work.
        '/404.html',
        // This is here because aXe bug flags the custom select component on this page
        '/find-locations/',
        // This is here because an aXe bug flags the autosuggest component on this page
        '/education/gi-bill-comparison-tool/',
      ];
      // Whitelist of URLs to only test against the 'section508' rule set and not
      // the stricter 'wcag21a' rule set. For each URL added to this list, please
      // add a comment explaining why it cannot be tested against stricter rules.
      return { urls, onlyTest508Rules };
    });
}

module.exports = { sitemapURLs };
