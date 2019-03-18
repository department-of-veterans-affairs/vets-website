/* eslint-disable no-param-reassign */

const { ENABLED_ENVIRONMENTS } = require('../../../constants/drupals');
const { logDrupal: log } = require('../drupal/utilities-drupal');

function createErrorPage(drupalError) {
  return `
    <!doctype html>
    <html>
    <body>
      <h1>An error occurred while executing the Metalsmith-Drupal plugin</h1>
      <pre>${JSON.stringify(drupalError)}</pre>
    </body>
    </html>
  `;
}

function createIndexPage(files) {
  const drupalPages = Object.keys(files)
    .filter(fileName => files[fileName].isDrupalPage)
    .map(fileName => `<li><a href="/${fileName}">${fileName}</a></li>`)
    .join('');

  const drupalIndex = `
    <h1>The following pages were provided by Drupal:</h1>
    <ol>${drupalPages}</ol>
  `;

  return drupalIndex;
}

function createDrupalDebugPage(buildOptions) {
  if (!ENABLED_ENVIRONMENTS.has(buildOptions.buildtype)) {
    const noop = () => {};
    return noop;
  }

  return (files, smith, done) => {
    log('Drupal debug page written to /drupal/debug.');

    let drupalDebugPage = null;
    const { drupalError } = smith.metadata();

    if (drupalError) drupalDebugPage = createErrorPage(drupalError);
    else drupalDebugPage = createIndexPage(files);

    files['drupal/debug/index.html'] = {
      contents: Buffer.from(drupalDebugPage),
      path: '/drupal/debug/',
      isDrupalPage: true,
      private: true,
    };

    done();
  };
}

module.exports = createDrupalDebugPage;
