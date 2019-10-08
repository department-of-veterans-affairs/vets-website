const chalk = require('chalk');
const crypto = require('crypto');

const DRUPAL_COLORIZED_OUTPUT = chalk.rgb(73, 167, 222);
const { queries, getQuery } = require('./queries');

// eslint-disable-next-line no-console
const logDrupal = message => console.log(DRUPAL_COLORIZED_OUTPUT(message));

function facilityLocationPath(regionPath, apiId, nickname) {
  let facilityPath;
  if (nickname) {
    facilityPath = nickname.replace(/\s+/g, '-').toLowerCase();
  } else {
    facilityPath = apiId;
  }

  return `${regionPath}/locations/${facilityPath}`;
}

function getDrupalCacheKey(env) {
  const hash = crypto
    .createHash('md5')
    .update(getQuery(queries.GET_ALL_PAGES))
    .digest('hex');

  return `${env}_${hash}`;
}

function getRelatedHubByPath(link, pages) {
  const hub = pages.filter(page => {
    // Careful: Some pages are empty objects, and breadcrumbs are in flux.
    if (page.entityUrl && page.entityUrl !== null) {
      return (
        page.entityUrl.path === link.link.url.path &&
        page.entityBundle === 'landing_page'
      );
    }
    return false;
  });

  // We'll only ever have one related hub.
  return hub[0];
}

module.exports = {
  logDrupal,
  facilityLocationPath,
  getDrupalCacheKey,
  getRelatedHubByPath,
};
