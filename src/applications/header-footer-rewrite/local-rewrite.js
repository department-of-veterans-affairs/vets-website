const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');

const BUCKETS = require('../../site/constants/buckets');
const ENVIRONMENTS = require('../../site/constants/environments');
const HOSTNAMES = require('../../site/constants/hostnames');

const vaGovCache = {};

function injectLocalBundle() {
  const prodBucket = BUCKETS[ENVIRONMENTS.VAGOVPROD];
  const prodBucketRegex = new RegExp(prodBucket.replace(/\./g, '\\.'), 'g');

  return async (req, res, next) => {
    const {
      query: { target: vaGovUrl },
    } = req;

    if (!vaGovUrl) {
      next();
      return;
    }

    if (!vaGovCache[vaGovUrl]) {
      const vaPageResponse = await fetch(vaGovUrl);
      const vaPageHtml = await vaPageResponse.text();

      vaGovCache[vaGovUrl] = vaPageHtml
        .replace(prodBucketRegex, '')
        .replace('proxy-rewrite.entry.js', 'loader.entry.js')
        .replace('styleConsolidated.css', '')
        .replace('/js/settings.js', '')
        .replace('/generated/polyfills.entry.js', '')
        .replace('/generated/vendor.entry.js', '')
        .replace('', '')
        .replace(
          '.brand-consolidation-deprecated { display: none !important; }',
          '',
        );
    }

    res.send(vaGovCache[vaGovUrl]);
  };
}

function fallbackToTeamSiteServer(buildOptions) {
  const prodDomain = `https://${HOSTNAMES[ENVIRONMENTS.VAGOVPROD]}`;

  return (req, res, next) => {
    // Webpack bundles are stored in memory, so we can't validate those
    // files by checking the local file system. Instead, we just assume
    // all Webpack-generated files will be served locally.
    if (req.path.startsWith('/generated/')) {
      /*
      if (!loaded && req.path.endsWith('proxy-rewrite.entry.js')) {
        loaded = !loaded;
        res.redirect(`/generated/header-footer-loader.entry.js`);
        return;
      }
      */
      next();
      return;
    }

    const fullFilePath = path.join(buildOptions.destination, req.path);

    fs.pathExists(fullFilePath, (err, existsOnLocalhost) => {
      if (err) {
        next(err);
      } else if (existsOnLocalhost) {
        next();
      } else {
        res.redirect(`${prodDomain}${req.path}`);
      }
    });
  };
}

function setupLocalProxyRewrite(devServer, buildOptions) {
  devServer.use(injectLocalBundle(buildOptions));
  devServer.use(fallbackToTeamSiteServer(buildOptions));
}

module.exports = setupLocalProxyRewrite;
