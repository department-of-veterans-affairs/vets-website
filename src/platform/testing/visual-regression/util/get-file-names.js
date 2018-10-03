const path = require('path');
const mkdirp = require('mkdirp');
const { baseUrl } = require('../../e2e-puppeteer/helpers');
const commandLineArgs = require('command-line-args');

const screenshotDirectory = path.join(
  __dirname,
  '../../../../../logs/visual-regression',
);
const { mobile } = commandLineArgs([
  { name: 'command', type: String },
  { name: 'config', type: String, alias: 'c' },
  { name: 'mobile', type: Boolean },
]);

const baselineDir = path.join(
  screenshotDirectory,
  '/baseline',
  mobile ? 'mobile' : 'desktop',
);
const diffDir = path.join(
  screenshotDirectory,
  '/diffs',
  mobile ? 'mobile' : 'desktop',
);

// Takes a full URL and translates that into a filename in the logs directory to store images.
function getFileNames(route) {
  const uri = route.replace(baseUrl, '');
  const baseline = path.join(baselineDir, `/${uri.slice(0, -1)}.png`);
  const diff = path.join(diffDir, `/${uri.slice(0, -1)}.png`);

  return [baseline, diff];
}

// Creates a directory if it doesn't exist already.
// Necessary when writing out the diff image.
async function createDirectoryIfNotExist(filePath) {
  const directory = path.dirname(filePath);
  return new Promise((resolve, reject) => {
    mkdirp(directory, err => (err ? reject(err) : resolve()));
  });
}

module.exports = {
  getFileNames,
  createDirectoryIfNotExist,
};
