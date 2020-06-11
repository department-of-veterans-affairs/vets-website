const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');

const BUCKETS = require('../../site/constants/buckets');
const ENVIRONMENTS = require('../../site/constants/environments');
const HOSTNAMES = require('../../site/constants/hostnames');

const VETS_WEBSITE_URL = process.env.VETS_WEBSITE_URL || 'localhost:3001';
const TEAMSITE_PROXY_HOST = process.env.TEAMSITE_PROXY_PORT || 'localhost';
const TEAMSITE_PROXY_PORT = process.env.TEAMSITE_PROXY_HOST || 3500;

const PROD_BUCKET = BUCKETS[ENVIRONMENTS.VAGOVPROD];
const PROD_DOMAIN = `https://${HOSTNAMES[ENVIRONMENTS.VAGOVPROD]}`;
const PROD_BUCKET_REGEX = new RegExp(PROD_BUCKET.replace(/\./g, '\\.'), 'g');

const CONTENT_TYPES = {
  '.json': 'application/json',
  '.css': 'text/css',
  '.js': 'application/javascript',
};

const PROXY_REWRITE_ASSET_PATHS = ['/generated/', '/fonts/'];

async function downloadAsset(req, res) {
  const existsLocally = PROXY_REWRITE_ASSET_PATHS.some(localPath =>
    req.path.startsWith(localPath),
  );
  if (existsLocally) {
    const proxied = await fetch(`http://${VETS_WEBSITE_URL}${req.path}`);
    const extension = path.extname(req.path);

    if (CONTENT_TYPES[extension]) {
      res.set('Content-Type', CONTENT_TYPES[extension]);
    }

    if (['.js', '.json', '.css'].includes(extension)) {
      res.send(await proxied.text());
    } else {
      const blob = await proxied.arrayBuffer();
      res.end(Buffer.from(blob));
    }
  } else {
    res.redirect(`${PROD_DOMAIN}${req.path}`);
  }
}

async function downloadTeamSiteHtmlPage(vaGovUrl, res) {
  const vaPageResponse = await fetch(vaGovUrl);
  let vaPageHtml = await vaPageResponse.text();

  vaPageHtml = vaPageHtml.replace(PROD_BUCKET_REGEX, '');
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

    downloadAsset(req, res);
  };
}

const app = express();

app.use(cors());
app.use(setupProxy());
app.use((error, req, res) => {
  res.json({ error });
});

module.exports = {
  app,
  port: TEAMSITE_PROXY_PORT,
  host: TEAMSITE_PROXY_HOST,
};

if (require.main === module) {
  app.listen(TEAMSITE_PROXY_PORT, TEAMSITE_PROXY_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`TeamSite listening on port ${TEAMSITE_PROXY_PORT}`);
  });
}
