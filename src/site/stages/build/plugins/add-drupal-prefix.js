const path = require('path');

const { PREFIXED_ENVIRONMENTS } = require('../../../constants/drupals');
const { logDrupal: log } = require('../drupal/utilities-drupal');

function writeDrupalDebugPage(files) {
  log('Drupal debug page written to /drupal/debug.');

  const drupalPages = Object.keys(files)
    .filter(fileName => files[fileName].isDrupalPage)
    .map(fileName => `<li><a href="/${fileName}">${fileName}</a></li>`)
    .join('');

  const drupalIndex = `
    <h1>The following pages were provided by Drupal:</h1>
    <ol>${drupalPages}</ol>
  `;

  files['drupal/debug/index.html'] = {
    contents: Buffer.from(drupalIndex),
    isDrupalPage: true
  };

  console.log('SDKJFHSDFJKSH FKSJDFHDKSHFS ')
}

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
        // Maintain a reference, for the broken-link checker
        file.overwrittenVagovContentPage = files[vagovContentFile];
        delete files[vagovContentFile];
      }
    }
  }
}

function rewriteDrupalPages(files) {
  for (const fileName of files) {
    const file = files[fileName];

    if (file.isDrupalPage) {
      files[`drupal/${fileName}`] = file;
      delete[fileName];
    }
  }

  const replacements = Object.keys(files)
    .filter(fileName => files[fileName].isDrupalPage)
    .map(fileName => ({
      from: `"/${fileName.replace('index.html', '')}"`,
      to: `"/drupal/${fileName.replace('index.html', '')}"`,
    }));

  Object.keys(files)
    .filter(
      fileName => fileName.endsWith('html') && files[fileName].isDrupalPage,
    )
    .forEach(fileName => {
      const file = files[fileName];
      let contents = file.contents.toString();
      replacements.forEach(domain => {
        const regex = new RegExp(domain.from, 'g');
        contents = contents.replace(regex, domain.to);
      });

      file.contents = new Buffer(contents);
    });
}

function addDrupalPrefix(buildOptions) {
  return (files, smith, done) => {
    const applyPrefix = PREFIXED_ENVIRONMENTS.has(buildOptions.buildtype);

    if (!applyPrefix) {
      log('Drupal-generated pages set to overwrite vagov-content.');
      overwriteConflictingVagovContentFiles(files);
    } else {
      log('Applying "/drupal" prefix to the URLs of Drupal-generated pages.')
      rewriteDrupalPages(files);
      files[`drupal/index.md`] = {
        ...files['index.md'],
        path: 'drupal/index.html',
        isDrupalPage: true,
        private: true,
      };
    }
    writeDrupalDebugPage(files);
    done();
  };
}

module.exports = addDrupalPrefix;
