const chalk = require('chalk');

const DRUPAL_COLORIZED_OUTPUT = chalk.rgb(73, 167, 222);

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

module.exports = {
  logDrupal,
  facilityLocationPath,
};
