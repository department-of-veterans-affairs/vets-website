/* eslint-disable no-console */

require('isomorphic-fetch');
const Raven = require('raven');
const commandLineArgs = require('command-line-args');
const path = require('path');
const express = require('express');
const proxy = require('express-http-proxy');
const jsesc = require('jsesc');
const createPipeline = require('../src/site/stages/preview');

const getDrupalClient = require('../src/site/stages/build/drupal/api');
const {
  compilePage,
  createFileObj,
} = require('../src/site/stages/build/drupal/page');
const ENVIRONMENTS = require('../src/site/constants/environments');
const HOSTNAMES = require('../src/site/constants/hostnames');
const DRUPALS = require('../src/site/constants/drupals');

const defaultBuildtype = ENVIRONMENTS.LOCALHOST;
const defaultHost = HOSTNAMES[defaultBuildtype];
const defaultContentDir = '../../../../../vagov-content/pages';

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  {
    name: 'buildtype',
    type: String,
    defaultValue: process.env.PREVIEW_BUILD_TYPE || defaultBuildtype,
  },
  { name: 'buildpath', type: String, defaultValue: null },
  { name: 'host', type: String, defaultValue: defaultHost },
  { name: 'port', type: Number, defaultValue: process.env.PORT || 3001 },
  { name: 'entry', type: String, defaultValue: null },
  { name: 'protocol', type: String, defaultValue: 'http' },
  { name: 'destination', type: String, defaultValue: null },
  { name: 'content-directory', type: String, defaultValue: defaultContentDir },
  { name: 'accessibility', type: Boolean, defaultValue: true },
  { name: 'lint-plain-language', type: Boolean, defaultValue: false },
  { name: 'omitdebug', type: Boolean, defaultValue: false },
  {
    name: 'drupal-address',
    type: String,
    defaultValue: process.env.DRUPAL_ADDRESS,
  },
  {
    name: 'drupal-user',
    type: String,
    defaultValue: process.env.DRUPAL_USERNAME,
  },
  {
    name: 'drupal-password',
    type: String,
    defaultValue: process.env.DRUPAL_PASSWORD,
  },
];

if (process.env.SENTRY_DSN) {
  Raven.config(process.env.SENTRY_DSN).install();
}

const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);

if (options.buildpath === null) {
  options.buildpath = `build/${options.buildtype}`;
}

const app = express();
const drupalClient = getDrupalClient(options);

const urls = {
  [ENVIRONMENTS.LOCALHOST]: 'http://localhost:3001',
  [ENVIRONMENTS.VAGOVDEV]:
    'http://dev.va.gov.s3-website-us-gov-west-1.amazonaws.com',
  [ENVIRONMENTS.VAGOVSTAGING]:
    'http://staging.va.gov.s3-website-us-gov-west-1.amazonaws.com',
  [ENVIRONMENTS.VAGOVPROD]:
    'http://www.va.gov.s3-website-us-gov-west-1.amazonaws.com',
};

if (process.env.SENTRY_DSN) {
  app.use(Raven.requestHandler());
}

/**
 * Make the query params case-insensitive.
 */
app.use((req, res, next) => {
  // eslint-disable-next-line fp/no-proxy
  req.query = new Proxy(req.query, {
    get: (target, name) =>
      target[
        Object.keys(target).find(
          key => key.toLowerCase() === name.toLowerCase(),
        )
      ],
  });

  next();
});

// eslint-disable-next-line no-unused-vars
app.get('/error', (req, res) => {
  throw new Error('fake error');
});

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.get('/preview', async (req, res, next) => {
  try {
    const smith = await createPipeline({
      ...options,
      isPreviewServer: true,
      port: process.env.PORT || 3001,
    });

    const requests = [
      drupalClient.getLatestPageById(req.query.nodeId),
      fetch(`${urls[options.buildtype]}/generated/file-manifest.json`).then(
        resp => {
          if (resp.ok) {
            return resp.json();
          }
          throw new Error(
            `HTTP error when fetching manifest: ${resp.status} ${
              resp.statusText
            }`,
          );
        },
      ),

      fetch(`${urls[options.buildtype]}/generated/headerFooter.json`).then(
        resp => {
          if (resp.ok) {
            return resp.json();
          }
          throw new Error(
            `HTTP error when fetching header/footer data: ${resp.status} ${
              resp.statusText
            }`,
          );
        },
      ),
    ];

    const [drupalData, fileManifest, headerFooterData] = await Promise.all(
      requests,
    );

    if (drupalData.errors) {
      throw new Error(
        `Drupal errors: ${JSON.stringify(drupalData.errors, null, 2)}`,
      );
    }

    if (!drupalData.data.nodes.entities.length) {
      res.sendStatus(404);
      return;
    }

    const drupalPage = drupalData.data.nodes.entities[0];
    const drupalPath = `${req.path.substring(1)}/index.html`;

    if (!drupalPage.entityBundle) {
      if (process.env.SENTRY_DSN) {
        Raven.captureMessage('Preview attempted on page that is not ready');
      }

      res.send(`
        <p>This page isn't ready to be previewed yet.
          This may mean development is still in progress or that there's an issue with the preview server.
        </p>
      `);
      return;
    }

    const compiledPage = compilePage(drupalPage, drupalData);
    const fullPage = createFileObj(
      compiledPage,
      `${compiledPage.entityBundle}.drupal.liquid`,
    );

    const headerFooterDataSerialized = jsesc(JSON.stringify(headerFooterData), {
      json: true,
      isScriptContext: true,
    });

    const files = {
      'generated/file-manifest.json': {
        path: 'generated/file-manifest.json',
        contents: Buffer.from(JSON.stringify(fileManifest)),
      },
      [drupalPath]: {
        ...fullPage,
        isPreview: true,
        headerFooterData: headerFooterDataSerialized,
        drupalSite:
          DRUPALS.PUBLIC_URLS[options['drupal-address']] ||
          options['drupal-address'],
      },
    };

    smith.run(files, (err, newFiles) => {
      if (err) {
        next(err);
      } else {
        res.set('Content-Type', 'text/html');
        res.send(newFiles[drupalPath].contents);
      }
    });
  } catch (err) {
    next(err);
  }
});

if (options.buildtype !== ENVIRONMENTS.LOCALHOST) {
  app.use(proxy(urls[options.buildtype]));
} else {
  app.use(express.static(path.join(__dirname, '..', options.buildpath)));
}

if (process.env.SENTRY_DSN) {
  app.use(Raven.errorHandler());
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.send(`
    <p>We're sorry, something went wrong when trying to preview that page.</p>
    <p>Error id: ${res.sentry}</p>
    <pre>${options.buildtype !== ENVIRONMENTS.VAGOVPROD ? err : ''}</pre>
  `);
});

app.listen(options.port, () => {
  console.log(`Content preview server running on port ${options.port}`);
});
