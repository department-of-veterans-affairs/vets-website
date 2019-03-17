const { PREFIXED_ENVIRONMENTS } = require('../../../constants/drupals');
const { logDrupal } = require('../drupal/utilities-drupal');

function overwriteConflictingVagovContentFiles(files, smith, done) {
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

function addDrupalPrefix(buildOptions) {
  const applyPrefix = PREFIXED_ENVIRONMENTS.has(buildOptions.buildtype);

  if (!applyPrefix) {
    logDrupal('DO NOT APPLY PREFIX')
    return () => {};
    return overwriteConflictingVagovContentFiles;
  }

  return (files, smith, done) => {
    logDrupal('DO APPLY PREFIX')
    done();
  };
}

module.exports = addDrupalPrefix;
