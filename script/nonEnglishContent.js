/* eslint-disable no-console */
const libxmljs2 = require('libxmljs2');
const fetch = require('node-fetch');

const SITEMAP_URL = `http://${process.env.WEB_HOST || 'localhost'}:${process.env
  .WEB_PORT || 3001}/sitemap.xml`;
const SITEMAP_LOC_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';

const langs = ['-esp', 'espanol', '-tag'];

const filterByLanguage = url => {
  return langs.some(substring => url.includes(substring));
};

const parseNonEnglishContent = () => {
  return fetch(SITEMAP_URL)
    .then(res => {
      return res.text();
    })
    .then(body => {
      return libxmljs2.parseXmlString(body);
    })

    .then(doc =>
      doc
        .find('//xmlns:loc', SITEMAP_LOC_NS)
        .map(n => n.text())
        .filter(filterByLanguage),
    )
    .then(urls => {
      console.log(urls, 'THE NON ENGLISH CONTENT');
      console.log(urls.length, 'THE NUMBER OF PAGES');
    });
};

console.log(parseNonEnglishContent());
