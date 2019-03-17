const path = require('path');

const { PREFIXED_ENVIRONMENTS } = require('../../../constants/drupals');
const { logDrupal: log } = require('../drupal/utilities-drupal');

function overwriteConflictingVagovContentFiles(files, smith, done) {
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

    for (const vagovContentFile of [
      existingMarkdownIndexFile,
      existingMarkdownFile,
    ]) {
      if (files[vagovContentFile]) {
        log(`Overriding conflicting vagov-content file: ${vagovContentFile}`);
        delete files[vagovContentFile];
      }
    }
  }

  done();
}

function addDrupalPrefix(buildOptions) {
  const applyPrefix = PREFIXED_ENVIRONMENTS.has(buildOptions.buildtype);

  if (!applyPrefix) {
    log('DO NOT APPLY PREFIX')
    return overwriteConflictingVagovContentFiles;
  }

  return (files, smith, done) => {
    log('DO APPLY PREFIX')

    files[`drupal/index.md`] = {
      ...files['index.md'],
      path: 'drupal/index.html',
      isDrupalPage: true,
      private: true,
    };

    done();
  };
}

module.exports = addDrupalPrefix;
