const metalsmithSitemap = require('metalsmith-sitemap');

function createSitemaps(BUILD_OPTIONS) {
  const hostname = BUILD_OPTIONS.hostUrl;

  const metalsmithSitemapOptions = {
    hostname,
    omitIndex: true,
  };

  return (files, metalsmith, done) => {
    // generate dynamic sitemap
    metalsmithSitemap(metalsmithSitemapOptions)(files, metalsmith, done);
  };
}

module.exports = createSitemaps;
