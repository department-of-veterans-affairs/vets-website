const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');

const BUCKETS = require('../../site/constants/buckets');
const ENVIRONMENTS = require('../../site/constants/environments');

function injectLocalBundle(buildOptions) {
  const { hostUrl } = buildOptions;
  const prodBucket = `https://${BUCKETS[ENVIRONMENTS.VAGOVPROD]}`;

  return async (req, res, next) => {
    const {
      query: { target: vaGovUrl },
    } = req;

    if (!vaGovUrl) {
      next();
      return;
    }

    req.vaGovUrl = vaGovUrl;

    const vaPageResponse = await fetch(vaGovUrl);
    let vaPageHtml = await vaPageResponse.text();

    vaPageHtml = vaPageHtml.replace(prodBucket, hostUrl);
    res.send(vaPageHtml);
  };
}

function fallbackToTeamSiteServer(buildOptions) {
  return (req, res, next) => {
    const fullFilePath = path.join(buildOptions.destination, req.path);

    fs.pathExists(fullFilePath, (err, doesExist) => {
      if (err || !doesExist) {
        res.redirect(`https://www.va.gov${req.path}`);
      } else {
        next();
      }
    });
  };
}

function setupLocalProxyRewrite(devServer, buildOptions) {
  devServer.use(injectLocalBundle(buildOptions));
  devServer.use(fallbackToTeamSiteServer(buildOptions));
}

module.exports = setupLocalProxyRewrite;
