/* eslint-disable no-console */

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const environments = require('../../constants/environments');
const hostnames = require('../../constants/hostnames');
const getOptions = require('../build/options');

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

  fs.removeSync(destination);

  for (const mapping of mappings) {
    const { vets_gov_src: vetsGovSrc, retain_path: retainPath } = mapping;

    const { va_gov_dest: vaGovDest } = mapping;

    const htmlDirectory = path.join(destination, vetsGovSrc);

    fs.ensureDirSync(htmlDirectory);

    const htmlFileName = path.join(htmlDirectory, 'index.html');
    let htmlFileContents = null;
    let vaGovFullPath = vaGovDest;

    if (!vaGovDest.startsWith('http'))
      vaGovFullPath = `https://${vaGovHostDestination}/${vaGovDest}`;

    console.log(`Writing redirect for ${vetsGovSrc} to ${vaGovDest}`);

    if (!retainPath) {
      htmlFileContents = createStandardRedirectHtml(vaGovFullPath);
    } else {
      htmlFileContents = createAppRedirectHtml(
        vetsGovSrc.replace(/\/$/, ''),
        vaGovDest.replace(/\/$/, ''),
        `https://${vaGovHostDestination}`,
      );
    }

    fs.writeFileSync(htmlFileName, htmlFileContents);
  }

  fs.writeFileSync(
    path.join(destination, '404.html'),
    createAppRedirectHtml('', '', `https://${vaGovHostDestination}`),
  );
}

function main() {
  const options = getOptions();
  generateRedirectedPages(options);
}

module.exports = main;
