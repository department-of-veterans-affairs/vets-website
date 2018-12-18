const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');

const BUCKETS = require('../../site/constants/buckets');
const ENVIRONMENTS = require('../../site/constants/environments');
const HOSTNAMES = require('../../site/constants/hostnames');

function injectLocalBundle(buildOptions) {
  const { hostUrl: localhost } = buildOptions;
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

    vaPageHtml = vaPageHtml.replace(prodBucket, localhost);
    res.send(vaPageHtml);
  };
}

function fallbackToTeamSiteServer(buildOptions) {
  const prodDomain = `https://${HOSTNAMES[ENVIRONMENTS.VAGOVPROD]}`;

  return (req, res, next) => {
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
