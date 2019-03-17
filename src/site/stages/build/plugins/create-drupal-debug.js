const { ENABLED_ENVIRONMENTS } = require('../../../constants/drupals');
const { logDrupal: log } = require('../drupal/utilities-drupal');

function createDrupalDebugPage(buildOptions) {
  if (!ENABLED_ENVIRONMENTS.has(buildOptions.buildtype)) {
    const noop = () => {};
    return noop;
  }

  return (files, smith, done) => {
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
      path: '/drupal/debug/',
      isDrupalPage: true,
      private: true,
    };

    done();
  };
}

module.exports = createDrupalDebugPage;
