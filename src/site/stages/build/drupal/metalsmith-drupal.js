/* eslint-disable no-param-reassign */
const chalk = require('chalk');

const ENVIRONMENTS = require('../../../constants/environments');
const getApiClient = require('./api');
const GET_ALL_PAGES = require('./get-all-pages.graphql');

const ENABLED_ENVIRONMENTS = new Set([
  ENVIRONMENTS.LOCALHOST,
  ENVIRONMENTS.VAGOVDEV,
]);

function pipeDrupalPagesIntoMetalsmith(contentData, files) {
  // Generates a Drupal index page at /drupal, which is a useful (temporary) resource
  // for checking Drupal payloads.

  const {
    data: {
      nodeQuery: { entities: pages },
    },
  } = contentData;

  let drupalIndexPage =
    '<h1>The following pages were provided by Drupal:</h1><ol>\n';

  for (const page of pages) {
    const {
      entityUrl: { path },
    } = page;

    const jsonPath = `drupal${path}.json`;

    drupalIndexPage += `<li><a href="/${jsonPath}">${path}</a></li>`;

    files[jsonPath] = {
      ...page,
      contents: Buffer.from(JSON.stringify(page, null, 4)),
    };
  }

  drupalIndexPage += '</ol>';

  files['drupal/index.html'] = {
    contents: Buffer.from(drupalIndexPage),
  };

  // eslint-disable-next-line no-console
  console.log(chalk.rgb(73, 167, 222)('Drupal index page written to /drupal.'));
}

function getDrupalContent(buildOptions) {
  const contentApi = getApiClient(buildOptions);

  // Declared above the middleware scope so that it's cached during the watch task.
  let contentData = null;

  return async (files, metalsmith, done) => {
    if (!ENABLED_ENVIRONMENTS.has(buildOptions.buildtype)) {
      done();
      return;
    }

    try {
      if (!contentData) {
        contentData = await contentApi.query({ query: GET_ALL_PAGES });
      }

      pipeDrupalPagesIntoMetalsmith(contentData, files);
    } catch (err) {
      done(err);
    }
    done();
  };
}

module.exports = getDrupalContent;
