// Builds the site using Metalsmith as the top-level build runner.
const path = require('path');
const Metalsmith = require('metalsmith');
const archive = require('metalsmith-archive');
const assets = require('metalsmith-assets');
const blc = require('metalsmith-broken-link-checker');
const collections = require('metalsmith-collections');
const dateInFilename = require('metalsmith-date-in-filename');
const define = require('metalsmith-define');
const filenames = require('metalsmith-filenames');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const liquid = require('tinyliquid');
const markdown = require('metalsmith-markdownit');
const moment = require('moment');
const navigation = require('metalsmith-navigation');
const permalinks = require('metalsmith-permalinks');
const redirect = require('metalsmith-redirect');
const sitemap = require('metalsmith-sitemap');
const watch = require('metalsmith-watch');
const webpack = require('./metalsmith-webpack').webpackPlugin;
const webpackConfigGenerator = require('../config/webpack.config');
const webpackDevServer = require('./metalsmith-webpack').webpackDevServerPlugin;
const createBuildSettings = require('./create-build-settings');
const createRedirects = require('./create-redirects');
const nonceTransformer = require('./metalsmith/nonceTransformer');
const {
  getRoutes,
  getWebpackEntryPoints,
  getAppManifests
} = require('./manifest-helpers.js');

const BUILD_OPTIONS = require('./options');

const smith = Metalsmith(__dirname); // eslint-disable-line new-cap
const manifests = getAppManifests(path.join(__dirname, '..'));

let manifestsToBuild = manifests;
if (BUILD_OPTIONS.entry) {
  const entryNames = BUILD_OPTIONS.entry.split(',').map(name => name.trim());
  manifestsToBuild = manifests
    .filter(manifest => entryNames.includes(manifest.entryName));
}

const webpackConfig = webpackConfigGenerator(
  BUILD_OPTIONS,
  getWebpackEntryPoints(manifestsToBuild)
);

// Custom liquid filter(s)
liquid.filters.humanizeDate = (dt) => moment(dt).format('MMMM D, YYYY');

// Set up Metalsmith. BE CAREFUL if you change the order of the plugins. Read the comments and
// add comments about any implicit dependencies you are introducing!!!
//
smith.source(`${BUILD_OPTIONS.contentRoot}/pages`);
smith.destination(BUILD_OPTIONS.destination);

// This lets us access the {{buildtype}} variable within liquid templates.
smith.metadata({
  buildtype: BUILD_OPTIONS.buildtype,
  mergedbuild: !!BUILD_OPTIONS['brand-consolidation-enabled'] // @deprecated - We use a separate Metalsmith directory for VA.gov. We shouldn't ever need this info in Metalsmith files.
});

// To block an app from production add the following to the below list:
//  ignoreList.push('<path-to-content-file>');
const ignore = require('metalsmith-ignore');

const ignoreList = [];
if (BUILD_OPTIONS.buildtype === 'production') {
  manifests.filter(m => !m.production).forEach(m => {
    ignoreList.push(m.contentPage);
  });
  ignoreList.push('veteran-id-card/how-to-get.md');
  ignoreList.push('veteran-id-card/how-to-upload-photo.md');
}
smith.use(ignore(ignoreList));

// This adds the filename into the "entry" that is passed to other plugins. Without this errors
// during templating end up not showing which file they came from. Load it very early in in the
// plugin chain.
smith.use(filenames());

smith.use(define({
  // Does anything even look at `site`?
  site: require('../config/site'),
  buildtype: BUILD_OPTIONS.buildtype
}));

smith.use(collections(BUILD_OPTIONS.collections));
smith.use(dateInFilename(true));
smith.use(archive());  // TODO(awong): Can this be removed?

if (BUILD_OPTIONS.watch) {
  smith.use(watch({
    paths: {
      [`${BUILD_OPTIONS.contentRoot}/**/*`]: '**/*.{md,html}'
    },
    livereload: true
  }));

  const appRewrites = getRoutes(manifests).map(url => {
    return {
      from: `^${url}(.*)`,
      to: `${url}/`
    };
  }).sort((a, b) => b.from.length - a.from.length);

  // If in watch mode, assume hot reloading for JS and use webpack devserver.
  const devServerConfig = {
    contentBase: BUILD_OPTIONS.destination,
    historyApiFallback: {
      rewrites: [
        ...appRewrites,
        { from: '^/(.*)', to(context) { return context.parsedUrl.pathname; } }
      ],
    },
    hot: true,
    port: BUILD_OPTIONS.port,
    publicPath: '/generated/',
    host: BUILD_OPTIONS.host,
    'public': BUILD_OPTIONS.public || undefined,
    stats: {
      colors: true,
      assets: false,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      entrypoints: false,
      children: false,
      modules: false,
      warnings: true
    }
  };

  // Route all API requests through webpack's node-http-proxy
  // Useful for local development.
  try {
    // Check to see if we have a proxy config file
    // eslint-disable-next-line import/no-unresolved
    const api = require('../config/config.proxy.js').api;
    devServerConfig.proxy = {
      '/api/v0/*': {
        target: `https://${api.host}/`,
        auth: api.auth,
        secure: true,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        rewrite: function rewrite(req) {
          /* eslint-disable no-param-reassign */
          req.headers.host = api.host;
          /* eslint-enable no-param-reassign */
        }
      }
    };
    // eslint-disable-next-line no-console
    console.log('API proxy enabled');
  } catch (e) {
    // No proxy config file found.
  }

  smith.use(webpackDevServer(webpackConfig, devServerConfig));
} else {
  // Broken link checking does not work well with watch. It continually shows broken links
  // for permalink processed files. Only run outside of watch mode.

  smith.use(webpack(webpackConfig));
}

smith.use(assets(BUILD_OPTIONS.assets));

// Webpack paths are absolute, convert to relative
smith.use((files, metalsmith, done) => {
  Object.keys(files).forEach((file) => {
    if (file.indexOf(BUILD_OPTIONS.destination) === 0) {
      /* eslint-disable no-param-reassign */
      files[file.substr(BUILD_OPTIONS.destination.length + 1)] = files[file];
      delete files[file];
      /* eslint-enable no-param-reassign */
    }
  });

  done();
});

// smith.use(cspHash({ pattern: ['js/*.js', 'generated/*.css', 'generated/*.js'] }))

// Liquid substitution must occur before markdown is run otherwise markdown will escape the
// bits of liquid commands (eg., quotes) and break things.
//
// Unfortunately this must come before permalinks and navgation because of limitation in both
// modules regarding what files they understand. The consequence here is that liquid templates
// *within* a single file do NOT have access to the final path that they will be rendered under
// or any other metadata added by the permalinks() and navigation() filters.
//
// Thus far this has not been a problem because the only references to such paths are in the
// includes which are handled by the layout module. The layout module, luckily, can be run
// near the end of the filter chain and therefore has access to all the metadata.
//
// If this becomes a barrier in the future, permalinks should be patched to understand
// translating .md files which would allow inPlace() and markdown() to be moved under the
// permalinks() and navigation() filters making the variable stores uniform between inPlace()
// and layout().
smith.use(inPlace({ engine: 'liquid', pattern: '*.{md,html}' }));
smith.use(markdown({
  typographer: true,
  html: true
}));

// Responsible for create permalink structure. Most commonly used change foo.md to foo/index.html.
//
// This must come before navigation module, otherwise breadcrunmbs will see the wrong URLs.
//
// It also must come AFTER the markdown() module because it only recognizes .html files. See
// comment above the inPlace() module for explanation of effects on the metadata().
smith.use(permalinks({
  relative: false,
  linksets: [{
    match: { collection: 'posts' },
    pattern: ':date/:slug'
  }]
}));

smith.use(navigation({
  navConfigs: {
    sortByNameFirst: true,
    breadcrumbProperty: 'breadcrumb_path',
    pathProperty: 'nav_path',
    includeDirs: true
  },
  navSettings: {}
}));

smith.use(layouts({
  engine: 'liquid',
  directory: `${BUILD_OPTIONS.contentRoot}/layouts/`,
  // Only apply layouts to markdown and html files.
  pattern: '**/*.{md,html}'
}));

// TODO(awong): This URL needs to change based on target environment.
smith.use(sitemap({
  hostname: 'https://www.vets.gov',
  omitIndex: true
}));

if (!BUILD_OPTIONS.watch && !(process.env.CHECK_BROKEN_LINKS === 'no')) {
  smith.use(blc({
    allowRedirects: true,  // Don't require trailing slash for index.html links.
    warn: false,           // Throw an Error when encountering the first broken link not just a warning.
    allowRegex: new RegExp(
      ['/education/gi-bill/post-9-11/ch-33-benefit',
        '/employment/commitments',
        '/employment/employers',
        '/employment/job-seekers/create-resume',
        '/employment/job-seekers/search-jobs',
        '/employment/job-seekers/skills-translator',
        '/gi-bill-comparison-tool/',
        '/education/apply-for-education-benefits/application',
        '/pension/application/527EZ',
        '/burials-and-memorials/application/530',
        '/health-care/apply/application',
        '/health-care/apply-for-health-care-form-10-10ez',
        '/veteran-id-card/apply',
        '/veteran-id-card/how-to-get',
        '/download-va-letters/letters',
        '/education/apply-for-gi-bill-form-1990/',
        '/education/survivor-dependent-benefits/apply-for-dependent-benefits-form-22-5490/',
        '/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e/',
        '/education/other-va-education-benefits/national-call-to-service-program/apply-for-benefits-under-ncs-form-1990n/',
        '/education/change-gi-bill-benefits/request-change-form-22-1995/',
        '/education/change-gi-bill-benefits/dependent-request-change-form-22-5495/',
      ].join('|'))
  }));
}

if (!['development', 'vagovdev'].includes(BUILD_OPTIONS.buildtype)) {

  // In non-development modes, we add hashes to the names of asset files in order to support
  // cache busting. That is done via WebPack, but WebPack doesn't know anything about our HTML
  // files, so we have to replace the references to those files in HTML and CSS files after the
  // rest of the build has completed. This is done by reading in a manifest file created by
  // WebPack that maps the original file names to their hashed versions. Metalsmith actions
  // are passed a list of files that are included in the build. Those files are not yet written
  // to disk, but the contents are held in memory.

  smith.use((files, metalsmith, done) => {
    // Read in the data from the manifest file.
    const manifestKey = Object.keys(files).find((filename) => {
      return filename.match(/file-manifest.json$/) !== null;
    });

    const originalManifest = JSON.parse(files[manifestKey].contents.toString());

    // The manifest contains the original filenames without the addition of .entry
    // on the JS files. This finds all of those and modifies them to add .entry.
    const manifest = {};
    Object.keys(originalManifest).forEach((originalManifestKey) => {
      const matchData = originalManifestKey.match(/(.*)\.js$/);
      if (matchData !== null) {
        const newKey = `${matchData[1]}.entry.js`;
        manifest[newKey] = originalManifest[originalManifestKey];
      } else {
        manifest[originalManifestKey] = originalManifest[originalManifestKey];
      }
    });

    // For each file in the build, if it is a HTML or CSS file, loop over all
    // the keys in the manifest object and do a search and replace for the
    // key with the value.
    Object.keys(files).forEach((filename) => {
      if (filename.match(/\.(html|css)$/) !== null) {
        Object.keys(manifest).forEach((originalAssetFilename) => {
          const newAssetFilename = manifest[originalAssetFilename].replace('/generated/', '');
          const file = files[filename];
          const contents = file.contents.toString();
          const regex = new RegExp(originalAssetFilename, 'g');
          file.contents = new Buffer(contents.replace(regex, newAssetFilename));
        });
      }
    });
    done();
  });
}

/*
Redirects locally. DevOps must update Nginx config for production
*/
smith.use(redirect({
  '/2015/11/11/why-we-are-designing-in-beta.html': '/2015/11/11/why-we-are-designing-in-beta/',
  '/education/apply-for-education-benefits/': '/education/apply/'
}));

// Pages can contain an "alias" property in their metadata, which is processed into
// separate pages that will each redirect to the original page.
smith.use(createRedirects(BUILD_OPTIONS));

/*
Add nonce attribute with substition string to all inline script tags
Convert onclick event handles into nonced script tags
*/
smith.use(nonceTransformer);

/* eslint-disable no-console */
smith.build((err) => {
  if (err) throw err;

  createBuildSettings(BUILD_OPTIONS);

  if (BUILD_OPTIONS.watch) {
    console.log('Metalsmith build finished!  Starting webpack-dev-server...');
  } else {
    console.log('Build finished!');
  }
});
