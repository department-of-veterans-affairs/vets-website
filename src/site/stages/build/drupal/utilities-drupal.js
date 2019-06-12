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

module.exports = {
  logDrupal,
  facilityLocationPath,
  getDrupalCacheKey,
};
