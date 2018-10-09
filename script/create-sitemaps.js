const metalsmithSitemap = require('metalsmith-sitemap');
const sitemap = require('sitemap');

function createSitemaps(BUILD_OPTIONS) {
  const hostname =
    BUILD_OPTIONS.host === 'localhost'
      ? 'http://localhost:3001'
      : BUILD_OPTIONS.host;

  const metalsmithSitemapOptions = {
    hostname,
    omitIndex: true,
  };

  return (files, metalsmith, done) => {
    if (BUILD_OPTIONS['brand-consolidation-enabled']) {
      // move dynamic sitemap from sitemap.xml to sitemap-dynamic.xml
      metalsmithSitemapOptions.output = 'sitemap-dynamic.xml';

      // generate sitemap index that references static va sitemap and dynamic metalsmith sitemap
      const sitemapIndex = sitemap.buildSitemapIndex({
        urls: [`${hostname}/sitemap-va.xml`, `${hostname}/sitemap-dynamic.xml`],
      });

      /* eslint-disable no-param-reassign */
      // output sitemap index
      files['./sitemap.xml'] = {
        /* eslint-enable */
        contents: sitemapIndex.toString(),
      };
    }
    // generate dynamic sitemap
    metalsmithSitemap(metalsmithSitemapOptions)(files, metalsmith, done);
  };
}

module.exports = createSitemaps;
