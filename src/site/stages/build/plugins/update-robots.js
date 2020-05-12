// Dependencies
const ENVIRONMENTS = require('../../../constants/environments');

function updateRobots(buildOptions) {
  // Use the default robots.txt file on production.
  if (buildOptions.buildtype === ENVIRONMENTS.VAGOVPROD) {
    // eslint-disable-next-line no-console
    console.log('Using the production robots.txt');
    return () => {};
  }

  return files => {
    // Derive the robots file.
    const robots = files['generated/robots.txt'];

    // Update the robots.txt contents to disallow crawlers.
    robots.contents = new Buffer('User-agent: *\nDisallow: /\n');

    // eslint-disable-next-line no-console
    console.log('Using the non-production robots.txt');
  };
}

module.exports = updateRobots;
