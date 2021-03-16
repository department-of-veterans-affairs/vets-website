/* eslint-disable no-param-reassign */
const path = require('path');
const cheerio = require('cheerio');
const addNonceToScripts = require('./add-nonce-to-scripts');
const processEntryNames = require('./process-entry-names');
const updateExternalLinks = require('./update-external-links');
const addSubheadingsIds = require('./add-id-to-subheadings');
const checkBrokenLinks = require('./check-broken-links');
const injectAxeCore = require('./inject-axe-core');

const getDomModifiers = BUILD_OPTIONS => {
  if (BUILD_OPTIONS.liquidUnitTestingFramework) {
    return [
      processEntryNames,
      updateExternalLinks,
      addSubheadingsIds,
      injectAxeCore,
    ];
  }

  return [
    addNonceToScripts,
    processEntryNames,
    updateExternalLinks,
    addSubheadingsIds,
    checkBrokenLinks,
    injectAxeCore,
  ];
};

const modifyDom = BUILD_OPTIONS => files => {
  const domModifiers = getDomModifiers(BUILD_OPTIONS);

  for (const modifier of domModifiers) {
    if (modifier.initialize) {
      modifier.initialize(BUILD_OPTIONS, files);
    }
  }

  // Store only one `file.dom` in memory at a time
  // because storing the virtual DOM of every .html file in memory
  // at once would cause a massive amount of memory to be consumed.
  for (const [fileName, file] of Object.entries(files)) {
    if (path.extname(fileName) === '.html') {
      file.dom = cheerio.load(file.contents);
      for (const modifier of domModifiers) {
        modifier.modifyFile(fileName, file, files, BUILD_OPTIONS);
      }
      if (file.modified) {
        file.contents = Buffer.from(file.dom.html());
      }
      delete file.dom;
    }
  }

  for (const modifier of domModifiers) {
    if (modifier.conclude) {
      modifier.conclude(BUILD_OPTIONS, files);
    }
  }
};

module.exports = modifyDom;
