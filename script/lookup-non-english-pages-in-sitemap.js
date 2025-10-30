/* eslint-disable no-console */
const { XMLParser } = require('fast-xml-parser');
const fetch = require('node-fetch');

const SITEMAP_URL = `http://${process.env.WEB_HOST || 'localhost'}:${process.env
  .WEB_PORT || 3001}/sitemap.xml`;
const parser = new XMLParser();

const langs = ['espanol'];
const langSuffixes = ['-esp/', '-tag/'];
// with the new language suffixes
const filterByLanguageSuffix = url => {
  return langSuffixes.some(substring => url.endsWith(substring));
};
// with the old implementation, full word `espanol` in url.
// do these urls need to be converted to use the suffix?
const filterByLanguage = url => {
  return langs.some(substring => url.includes(substring));
};

const getUrlsFromXMLDoc = doc => {
  // Handle both single URL and multiple URLs
  return Array.isArray(doc.urlset.url)
    ? doc.urlset.url.map(u => u.loc)
    : [doc.urlset.url.loc];
};

const parseNonEnglishContent = () => {
  return fetch(SITEMAP_URL)
    .then(res => {
      return res.text();
    })
    .then(body => {
      return parser.parse(body);
    })

    .then(doc => {
      return [
        ...getUrlsFromXMLDoc(doc).filter(filterByLanguage),
        ...getUrlsFromXMLDoc(doc).filter(filterByLanguageSuffix),
      ];
    });
};

parseNonEnglishContent();
