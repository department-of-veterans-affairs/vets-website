/* eslint-disable no-param-reassign, no-continue */

const {
  ENABLED_ENVIRONMENTS,
  PREFIXED_ENVIRONMENTS,
} = require('../../../constants/drupals');

function rewriteDrupalPages(options) {
  return (files, metalsmith, done) => {
    if (
      ENABLED_ENVIRONMENTS.has(options.buildtype) &&
      PREFIXED_ENVIRONMENTS.has(options.buildtype)
    ) {
      const replacements = Object.keys(files)
        .filter(fileName => files[`drupal/${fileName}`])
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

    done();
  };
}

module.exports = rewriteDrupalPages;
