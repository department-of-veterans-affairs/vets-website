/* eslint-disable no-param-reassign */
const ENVIRONMENTS = require('../../../../constants/environments');
const getApiClient = require('./api');
const getAllPages = require('./getAllPages.graphql');

const ENABLED_ENVIRONMENTS = new Set([
  ENVIRONMENTS.LOCALHOST,
  ENVIRONMENTS.VAGOVDEV,
]);

function pipeApiDataIntoMetalsmith(contentData, files) {
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
}

function fetchContent(buildOptions) {
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
        contentData = await contentApi.query({ query: getAllPages });
      }

      pipeApiDataIntoMetalsmith(contentData, files);
    } catch (err) {
      done(err);
    }
    done();
  };
}

module.exports = fetchContent;
