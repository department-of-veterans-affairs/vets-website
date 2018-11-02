/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const mkdirp = require('mkdirp');

const environments = require('../constants/environments');
const hostnames = require('../constants/hostnames');

const createStandardRedirectHtml = require('./standard-redirect');
const createAppRedirectHtml = require('./app-redirect');

const vetsEnvToVaHost = {
  [environments.DEVELOPMENT]: hostnames[environments.VAGOVDEV],
  [environments.STAGING]: hostnames[environments.VAGOVSTAGING],
  [environments.PRODUCTION]: hostnames[environments.VAGOVPROD],
};

function generateRedirectedPages(BUILD_OPTIONS) {
  const { destination, contentPagesRoot } = BUILD_OPTIONS;

  const vaGovHostDestination = vetsEnvToVaHost[BUILD_OPTIONS.buildtype];
  const mappingsFileLocation = path.join(
    __dirname,
    '../',
    contentPagesRoot,
    '../redirects/vets-gov-to-va-gov.yml',
  );
  const mappingsFile = fs.readFileSync(mappingsFileLocation);
  const mappings = yaml.safeLoad(mappingsFile);

  for (const mapping of mappings) {
    const {
      vets_gov_src: vetsGovSrc,
      retain_path: retainPath,
    } = mapping;

    let {
      va_gov_dest: vaGovDest,
    } = mapping;

    const htmlDirectory = path.join(destination, vetsGovSrc);

    mkdirp.sync(htmlDirectory);

    const htmlFileName = path.join(htmlDirectory, 'index.html');
    let htmlFileContents = null;

    if (!vaGovDest.startsWith('http'))
      vaGovDest = `https://${vaGovHostDestination}/${vaGovDest}`;

    console.log(`Writing redirect for ${vetsGovSrc} to ${vaGovDest}`);

    if (!retainPath) {
      htmlFileContents = createStandardRedirectHtml(vaGovDest);
    } else {
      // htmlFileContents = createAppRedirectHtml(vetsGovSrc, vaGovDest);
    }

    fs.writeFileSync(htmlFileName, htmlFileContents);
  }
}

module.exports = generateRedirectedPages;
