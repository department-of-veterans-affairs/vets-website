const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');

const BUCKETS = require('../../../site/constants/buckets');
const ENVIRONMENTS = require('../../../site/constants/environments');
const HOSTNAMES = require('../../../site/constants/hostnames');

const prodBucket = BUCKETS[ENVIRONMENTS.VAGOVPROD];
const prodDomain = `https://${HOSTNAMES[ENVIRONMENTS.VAGOVPROD]}`;
const prodBucketRegex = new RegExp(prodBucket.replace(/\./g, '\\.'), 'g');

const contentTypes = {
  '.json': 'application/json',
  '.css': 'text/css',
  '.js': 'application/javascript',
};

const localPaths = ['/generated/', '/fonts/'];

async function downloadedTeamSiteAsset(req, res) {
  const existsLocally = localPaths.some(localPath =>
    req.path.startsWith(localPath),
  );
  if (existsLocally) {
    const proxied = await fetch(`http://localhost:3001${req.path}`);
    const extension = path.extname(req.path);

    if (contentTypes[extension]) {
      res.set('Content-Type', contentTypes[extension]);
    }

    if (['.js', '.json', '.css'].includes(extension)) {
      res.send(await proxied.text());
    } else {
      const blob = await proxied.arrayBuffer();
      res.end(Buffer.from(blob));
    }
  } else {
    res.redirect(`${prodDomain}${req.path}`);
  }
}

async function downloadTeamSiteHtmlPage(vaGovUrl, res) {
  const vaPageResponse = await fetch(vaGovUrl);
  let vaPageHtml = await vaPageResponse.text();

  vaPageHtml = vaPageHtml.replace(prodBucketRegex, '');
  res.send(vaPageHtml);
}

function setupProxy() {
  return async (req, res, next) => {
    const {
      query: { target: vaGovUrl },
    } = req;

    if (vaGovUrl) {
      downloadTeamSiteHtmlPage(vaGovUrl, res);
      return;
    }

    const isRequestForTeamSiteAsset =
      req.headers.accept && req.headers.accept !== 'application/json';

    if (isRequestForTeamSiteAsset) {
      downloadedTeamSiteAsset(req, res);
    } else {
      next();
    }
  };
}

module.exports = setupProxy;
