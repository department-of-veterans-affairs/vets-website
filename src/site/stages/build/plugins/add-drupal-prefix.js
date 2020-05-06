/* eslint-disable no-continue, no-param-reassign */

const path = require('path');

const {
  ENABLED_ENVIRONMENTS,
  PREFIXED_ENVIRONMENTS,
} = require('../../../constants/drupals');

const { logDrupal: log } = require('../drupal/utilities-drupal');

function overwriteConflictingVagovContentFiles(files) {
  for (const fileName of Object.keys(files)) {
    const file = files[fileName];

    if (!file.isDrupalPage) continue;

    const pageFileDir = path.join(path.dirname(fileName));

    const existingMarkdownIndexFile = path.join(pageFileDir, 'index.md');
    const existingMarkdownFile = path.join(
      pageFileDir,
      '..',
      `${path.basename(pageFileDir)}.md`,
    );

    const potentialConflicts = [
      existingMarkdownIndexFile,
      existingMarkdownFile,
    ];

    for (const vagovContentFile of potentialConflicts) {
      if (files[vagovContentFile]) {
        log(`Overriding conflicting vagov-content file: ${vagovContentFile}`);
        delete files[vagovContentFile];
      }
    }
  }
}

function applyPrefixToFiles(files) {
  for (const fileName of Object.keys(files)) {
    const file = files[fileName];

    if (file.isDrupalPage) {
      files[`drupal/${fileName}`] = {
        ...file,
        private: true,
      };
      delete files[fileName];
    }
  }

  files[`drupal/index.md`] = {
    ...files['index.md'],
    path: 'drupal/index.html',
    isDrupalPage: true,
    private: true,
  };
}

function addDrupalPrefix(buildOptions) {
  if (!ENABLED_ENVIRONMENTS.has(buildOptions.buildtype)) {
    return () => {};
  }

  return (files, smith, done) => {
    const applyPrefix = PREFIXED_ENVIRONMENTS.has(buildOptions.buildtype);

    if (!applyPrefix) {
      log('Drupal-generated pages set to overwrite vagov-content.');
      overwriteConflictingVagovContentFiles(files);
    } else {
      log('Applying "/drupal" prefix to the URLs of Drupal-generated pages.');
      applyPrefixToFiles(files);
    }

    done();
  };
}

module.exports = addDrupalPrefix;
