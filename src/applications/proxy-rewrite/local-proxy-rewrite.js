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
      query: { target },
    } = req;

    if (!target) {
      next();
      return;
    }

    const vaGovUrl = decodeURIComponent(target);

    if (!vaGovCache[vaGovUrl]) {
      const vaPageResponse = await fetch(vaGovUrl);
      const vaPageHtml = await vaPageResponse.text();

      vaGovCache[vaGovUrl] = vaPageHtml.replace(prodBucketRegex, '');
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

function errorHandler(error, req, res, next) {
  res.json(error);
}

function setupLocalProxyRewrite(devServer, buildOptions) {
  devServer.use(injectLocalBundle());
  devServer.use(fallbackToTeamSiteServer(buildOptions));
  devServer.use(errorHandler);
}

module.exports = setupLocalProxyRewrite;
