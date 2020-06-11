const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');
const commandLineArgs = require('command-line-args');

const BUCKETS = require('../../../site/constants/buckets');
const ENVIRONMENTS = require('../../../site/constants/environments');
const HOSTNAMES = require('../../../site/constants/hostnames');

const PROD_BUCKET = BUCKETS[ENVIRONMENTS.VAGOVPROD];
const PROD_DOMAIN = `https://${HOSTNAMES[ENVIRONMENTS.VAGOVPROD]}`;
const PROD_BUCKET_REGEX = new RegExp(PROD_BUCKET.replace(/\./g, '\\.'), 'g');

const OPTIONS_DEFINITIONS = [
  {
    name: 'webpack-server-hostname',
    type: String,
    defaultValue: 'http://localhost:3001',
  },
  { name: 'port', type: String, defaultValue: '3500' },
  { name: 'host', type: String, defaultValue: 'localhost' },
];

const COMMAND_ARGS = commandLineArgs(OPTIONS_DEFINITIONS);

const contentTypes = {
  '.json': 'application/json',
  '.css': 'text/css',
  '.js': 'application/javascript',
};

const localPaths = ['/generated/', '/fonts/'];

async function downloadAsset(req, res) {
  const existsLocally = localPaths.some(localPath =>
    req.path.startsWith(localPath),
  );
  if (existsLocally) {
    const proxied = await fetch(
      `${COMMAND_ARGS['webpack-server-hostname']}${req.path}`,
    );
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

if (require.main === module) {
  app.listen(COMMAND_ARGS.port, COMMAND_ARGS.host, () => {
    // eslint-disable-next-line no-console
    console.log(`TeamSite listening on port ${COMMAND_ARGS.port}`);
  });
}
