const path = require('path');
const fs = require('fs-extra');
const dfns = require('date-fns');
const fetch = require('node-fetch');
const { warn, error, success, debug } = require('../utils');

const cwd = process.cwd();

const buildLocalhostPath = './build/localhost/data/cms/vamc-ehr.json';

const urlForStagingVamcDSOT = 'https://staging.va.gov/data/cms/vamc-ehr.json';
const pathToSaveData = path.join(cwd, buildLocalhostPath);

const amount = 14;
const twoWeeksAgo = dfns.subDays(new Date(), amount);

/**
 * write object as JSON to local file path
 *
 * @param {Object | Array} data - object to write to file as JSON
 * @param {string} filepath - absolute path to file
 */
const writeJsonFile = (data, filepath) => {
  fs.ensureFileSync(filepath);
  fs.writeFile(filepath, JSON.stringify(data), err => {
    if (err) {
      error(`❌ Could not save file ${filepath}`);
      error(err);
      return;
    }
    success(`✅ File Saved: ${filepath}`);
  });
};

/**
 * request JSON file from url and write to local file path
 *
 * @param {string} url - public url to json file
 * @param {string} filepath - absolute path to file
 * @returns {void}
 */
const requestAndSaveFile = (url, filepath) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch(url, options).then(res => {
    if (res.status !== 200) {
      error(`Could not access JSON data at ${url}`);
      warn(`Error Status Code: ${res.status}`);
      return;
    }
    res
      .json()
      .then(data => writeJsonFile(data, filepath))
      .catch(err => error(err));
  });
};

/**
 * create local drupal vamc data if it doesn't exist or is older than 2 weeks
 *  | See: [Platform Docs](https://depo-platform-documentation.scrollhelp.site/developer-docs/how-to-opt-in-to-drupal-as-the-source-of-truth-for)
 *  | Or [related issue](https://github.com/department-of-veterans-affairs/va.gov-team/issues/54395)
 *
 * @returns {boolean}
 */
const mockLocalDSOT = () => {
  try {
    if (fs.existsSync(pathToSaveData)) {
      debug('🚀 FILE EXISTS... NOT POPULATING');
      const fileCreationDate = fs.statSync(pathToSaveData).mtime;
      const isOlderThanTwoWeeks = dfns.isBefore(fileCreationDate, twoWeeksAgo);

      if (isOlderThanTwoWeeks) {
        debug('FILE EXISTS BUT IS OLDER THAN 2 WEEKS... POPULATING');
        requestAndSaveFile(urlForStagingVamcDSOT, pathToSaveData);
        return true;
      }
      return true;
    }

    debug('FILE DOES NOT EXIST... POPULATING');
    requestAndSaveFile(urlForStagingVamcDSOT, pathToSaveData);
    return true;
  } catch (err) {
    error(err);
    process.exit(1);
    return false;
  }
};

module.exports = mockLocalDSOT;
