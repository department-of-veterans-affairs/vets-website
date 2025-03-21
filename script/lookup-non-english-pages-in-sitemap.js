/* eslint-disable no-console */
const { XMLParser } = require('fast-xml-parser');
const fetch = require('node-fetch');

const SITEMAP_URL = `http://${process.env.WEB_HOST || 'localhost'}:${process.env
  .WEB_PORT || 3001}/sitemap.xml`;
const SITEMAP_LOC_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';

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
  return doc.find('//xmlns:loc', SITEMAP_LOC_NS).map(n => n.text());
};

function parseXML(body) {
  const parser = new XMLParser();
  return parser.parse(body);
}

const parseNonEnglishContent = () => {
  return fetch(SITEMAP_URL)
    .then(res => {
      return res.text();
    })
    .then(body => {
      return parseXML(body);
    })

    .then(doc => {
      return [
        ...getUrlsFromXMLDoc(doc).filter(filterByLanguage),
        ...getUrlsFromXMLDoc(doc).filter(filterByLanguageSuffix),
      ];
    })
    .then(urls => {
      console.log(urls, 'THE NON ENGLISH CONTENT');
      console.log(urls.length, 'THE NUMBER OF PAGES');
    });
};

parseNonEnglishContent();
